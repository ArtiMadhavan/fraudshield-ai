from sqlalchemy.orm import Session
from app.repositories.transaction_repo import TransactionRepository
from app.services.decision_engine import AIDecisionEngine
import asyncio

class TransactionService:
    def __init__(self, db: Session):
        self.repo = TransactionRepository(db)

    def process_payment(self, tx_request: dict) -> dict:
        customer_name = tx_request["customer_name"]
        merchant_name = tx_request["merchant_name"]
        
        # Auto-create Customer and Merchant if they don't exist
        customer = self.repo.get_or_create_customer(customer_name, tx_request.get("customer_mobile"))
        merchant = self.repo.get_or_create_merchant(merchant_name, tx_request.get("merchant_category"))
        
        # Fetch history
        cust_history = self.repo.get_customer_history(customer_name)
        merchant_risk = self.repo.get_merchant_risk(merchant_name)
        
        # Enrich payload
        enriched_tx = tx_request.copy()
        enriched_tx["customer_history"] = cust_history
        enriched_tx["merchant_fraud_percentage"] = merchant_risk
        
        # AI Decision Engine
        decision_result = AIDecisionEngine.evaluate_transaction(
            transaction_data=enriched_tx
        )
        
        # Save to DB
        tx_id, status = self.repo.save_transaction(
            tx_data=tx_request,
            decision_result=decision_result,
            customer_id=customer.id,
            merchant_id=merchant.id
        )
        
        decision_result["transaction_id"] = tx_id
        decision_result["status"] = status
        
        # Broadcast WebSockets event
        from app.api.v1.endpoints.websockets import manager
        
        async def broadcast_event():
            await manager.broadcast({
                "type": "NEW_TRANSACTION",
                "data": decision_result
            })
            if decision_result.get("decision") in ["BLOCK", "REVIEW"]:
                await manager.broadcast({
                    "type": "NEW_ALERT",
                    "data": decision_result
                })
            
        try:
            loop = asyncio.get_running_loop()
            loop.create_task(broadcast_event())
        except RuntimeError:
            pass
            
        return decision_result

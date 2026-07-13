from sqlalchemy.orm import Session
from app.repositories.transaction_repo import TransactionRepository
from app.services.decision_engine import AIDecisionEngine
import joblib
import pandas as pd
import os

class TransactionService:
    def __init__(self, db: Session):
        self.repo = TransactionRepository(db)

    def process_payment(self, tx_request: dict) -> dict:
        # Fetch history
        cust_history = self.repo.get_customer_history(tx_request["customer_id"])
        merchant_risk = self.repo.get_merchant_risk(tx_request["merchant_id"])
        
        # Enrich payload
        enriched_tx = tx_request.copy()
        enriched_tx["customer_history"] = cust_history
        enriched_tx["merchant_fraud_percentage"] = merchant_risk
        
        # AI Decision Engine (Now handles live ML natively)
        decision_result = AIDecisionEngine.evaluate_transaction(
            transaction_data=enriched_tx
        )
        
        # Save to DB
        c_id, m_id = self.repo.get_customer_and_merchant_ids(tx_request["customer_id"], tx_request["merchant_id"])
        
        # Mock IDs if they don't exist for demo seamless flow
        c_id = c_id or 1
        m_id = m_id or 1
        
        tx_id, status = self.repo.save_transaction(
            tx_data=tx_request,
            decision_result=decision_result,
            customer_id=c_id,
            merchant_id=m_id
        )
        
        decision_result["transaction_id"] = tx_id
        decision_result["status"] = status
        
        # Broadcast WebSockets event
        from app.api.v1.endpoints.websockets import manager
        import asyncio
        
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
            pass # Handle outside of event loop if necessary
            
        return decision_result

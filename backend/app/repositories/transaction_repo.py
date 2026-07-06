from sqlalchemy.orm import Session
from app.models.models import Transaction, FraudPrediction, Customer, Merchant, FraudAlert
import uuid

class TransactionRepository:
    def __init__(self, db: Session):
        self.db = db
        
    def save_transaction(self, tx_data: dict, decision_result: dict, customer_id: int, merchant_id: int) -> str:
        tx_id = str(uuid.uuid4())
        
        # Determine status based on decision
        status_map = {
            "Approve": "completed",
            "Review": "processing", # Or "reviewed" state
            "Block": "blocked"
        }
        status = status_map.get(decision_result["decision"], "processing")
        
        db_transaction = Transaction(
            transaction_id=tx_id,
            customer_id=customer_id,
            merchant_id=merchant_id,
            amount=tx_data.get("amount"),
            currency=tx_data.get("currency", "USD"),
            payment_method=tx_data.get("payment_method"),
            device=tx_data.get("device"),
            browser=tx_data.get("browser"),
            os=tx_data.get("os"),
            location=tx_data.get("location"),
            ip_address=tx_data.get("ip_address"),
            transaction_type=tx_data.get("transaction_type"),
            status=status
        )
        self.db.add(db_transaction)
        
        db_prediction = FraudPrediction(
            transaction_id=tx_id,
            ml_probability=decision_result.get("confidence") / 100 if decision_result["decision"] == "Block" else (100 - decision_result.get("confidence")) / 100, # Mock prob extraction
            risk_score=decision_result["risk_score"],
            risk_level=decision_result["risk_level"],
            recommendation=decision_result["decision"],
            confidence=decision_result["confidence"],
            rule_explanations=" | ".join(decision_result["explanations"])
        )
        self.db.add(db_prediction)
        
        if decision_result["decision"] in ["Block", "Review"]:
            db_alert = FraudAlert(
                transaction_id=tx_id,
                severity=decision_result["risk_level"],
                status="open",
                analyst_notes="System generated alert."
            )
            self.db.add(db_alert)
            
        self.db.commit()
        return tx_id, status

    def get_customer_history(self, customer_uid: str) -> dict:
        customer = self.db.query(Customer).filter(Customer.customer_id == customer_uid).first()
        if not customer:
            return {"has_previous_transactions": False, "average_monthly_spend": 0}
            
        # Simplified query for history
        return {
            "has_previous_transactions": True,
            "average_monthly_spend": customer.average_monthly_spend,
            "risk_score": customer.risk_score
        }
        
    def get_merchant_risk(self, merchant_uid: str) -> float:
        merchant = self.db.query(Merchant).filter(Merchant.merchant_id == merchant_uid).first()
        if not merchant:
            return 0.0
        return merchant.fraud_percentage
        
    def get_customer_and_merchant_ids(self, customer_uid: str, merchant_uid: str):
        c = self.db.query(Customer).filter(Customer.customer_id == customer_uid).first()
        m = self.db.query(Merchant).filter(Merchant.merchant_id == merchant_uid).first()
        return c.id if c else None, m.id if m else None

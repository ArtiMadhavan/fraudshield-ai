from sqlalchemy.orm import Session
from app.models.models import Transaction, FraudPrediction, Customer, Merchant, FraudAlert
import uuid
from datetime import datetime
import json

class TransactionRepository:
    def __init__(self, db: Session):
        self.db = db
        
    def get_or_create_customer(self, name: str, mobile: str = None) -> Customer:
        customer_id_str = f"CUST_{name.replace(' ', '').upper()}"
        customer = self.db.query(Customer).filter(Customer.customer_id == customer_id_str).first()
        if not customer:
            customer = Customer(
                customer_id=customer_id_str,
                name=name,
                mobile_number=mobile,
                kyc_status="Verified"
            )
            self.db.add(customer)
            self.db.commit()
            self.db.refresh(customer)
        return customer

    def get_or_create_merchant(self, name: str, category: str) -> Merchant:
        merchant_id_str = f"MERCH_{name.replace(' ', '').upper()}"
        merchant = self.db.query(Merchant).filter(Merchant.merchant_id == merchant_id_str).first()
        if not merchant:
            merchant = Merchant(
                merchant_id=merchant_id_str,
                name=name,
                category=category,
                risk_rating="Low"
            )
            self.db.add(merchant)
            self.db.commit()
            self.db.refresh(merchant)
        return merchant

    def save_transaction(self, tx_data: dict, decision_result: dict, customer_id: int, merchant_id: int) -> str:
        tx_id = f"TXN{datetime.now().strftime('%Y%m%d%H%M%S')}{uuid.uuid4().hex[:4].upper()}"
        
        status_map = {
            "APPROVE": "Completed",
            "REVIEW": "Processing",
            "BLOCK": "Blocked"
        }
        status = status_map.get(decision_result["decision"], "Processing")
        
        db_transaction = Transaction(
            transaction_id=tx_id,
            customer_id=customer_id,
            merchant_id=merchant_id,
            amount=tx_data.get("amount"),
            currency="INR",
            payment_method=tx_data.get("payment_method"),
            upi_app=tx_data.get("upi_app"),
            upi_id=tx_data.get("upi_id"),
            bank_name=tx_data.get("bank_name"),
            device=tx_data.get("device"),
            city=tx_data.get("city"),
            state=tx_data.get("state"),
            ip_address=tx_data.get("ip_address"),
            status=status
        )
        self.db.add(db_transaction)
        
        db_prediction = FraudPrediction(
            transaction_id=tx_id,
            fraud_probability=decision_result.get("fraud_probability", 0.0),
            risk_score=decision_result.get("risk_score", 0.0),
            risk_level=decision_result.get("risk_level", "Low"),
            decision=decision_result.get("decision", "APPROVE"),
            recommendation=decision_result.get("recommendation", ""),
            confidence=decision_result.get("confidence", 0.0),
            reasons=json.dumps(decision_result.get("reasons", []))
        )
        self.db.add(db_prediction)
        
        if decision_result["decision"] in ["BLOCK", "REVIEW"]:
            db_alert = FraudAlert(
                transaction_id=tx_id,
                severity=decision_result.get("risk_level", "High"),
                status="open"
            )
            self.db.add(db_alert)
            
        self.db.commit()
        return tx_id, status

    def get_customer_history(self, name: str) -> dict:
        customer_id_str = f"CUST_{name.replace(' ', '').upper()}"
        customer = self.db.query(Customer).filter(Customer.customer_id == customer_id_str).first()
        if not customer:
            return {"has_previous_transactions": False, "average_monthly_spend": 0}
            
        return {
            "has_previous_transactions": True,
            "average_monthly_spend": customer.wallet_balance, # mock for now
            "risk_score": customer.risk_score
        }
        
    def get_merchant_risk(self, name: str) -> float:
        merchant_id_str = f"MERCH_{name.replace(' ', '').upper()}"
        merchant = self.db.query(Merchant).filter(Merchant.merchant_id == merchant_id_str).first()
        if not merchant:
            return 0.0
        return merchant.fraud_percentage

from sqlalchemy.orm import Session
from app.repositories.transaction_repo import TransactionRepository
from app.services.decision_engine import AIDecisionEngine
import joblib
import pandas as pd
import os

# Load ML model once globally
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../../../ml_engine/models/production_fraud_model.joblib")
try:
    production_model = joblib.load(MODEL_PATH)
except Exception as e:
    production_model = None
    print(f"Warning: ML model not found. Using fallback mock probability. Error: {e}")

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
        
        # ML Inference
        ml_prob = 0.05 # default
        if production_model:
            try:
                # Prepare DataFrame for pipeline (needs to match training features exactly)
                features = ['merchant_category', 'payment_method', 'device_type', 'browser', 'os', 'transaction_type', 'currency', 'amount', 'transaction_hour']
                # Create a mock dataframe row
                df = pd.DataFrame([{
                    'merchant_category': 'Retail', # Mock fallback
                    'payment_method': tx_request.get('payment_method'),
                    'device_type': tx_request.get('device'),
                    'browser': tx_request.get('browser'),
                    'os': tx_request.get('os'),
                    'transaction_type': tx_request.get('transaction_type'),
                    'currency': tx_request.get('currency'),
                    'amount': tx_request.get('amount'),
                    'transaction_hour': 14 # Mock
                }])
                prob = production_model.predict_proba(df)[0][1]
                ml_prob = float(prob)
            except Exception as e:
                print(f"ML Inference failed, using fallback: {e}")
                if tx_request.get("amount", 0) > 5000:
                    ml_prob = 0.85
        else:
            if tx_request.get("amount", 0) > 5000:
                ml_prob = 0.85
                
        # AI Decision Engine
        decision_result = AIDecisionEngine.evaluate_transaction(
            transaction_data=enriched_tx,
            ml_probability=ml_prob
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
        
        return decision_result

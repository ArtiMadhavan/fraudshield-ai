import joblib
import os
import random
import pandas as pd
from datetime import datetime

class AIDecisionEngine:
    @staticmethod
    def evaluate_transaction(transaction_data: dict) -> dict:
        """
        Loads the champion ML model to predict probability, combines with business rules.
        """
        try:
            model_path = os.path.join(os.path.dirname(__file__), '..', 'ml_engine', 'models', 'fraud_model.joblib')
            model = joblib.load(model_path)
            
            # Extract features matching the model training script
            amount = transaction_data.get('amount', 0)
            c_risk = transaction_data.get('customer_history', {}).get('risk_score', 0)
            m_risk = transaction_data.get('merchant_fraud_percentage', 0) * 10
            
            tx_time = transaction_data.get('transaction_time')
            if not tx_time:
                tx_time = datetime.now()
            elif isinstance(tx_time, str):
                try:
                    tx_time = datetime.fromisoformat(tx_time.replace("Z", "+00:00"))
                except:
                    tx_time = datetime.now()
                    
            hour_of_day = tx_time.hour
            is_upi = 1 if transaction_data.get('payment_method') == 'UPI' else 0
            is_new_device = 1 if not transaction_data.get('customer_history', {}).get('has_previous_transactions', False) else 0
            velocity = random.randint(0, 5) # simplified velocity mock
            
            features = pd.DataFrame([{
                'amount': amount,
                'customer_risk_score': c_risk,
                'merchant_risk_score': m_risk,
                'hour_of_day': hour_of_day,
                'is_upi': is_upi,
                'is_new_device': is_new_device,
                'velocity_1h': velocity
            }])
            
            if hasattr(model, "predict_proba"):
                ml_probability = float(model.predict_proba(features)[0][1])
            else:
                ml_probability = float(model.predict(features)[0])
                
        except Exception as e:
            print(f"ML Model Error: {e}")
            ml_probability = 0.05 # Fallback
            
        base_score = ml_probability * 100
        risk_modifier = 0
        rules_triggered = []
        
        if amount > 50000:
            risk_modifier += 20
            rules_triggered.append("High Amount")
        if is_new_device == 1:
            risk_modifier += 15
            rules_triggered.append("New Device")
        if m_risk >= 10:  # Assuming 10 is high risk
            risk_modifier += 20
            rules_triggered.append("Merchant Risk High")
        if velocity > 5:
            risk_modifier += 25
            rules_triggered.append("Velocity Rule Triggered")
        if ml_probability > 0.80:
            risk_modifier += 30
            rules_triggered.append("High AI Fraud Probability")
            
        final_risk_score = min(max(base_score * 0.4 + risk_modifier, 0), 100) # Weighted to avoid always maxing at 100
        
        if final_risk_score >= 70:
            decision = "BLOCK"
            risk_level = "Critical"
        elif final_risk_score >= 40:
            decision = "REVIEW"
            risk_level = "Medium"
        else:
            decision = "APPROVE"
            risk_level = "Safe"
            
        recommendation = "Approve transaction."
        if decision == "BLOCK":
            recommendation = "Block transaction and notify analyst."
        elif decision == "REVIEW":
            recommendation = "Hold transaction for manual review."
            
        return {
            "decision": decision,
            "risk_score": round(final_risk_score, 0),
            "risk_level": risk_level,
            "fraud_probability": round(ml_probability, 4),
            "confidence": round(max(ml_probability, 1 - ml_probability) * 100, 2),
            "reasons": rules_triggered,
            "recommendation": recommendation
        }

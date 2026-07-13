import joblib
import os
import random
import pandas as pd
from app.services.explainability import RuleBasedExplainabilityEngine

class AIDecisionEngine:
    @staticmethod
    def evaluate_transaction(transaction_data: dict) -> dict:
        """
        Loads the live ML model to predict probability, then combines it with business rules.
        """
        try:
            model_path = os.path.join(os.path.dirname(__file__), '..', '..', 'ml_engine', 'fraud_model.joblib')
            model = joblib.load(model_path)
            
            features = pd.DataFrame([{
                'amount': transaction_data.get('amount', 0),
                'velocity': transaction_data.get('customer_history', {}).get('velocity', 1) if transaction_data.get('customer_history') else 1,
                'distance': transaction_data.get('distance_km', 10)
            }])
            
            ml_probability = float(model.predict_proba(features)[0][1])
        except Exception as e:
            print(f"ML Model Error: {e}")
            ml_probability = 0.05 # Fallback to low risk
            
        base_score = ml_probability * 100
        
        # Adjust risk score based on enterprise history
        customer_history = transaction_data.get('customer_history', {})
        merchant_risk = transaction_data.get('merchant_fraud_percentage', 0.0)
        
        risk_modifier = 0
        rules_triggered = []
        
        # If new customer or highly risky merchant, bump up the risk
        if not customer_history.get('has_previous_transactions', False):
            risk_modifier += 5
            rules_triggered.append("New Customer")
        if merchant_risk > 3.0:
            risk_modifier += 10
            rules_triggered.append("High Risk Merchant")
            
        # Velocity rule
        velocity = customer_history.get('velocity', 1) if customer_history else 1
        if velocity > 5:
            risk_modifier += 20
            rules_triggered.append("Velocity > 5")
            
        # If amount is very low, reduce risk slightly
        if transaction_data.get('amount', 0) < 10:
            risk_modifier -= 10
            
        final_risk_score = min(max(base_score + risk_modifier, 0), 100)
        
        # Risk Thresholds
        if final_risk_score >= 90:
            decision = "BLOCK"
            risk_level = "Critical"
        elif final_risk_score >= 60:
            decision = "REVIEW"
            risk_level = "High" if final_risk_score >= 75 else "Medium"
        else:
            decision = "APPROVE"
            risk_level = "Low"
            
        # Generate Human-Readable Explanations
        reasons = RuleBasedExplainabilityEngine.generate_explanations(
            transaction_data=transaction_data,
            risk_score=final_risk_score,
            ml_probability=ml_probability
        )
        
        recommendation = "Approve transaction."
        if decision == "BLOCK":
            recommendation = "Block transaction and notify fraud analyst."
        elif decision == "REVIEW":
            recommendation = "Hold transaction for manual review."
        
        return {
            "decision": decision,
            "risk_score": round(final_risk_score, 2),
            "risk_level": risk_level,
            "fraud_probability": round(ml_probability, 4),
            "confidence": round(max(ml_probability, 1 - ml_probability) * 100, 2),
            "reasons": reasons,
            "recommendation": recommendation
        }

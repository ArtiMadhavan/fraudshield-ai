from app.services.explainability import RuleBasedExplainabilityEngine

class AIDecisionEngine:
    @staticmethod
    def evaluate_transaction(transaction_data: dict, ml_probability: float) -> dict:
        """
        Combines ML probability with business rules to make a final decision.
        Returns: decision, risk_score, risk_level, explanations
        """
        base_score = ml_probability * 100
        
        # Adjust risk score based on enterprise history
        customer_history = transaction_data.get('customer_history', {})
        merchant_risk = transaction_data.get('merchant_fraud_percentage', 0.0)
        
        risk_modifier = 0
        
        # If new customer or highly risky merchant, bump up the risk
        if not customer_history.get('has_previous_transactions', False):
            risk_modifier += 5
        if merchant_risk > 3.0:
            risk_modifier += 10
            
        # If amount is very low, reduce risk slightly
        if transaction_data.get('amount', 0) < 10:
            risk_modifier -= 10
            
        final_risk_score = min(max(base_score + risk_modifier, 0), 100)
        
        # Risk Thresholds
        if final_risk_score >= 90:
            decision = "Block"
            risk_level = "Critical"
        elif final_risk_score >= 60:
            decision = "Review"
            risk_level = "High" if final_risk_score >= 75 else "Medium"
        else:
            decision = "Approve"
            risk_level = "Low"
            
        # Generate Human-Readable Explanations
        explanations = RuleBasedExplainabilityEngine.generate_explanations(
            transaction_data=transaction_data,
            risk_score=final_risk_score,
            ml_probability=ml_probability
        )
        
        return {
            "decision": decision,
            "risk_score": round(final_risk_score, 2),
            "risk_level": risk_level,
            "confidence": round(max(ml_probability, 1 - ml_probability) * 100, 2),
            "explanations": explanations
        }

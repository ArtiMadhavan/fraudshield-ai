class RuleBasedExplainabilityEngine:
    @staticmethod
    def generate_explanations(transaction_data: dict, risk_score: float, ml_probability: float) -> list[str]:
        reasons = []
        
        amount = transaction_data.get('amount', 0)
        customer_history = transaction_data.get('customer_history', {})
        merchant_risk = transaction_data.get('merchant_fraud_percentage', 0)
        hour = transaction_data.get('transaction_hour', 12)
        
        # Rule 1: Amount threshold
        avg_spend = customer_history.get('average_monthly_spend', 500)
        if amount > avg_spend * 2 and avg_spend > 0:
            reasons.append(f"Transaction amount (${amount}) is significantly higher than customer's average (${avg_spend}).")
            
        # Rule 2: High-risk merchant
        if merchant_risk > 5.0:
            reasons.append(f"Merchant has a high historical fraud rate ({merchant_risk}%).")
            
        # Rule 3: Time of day
        if hour < 5 or hour > 23:
            reasons.append("Transaction occurred at an unusual time (late night/early morning).")
            
        # Rule 4: Device/Location Mismatches (mock logic for demo)
        if transaction_data.get('is_new_device', False) or transaction_data.get('device') == 'Unknown':
            reasons.append("Payment initiated from a new or unrecognized device.")
            
        if transaction_data.get('is_new_location', False):
            reasons.append("Transaction originated from an unusual geographic location.")

        # ML Base contribution
        if ml_probability > 0.8:
            reasons.append("Machine Learning model identified high-confidence fraud patterns.")
            
        if not reasons:
            reasons.append("Standard transaction behavior detected. No major risk factors.")
            
        return reasons

from app.services.decision_engine import AIDecisionEngine

def test_decision_engine_approve():
    tx_data = {
        "amount": 50,
        "customer_history": {"fraud_count": 0},
        "merchant_fraud_percentage": 1.0,
        "payment_method": "credit_card",
        "device_type": "desktop",
        "browser": "chrome",
        "os": "windows",
        "transaction_hour": 12,
        "merchant_category": "retail"
    }
    result = AIDecisionEngine.evaluate_transaction(tx_data)
    assert result["decision"] in ["APPROVE", "REVIEW", "BLOCK"]
    assert "risk_score" in result
    assert "reasons" in result

def test_decision_engine_block_high_amount():
    tx_data = {
        "amount": 15000, # Very high amount
        "customer_history": {"fraud_count": 0},
        "merchant_fraud_percentage": 1.0,
        "payment_method": "credit_card",
        "device_type": "desktop",
        "browser": "chrome",
        "os": "windows",
        "transaction_hour": 3, # 3 AM
        "merchant_category": "electronics"
    }
    result = AIDecisionEngine.evaluate_transaction(tx_data)
    # The rule-based engine should catch the high amount
    assert result["risk_score"] > 50
    assert any("amount" in str(reason).lower() or "velocity" in str(reason).lower() for reason in result["reasons"])

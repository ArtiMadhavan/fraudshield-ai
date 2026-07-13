def test_transaction_upload(client, admin_token):
    payload = {
        "customer_id": "cust_123",
        "merchant_id": "merch_456",
        "amount": 500.0,
        "currency": "USD",
        "payment_method": "credit_card",
        "device": "desktop",
        "browser": "chrome",
        "os": "windows",
        "ip_address": "192.168.1.1",
        "location": "New York",
        "transaction_type": "purchase"
    }
    import json
    response = client.post(
        "/api/v1/payments/upload",
        files={"file": ("transactions.json", json.dumps([payload]), "application/json")},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "details" in data
    assert len(data["details"]) == 1
    
    result = data["details"][0]
    result = result["decision"]
    assert "decision" in result
    assert "risk_score" in result
    assert "fraud_probability" in result

def test_transaction_upload_validation_error(client, admin_token):
    # Missing required field 'amount'
    payload = {
        "customer_id": "cust_123",
        "merchant_id": "merch_456"
    }
    import json
    response = client.post(
        "/api/v1/payments/upload",
        files={"file": ("transactions.json", json.dumps([payload]), "application/json")},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["failed"] == 1
    assert "error" in data["details"][0]


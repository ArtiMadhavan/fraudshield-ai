from app.models.models import Customer
import uuid

def test_create_customer(setup_database):
    from conftest import TestingSessionLocal
    db = TestingSessionLocal()
    
    new_id = str(uuid.uuid4())
    customer = Customer(
        customer_id=new_id,
        name="Test User",
        email="test@example.com",
        kyc_status="Verified",
        credit_score=750,
        wallet_balance=100.0,
        risk_score=10.0,
        monthly_spend=500.0,
        average_monthly_spend=500.0,
        clv=1000.0,
        device_history="[]",
        location_history="[]"
    )
    db.add(customer)
    db.commit()
    
    saved_customer = db.query(Customer).filter(Customer.email == "test@example.com").first()
    assert saved_customer is not None
    assert saved_customer.name == "Test User"
    
    db.close()

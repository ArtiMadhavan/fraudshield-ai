import random
import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.models import Customer, Merchant, Transaction, FraudPrediction, FraudAlert

def seed_indian_demo_data(db: Session):
    # Clear existing demo data
    db.query(FraudAlert).delete()
    db.query(FraudPrediction).delete()
    db.query(Transaction).delete()
    db.query(Customer).delete()
    db.query(Merchant).delete()
    db.commit()

    # Merchants
    merchants_data = [
        ("Amazon India", "E-commerce"),
        ("Flipkart", "E-commerce"),
        ("Zomato", "Food Delivery"),
        ("Swiggy", "Food Delivery"),
        ("MakeMyTrip", "Travel"),
        ("IRCTC", "Travel"),
        ("Croma", "Electronics"),
        ("Reliance Digital", "Electronics"),
        ("Zepto", "Grocery"),
        ("Blinkit", "Grocery")
    ]
    
    merchant_objs = []
    for m_name, m_cat in merchants_data:
        merchant = Merchant(
            merchant_id=f"MERCH_{m_name.replace(' ', '').upper()}",
            name=m_name,
            category=m_cat,
            total_revenue=random.uniform(50000, 500000),
            fraud_percentage=random.uniform(0.1, 2.0),
            risk_rating="Low" if random.random() > 0.1 else "Medium"
        )
        db.add(merchant)
        merchant_objs.append(merchant)
    db.commit()
    
    # Customers
    customers_data = [
        "Aarav Singh", "Arti Madhavan", "Rahul Sharma", "Priya Patel", 
        "Karthik Iyer", "Neha Gupta", "Vikram Reddy", "Sneha Desai",
        "Arjun Kapoor", "Meera Namboothiri"
    ]
    
    customer_objs = []
    for c_name in customers_data:
        customer = Customer(
            customer_id=f"CUST_{c_name.replace(' ', '').upper()}",
            name=c_name,
            kyc_status="Verified",
            wallet_balance=random.uniform(1000, 50000),
            risk_score=random.uniform(10, 50)
        )
        db.add(customer)
        customer_objs.append(customer)
    db.commit()
    
    # Transactions
    cities = ["Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai", "Kolkata"]
    states = ["Karnataka", "Maharashtra", "Delhi", "Telangana", "Maharashtra", "Tamil Nadu", "West Bengal"]
    payment_methods = ["UPI", "Credit Card", "Debit Card", "Net Banking", "Wallet"]
    upi_apps = ["PhonePe", "Google Pay", "Paytm", "BHIM"]
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    
    for _ in range(500): # Seed 500 transactions for demo
        c = random.choice(customer_objs)
        m = random.choice(merchant_objs)
        
        is_fraud = random.random() < 0.05 # 5% fraud
        
        amount = random.uniform(100, 15000) if not is_fraud else random.uniform(20000, 150000)
        loc_idx = random.randint(0, len(cities)-1)
        
        tx_time = start_date + timedelta(seconds=random.randint(0, int((end_date - start_date).total_seconds())))
        
        tx_id = f"TXN{tx_time.strftime('%Y%m%d%H%M%S')}{uuid.uuid4().hex[:4].upper()}"
        
        pm = random.choice(payment_methods)
        
        tx = Transaction(
            transaction_id=tx_id,
            customer_id=c.id,
            merchant_id=m.id,
            amount=round(amount, 2),
            currency="INR",
            payment_method=pm,
            upi_app=random.choice(upi_apps) if pm == "UPI" else None,
            device=random.choice(["Android", "iOS", "Windows", "Mac"]),
            city=cities[loc_idx],
            state=states[loc_idx],
            status="Blocked" if is_fraud else "Completed",
            created_at=tx_time
        )
        db.add(tx)
        
        pred = FraudPrediction(
            transaction_id=tx_id,
            fraud_probability=random.uniform(0.8, 0.99) if is_fraud else random.uniform(0.01, 0.15),
            risk_score=random.uniform(85, 99) if is_fraud else random.uniform(5, 30),
            risk_level="Critical" if is_fraud else "Low",
            decision="BLOCK" if is_fraud else "APPROVE",
            confidence=random.uniform(85, 98),
            reasons="High Amount | Unusual Location" if is_fraud else "",
            created_at=tx_time
        )
        db.add(pred)
        
        if is_fraud:
            alert = FraudAlert(
                transaction_id=tx_id,
                severity="Critical",
                status="open",
                created_at=tx_time
            )
            db.add(alert)
            
    db.commit()
    return {"message": "Successfully loaded 500 transactions for demonstration!"}

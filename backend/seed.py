import random
import json
from faker import Faker
from app.core.database import SessionLocal, Base, engine
from app.models.models import User, Customer, Merchant, Transaction, FraudPrediction, FraudAlert, MLModel
from app.auth import get_password_hash
from datetime import datetime, timedelta

fake = Faker()

def seed_db():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    print("Seeding Admin Users...")
    for i in range(5):
        admin = User(
            username=f"admin_{i}",
            email=f"admin{i}@fraudshield.com",
            password_hash=get_password_hash("admin123"),
            role="admin"
        )
        db.add(admin)
    
    print("Seeding Analysts...")
    analysts = []
    for i in range(30):
        analyst = User(
            username=f"analyst_{i}",
            email=f"analyst{i}@fraudshield.com",
            password_hash=get_password_hash("analyst123"),
            role="analyst"
        )
        db.add(analyst)
        analysts.append(analyst)
    
    print("Seeding Customers...")
    customers = []
    for _ in range(300):
        c = Customer(
            customer_id=fake.uuid4(),
            name=fake.name(),
            email=fake.email(),
            kyc_status=random.choice(["Pending", "Verified", "Verified", "Rejected"]),
            credit_score=random.randint(300, 850),
            wallet_balance=random.uniform(0, 5000),
            risk_score=random.uniform(0, 100),
            monthly_spend=random.uniform(10, 2000),
            average_monthly_spend=random.uniform(100, 5000),
            clv=random.uniform(500, 20000),
            device_history=json.dumps([{"device": "iPhone 13", "last_seen": str(datetime.now())}]),
            location_history=json.dumps([{"city": fake.city(), "country": "USA"}])
        )
        db.add(c)
        customers.append(c)
    
    db.commit()

    print("Seeding Merchants...")
    merchants = []
    categories = ["retail", "electronics", "travel", "gaming", "services"]
    for _ in range(75):
        m = Merchant(
            merchant_id=fake.uuid4(),
            name=fake.company(),
            category=random.choice(categories),
            countries=json.dumps(["US", "CA", "GB"]),
            total_revenue=random.uniform(10000, 500000),
            settlement_status=random.choice(["Active", "Pending", "Suspended"]),
            chargeback_percentage=random.uniform(0, 2),
            fraud_percentage=random.uniform(0, 5),
            risk_level=random.choice(["Low", "Medium", "High"])
        )
        db.add(m)
        merchants.append(m)
        
    db.commit()

    print("Seeding Transactions...")
    transactions = []
    for _ in range(5000):
        c = random.choice(customers)
        m = random.choice(merchants)
        t = Transaction(
            transaction_id=fake.uuid4(),
            customer_id=c.id,
            merchant_id=m.id,
            amount=random.uniform(5, 2000),
            currency="USD",
            payment_method=random.choice(["credit_card", "debit_card", "paypal", "crypto", "upi"]),
            device=random.choice(["mobile", "desktop", "tablet"]),
            browser=random.choice(["chrome", "safari", "firefox", "edge"]),
            os=random.choice(["windows", "ios", "android", "macos"]),
            location=fake.city(),
            ip_address=fake.ipv4(),
            transaction_type=random.choice(["purchase", "refund", "transfer"]),
            status=random.choice(["completed", "processing", "failed", "completed", "completed"])
        )
        db.add(t)
        transactions.append(t)
        
    db.commit()

    print("Seeding Fraud Predictions...")
    predictions = []
    # Assign predictions to 10% of transactions roughly, or just 500 for a healthy mix
    for t in random.sample(transactions, min(500, len(transactions))):
        p = FraudPrediction(
            transaction_id=t.transaction_id,
            ml_probability=random.uniform(0, 1),
            risk_score=random.uniform(0, 100),
            risk_level=random.choice(["Low", "Medium", "High", "Critical"]),
            recommendation=random.choice(["APPROVE", "REVIEW", "BLOCK"]),
            confidence=random.uniform(0.5, 0.99),
            rule_explanations=json.dumps(["Velocity check failed", "High Amount"])
        )
        db.add(p)
        predictions.append(p)
        
    db.commit()

    print("Seeding Fraud Alerts...")
    alerts = []
    for t in random.sample(transactions, min(300, len(transactions))):
        a = FraudAlert(
            transaction_id=t.transaction_id,
            severity=random.choice(["Low", "Medium", "High", "Critical"]),
            priority=random.choice(["Low", "Medium", "High"]),
            status=random.choice(["open", "investigating", "resolved", "closed"]),
            resolution_status=random.choice([None, "True Positive", "False Positive"]),
            assigned_to=random.choice(analysts).id if random.random() > 0.5 else None,
            analyst_notes="Requires immediate review.",
            evidence=json.dumps({"ip_mismatch": True, "distance_km": 500}),
            timeline_events=json.dumps([{"action": "Alert Created", "time": str(datetime.now())}])
        )
        db.add(a)
        alerts.append(a)

    db.commit()

    print("Seeding ML Model...")
    ml_model = MLModel(
        version="v1.0.0",
        dataset_name="transactions_2025_Q1",
        algorithm="XGBoost",
        accuracy=0.98,
        precision=0.96,
        recall=0.94,
        f1_score=0.95,
        roc_auc=0.99,
        confusion_matrix=json.dumps({"TN": 9500, "FP": 100, "FN": 50, "TP": 350}),
        feature_importance=json.dumps({"amount": 0.4, "velocity": 0.3, "country": 0.2, "device": 0.1}),
        is_active=True
    )
    db.add(ml_model)
    db.commit()

    db.close()
    print("Database seeding completed.")

if __name__ == "__main__":
    seed_db()

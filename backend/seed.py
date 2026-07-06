import random
from faker import Faker
from app.core.database import SessionLocal, Base, engine
from app.models.models import User, Customer, Merchant, Transaction, FraudPrediction, FraudAlert
from app.auth import get_password_hash

fake = Faker()

def seed_db():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    print("Seeding Admin User...")
    admin = User(
        username="admin",
        email="admin@fraudshield.com",
        password_hash=get_password_hash("admin123"),
        role="admin"
    )
    db.add(admin)
    
    print("Seeding Customers...")
    customers = []
    for _ in range(50):
        c = Customer(
            customer_id=fake.uuid4(),
            name=fake.name(),
            email=fake.email(),
            risk_score=random.uniform(0, 100),
            average_monthly_spend=random.uniform(100, 5000),
            clv=random.uniform(500, 20000)
        )
        db.add(c)
        customers.append(c)
    
    db.commit()

    print("Seeding Merchants...")
    merchants = []
    categories = ["retail", "electronics", "travel", "gaming", "services"]
    for _ in range(20):
        m = Merchant(
            merchant_id=fake.uuid4(),
            name=fake.company(),
            category=random.choice(categories),
            total_revenue=random.uniform(10000, 500000),
            fraud_percentage=random.uniform(0, 5)
        )
        db.add(m)
        merchants.append(m)
        
    db.commit()

    print("Seeding Transactions...")
    transactions = []
    for _ in range(500):
        c = random.choice(customers)
        m = random.choice(merchants)
        t = Transaction(
            transaction_id=fake.uuid4(),
            customer_id=c.id,
            merchant_id=m.id,
            amount=random.uniform(5, 2000),
            currency="USD",
            payment_method=random.choice(["credit_card", "debit_card", "paypal", "crypto"]),
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
    for _ in range(50):
        t = random.choice(transactions)
        p = FraudPrediction(
            transaction_id=t.transaction_id,
            ml_probability=random.uniform(0, 1),
            risk_score=random.uniform(0, 100),
            risk_level=random.choice(["low", "medium", "high", "critical"]),
            recommendation=random.choice(["approve", "review", "reject"]),
            confidence=random.uniform(0.5, 0.99),
            rule_explanations="Generated rule explanation based on velocity and amount."
        )
        db.add(p)
        predictions.append(p)
        
    db.commit()

    print("Seeding Fraud Alerts...")
    alerts = []
    for _ in range(20):
        t = random.choice(transactions)
        a = FraudAlert(
            transaction_id=t.transaction_id,
            severity=random.choice(["low", "medium", "high", "critical"]),
            status=random.choice(["open", "in_progress", "resolved"]),
            analyst_notes="Requires immediate review."
        )
        db.add(a)
        alerts.append(a)

    db.commit()
    db.close()
    print("Database seeding completed.")

if __name__ == "__main__":
    seed_db()

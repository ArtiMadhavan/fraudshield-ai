from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Customer

router = APIRouter()

@router.get("/")
def get_customers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    customers = db.query(Customer).offset(skip).limit(limit).all()
    return customers

@router.get("/{customer_id}")
def get_customer(customer_id: str, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
        
    # Generate mock spending trend
    import random
    spendingTrend = [
        {"month": "Jan", "amount": random.randint(300, 800)},
        {"month": "Feb", "amount": random.randint(400, 900)},
        {"month": "Mar", "amount": random.randint(350, 850)},
        {"month": "Apr", "amount": random.randint(500, 1200)},
        {"month": "May", "amount": random.randint(450, 1000)},
        {"month": "Jun", "amount": random.randint(600, 1500)},
    ]
    
    # Generate AI summary
    summary = f"Customer has a risk score of {customer.risk_score}/100. Recent activity indicates stable purchasing behavior with occasional high-value transactions. Device footprint is consistent across 2 registered devices."
    
    result = {
        "id": customer.customer_id,
        "name": customer.name,
        "email": customer.email,
        "risk_score": customer.risk_score,
        "join_date": str(customer.created_at),
        "total_spent": sum([t["amount"] for t in spendingTrend]),
        "active_devices": random.randint(1, 3),
        "summary": summary,
        "spendingTrend": spendingTrend
    }
    return result

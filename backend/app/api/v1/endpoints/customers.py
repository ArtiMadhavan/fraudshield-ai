from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.models import Customer, Transaction, FraudPrediction, FraudAlert
import json

router = APIRouter()

@router.get("/")
def get_customers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    customers = db.query(Customer).offset(skip).limit(limit).all()
    return customers

@router.get("/{customer_id}/360")
def get_customer_360(customer_id: str, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not customer:
        customer = db.query(Customer).first()
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
            
    transactions = db.query(Transaction).filter(Transaction.customer_id == customer.id).order_by(Transaction.created_at.desc()).limit(10).all()
    
    import pandas as pd
    from datetime import datetime, timedelta
    
    start_date = datetime.utcnow() - timedelta(days=180)
    
    try:
        tx_df = pd.read_sql(db.query(Transaction.created_at, Transaction.amount).filter(Transaction.customer_id == customer.id, Transaction.created_at >= start_date).statement, db.bind)
    except:
        tx_df = pd.DataFrame()
        
    if not tx_df.empty:
        tx_df['month'] = pd.to_datetime(tx_df['created_at']).dt.strftime('%b')
        spending_trend = tx_df.groupby('month', sort=False)['amount'].sum().reset_index().to_dict('records')
    else:
        spending_trend = []

    fraud_history = []
    for tx in transactions:
        alert = db.query(FraudAlert).filter(FraudAlert.transaction_id == tx.transaction_id).first()
        if alert:
            fraud_history.append({
                "transaction_id": tx.transaction_id,
                "amount": tx.amount,
                "severity": alert.severity,
                "status": alert.status,
                "date": str(alert.created_at)
            })
            
    summary = f"Customer {customer.name} (KYC: {customer.kyc_status}) has a risk score of {customer.risk_score:.1f}/100. They have a wallet balance of ₹{customer.wallet_balance:,.2f}."
    
    formatted_txs = []
    for t in transactions:
        formatted_txs.append({
            "id": t.transaction_id,
            "amount": float(t.amount),
            "status": t.status,
            "payment_method": t.payment_method,
            "date": str(t.created_at)
        })

    result = {
        "id": customer.customer_id,
        "name": customer.name,
        "email": customer.email,
        "mobile": customer.mobile_number,
        "kyc_status": customer.kyc_status,
        "wallet_balance": customer.wallet_balance,
        "risk_score": customer.risk_score,
        "join_date": str(customer.created_at),
        "total_spent": sum([t["amount"] for t in spending_trend]),
        "device_history": ["Mobile App", "Web Portal"], # Mocked
        "location_history": ["Bengaluru, KA", "Mumbai, MH"], # Mocked
        "summary": summary,
        "spendingTrend": spending_trend,
        "recent_transactions": formatted_txs,
        "fraud_history": fraud_history
    }
    return result

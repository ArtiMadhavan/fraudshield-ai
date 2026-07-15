from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.models import Merchant, Transaction, FraudPrediction, FraudAlert
import json
import pandas as pd
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/")
def get_merchants(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    merchants = db.query(Merchant).offset(skip).limit(limit).all()
    return merchants

@router.get("/{merchant_id}/360")
def get_merchant_360(merchant_id: str, db: Session = Depends(get_db)):
    merchant = db.query(Merchant).filter(Merchant.merchant_id == merchant_id).first()
    if not merchant:
        merchant = db.query(Merchant).first()
        if not merchant:
            raise HTTPException(status_code=404, detail="Merchant not found")
            
    transactions = db.query(Transaction).filter(Transaction.merchant_id == merchant.id).order_by(Transaction.created_at.desc()).limit(10).all()
    
    start_date = datetime.utcnow() - timedelta(days=30)
    try:
        tx_df = pd.read_sql(db.query(Transaction.created_at, Transaction.amount).filter(Transaction.merchant_id == merchant.id, Transaction.created_at >= start_date).statement, db.bind)
    except:
        tx_df = pd.DataFrame()
        
    if not tx_df.empty:
        tx_df['date'] = pd.to_datetime(tx_df['created_at']).dt.strftime('%b %d')
        revenue_trend = tx_df.groupby('date', sort=False)['amount'].sum().reset_index().rename(columns={'amount': 'Revenue'}).to_dict('records')
    else:
        revenue_trend = []
        
    formatted_txs = []
    for t in transactions:
        formatted_txs.append({
            "id": t.transaction_id,
            "amount": float(t.amount),
            "status": t.status,
            "payment_method": t.payment_method,
            "date": str(t.created_at)
        })
        
    summary = f"Merchant {merchant.name} (Category: {merchant.category}) has a fraud percentage of {merchant.fraud_percentage:.2f}%."

    result = {
        "id": merchant.merchant_id,
        "name": merchant.name,
        "category": merchant.category,
        "total_revenue": merchant.total_revenue,
        "chargeback_percentage": merchant.chargeback_percentage,
        "fraud_percentage": merchant.fraud_percentage,
        "risk_rating": merchant.risk_rating,
        "join_date": str(merchant.created_at),
        "summary": summary,
        "revenueTrend": revenue_trend,
        "recent_transactions": formatted_txs
    }
    return result

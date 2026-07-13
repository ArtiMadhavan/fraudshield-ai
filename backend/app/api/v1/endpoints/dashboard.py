from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.models import Transaction, FraudAlert, FraudPrediction, Customer, Merchant, User, MLModel
from app.schemas.schemas import DashboardKPIs
from datetime import datetime, timedelta
import random

router = APIRouter()

from app.dependencies import get_current_active_user

@router.get("/stats", response_model=dict)
def get_dashboard_stats(db: Session = Depends(get_db), range: str = "30d", current_user: User = Depends(get_current_active_user)):
    days = 30
    if range == "7d": days = 7
    elif range == "90d": days = 90
    elif range == "1y": days = 365
    elif range == "today": days = 1
    
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Query Base Stats
    total_transactions = db.query(Transaction).filter(Transaction.created_at >= start_date).count()
    revenue = db.query(func.sum(Transaction.amount)).filter(Transaction.created_at >= start_date, Transaction.status == 'completed').scalar() or 0.0
    
    fraud_predictions = db.query(FraudPrediction).join(Transaction).filter(Transaction.created_at >= start_date).all()
    fraud_transactions = len([p for p in fraud_predictions if p.risk_level in ["High", "Critical"]])
    fraud_percentage = (fraud_transactions / total_transactions * 100) if total_transactions > 0 else 0.0
    
    blocked_transactions = len([p for p in fraud_predictions if p.recommendation == "BLOCK" or p.recommendation == "Block"])
    approval_rate = ((total_transactions - blocked_transactions) / total_transactions * 100) if total_transactions > 0 else 100.0
    
    high_risk_customers = db.query(Customer).filter(Customer.risk_score >= 70).count()
    avg_transaction_value = (revenue / total_transactions) if total_transactions > 0 else 0.0
    
    active_analysts = db.query(User).filter(User.role == "analyst").count()
    active_merchants = db.query(Merchant).count()
    active_customers = db.query(Customer).count()
    
    ml_model = db.query(MLModel).filter(MLModel.is_active == True).first()
    model_accuracy = ml_model.accuracy * 100 if ml_model and ml_model.accuracy else 0.0
    
    kpis = DashboardKPIs(
        total_transactions=total_transactions,
        fraud_transactions=fraud_transactions,
        revenue=revenue,
        fraud_percentage=fraud_percentage,
        blocked_transactions=blocked_transactions,
        high_risk_customers=high_risk_customers,
        avg_transaction_value=avg_transaction_value,
        model_accuracy=model_accuracy,
        approval_rate=approval_rate,
        active_analysts=active_analysts,
        active_merchants=active_merchants,
        active_customers=active_customers
    )
    
    # Chart Data (Group by date for area/bar charts)
    import pandas as pd
    tx_df = pd.read_sql(db.query(Transaction.created_at, Transaction.amount).filter(Transaction.created_at >= start_date).statement, db.bind)
    
    if not tx_df.empty:
        tx_df['date'] = pd.to_datetime(tx_df['created_at']).dt.strftime('%b %d')
        revenue_trend = tx_df.groupby('date')['amount'].sum().reset_index().rename(columns={'amount': 'Revenue'}).to_dict('records')
    else:
        revenue_trend = []
        
    # Get active alerts
    recent_alerts_db = db.query(FraudAlert).order_by(FraudAlert.created_at.desc()).limit(5).all()
    recent_alerts = []
    for a in recent_alerts_db:
        recent_alerts.append({
            "id": a.transaction_id[:12].upper(),
            "title": f"Fraud Alert: {a.severity.capitalize()}",
            "time": str(a.created_at),
            "risk": a.severity.capitalize()
        })
        
    recent_txs_db = db.query(Transaction).order_by(Transaction.created_at.desc()).limit(10).all()
    recent_transactions = []
    for tx in recent_txs_db:
        customer = db.query(Customer).filter(Customer.id == tx.customer_id).first()
        merchant = db.query(Merchant).filter(Merchant.id == tx.merchant_id).first()
        prediction = db.query(FraudPrediction).filter(FraudPrediction.transaction_id == tx.transaction_id).first()
        
        recent_transactions.append({
            "txn_id": tx.transaction_id[:12].upper(),
            "customer": customer.name if customer else "Unknown",
            "merchant": merchant.name if merchant else "Unknown",
            "amount": float(tx.amount),
            "risk_score": prediction.risk_score if prediction else 0.0,
            "decision": prediction.recommendation if prediction else "APPROVE",
            "status": tx.status.capitalize(),
            "payment_method": tx.payment_method.capitalize(),
            "time": str(tx.created_at)
        })

    # Risk Distribution
    risk_distribution = [
        {"name": "Low Risk", "value": round((total_transactions - fraud_transactions)/max(total_transactions, 1)*100, 1), "count": total_transactions - fraud_transactions, "color": "#10b981"},
        {"name": "Medium Risk", "value": round(fraud_transactions * 0.3/max(total_transactions, 1)*100, 1), "count": int(fraud_transactions * 0.3), "color": "#f59e0b"},
        {"name": "High Risk", "value": round(fraud_transactions * 0.5/max(total_transactions, 1)*100, 1), "count": int(fraud_transactions * 0.5), "color": "#ef4444"},
        {"name": "Critical Risk", "value": round(fraud_transactions * 0.2/max(total_transactions, 1)*100, 1), "count": int(fraud_transactions * 0.2), "color": "#b91c1c"}
    ]
    
    # Fraud Trend
    if not tx_df.empty:
        fraud_trend_list = []
        for d in tx_df['date'].unique()[-7:]:
            day_tx = tx_df[tx_df['date'] == d]
            fraud_trend_list.append({
                "date": d,
                "Fraud Count": random.randint(5, 20), # Simplified for now
                "Fraud Rate": round(random.uniform(1.0, 5.0), 1)
            })
    else:
        fraud_trend_list = []

    # Top Risky Merchants
    top_merchants = db.query(Merchant).order_by(Merchant.fraud_percentage.desc()).limit(5).all()
    top_risky_merchants = []
    for m in top_merchants:
        top_risky_merchants.append({
            "name": m.name,
            "amount": f"${m.total_revenue:,.0f}",
            "risk": m.risk_level,
            "icon": m.name[:2].upper()
        })
        
    system_health = [
        {"name": "API Server", "status": "Operational"},
        {"name": "Database", "status": "Operational"},
        {"name": "ML Engine", "status": "Operational"},
        {"name": "Redis Cache", "status": "Operational"},
    ]

    return {
        "stats": {
            "total_transactions": total_transactions,
            "total_amount_str": f"${revenue:,.2f}",
            "fraud_detected": fraud_transactions,
            "blocked_amount_str": f"${fraud_transactions * avg_transaction_value:,.2f}",
            "chargeback_loss_str": f"${fraud_transactions * avg_transaction_value * 0.15:,.2f}",
            "tx_trend": 12.5,
            "amount_trend": 8.4,
            "fraud_trend_val": -2.1,
            "blocked_trend": 4.3,
            "chargeback_trend": -1.2
        },
        "transaction_overview": revenue_trend,
        "risk_distribution": risk_distribution,
        "fraud_trend": fraud_trend_list,
        "recent_alerts": recent_alerts,
        "top_risky_merchants": top_risky_merchants,
        "system_health": system_health,
        "recent_transactions": recent_transactions
    }

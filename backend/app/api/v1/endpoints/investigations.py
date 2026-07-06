from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import FraudAlert, Transaction, FraudPrediction, Customer, Merchant

router = APIRouter()

class AlertUpdate(BaseModel):
    status: str
    analyst_notes: str = None

@router.get("/")
def get_investigations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    alerts = db.query(FraudAlert).offset(skip).limit(limit).all()
    
    result = []
    for alert in alerts:
        tx = db.query(Transaction).filter(Transaction.transaction_id == alert.transaction_id).first()
        pred = db.query(FraudPrediction).filter(FraudPrediction.transaction_id == alert.transaction_id).first()
        if tx and pred:
            customer = db.query(Customer).filter(Customer.id == tx.customer_id).first()
            merchant = db.query(Merchant).filter(Merchant.id == tx.merchant_id).first()
            result.append({
                "id": alert.id,
                "transaction_id": tx.transaction_id,
                "amount": f"${tx.amount:,.2f}",
                "time": str(tx.created_at),
                "status": alert.status,
                "risk_score": pred.risk_score,
                "risk_level": pred.risk_level,
                "confidence": pred.confidence,
                "customer": { "id": customer.customer_id, "name": customer.name, "risk": customer.risk_score, "history": "Unknown" },
                "merchant": { "id": merchant.merchant_id, "name": merchant.name, "risk": merchant.fraud_percentage, "category": merchant.category },
                "device": { "type": "Unknown", "os": tx.os, "browser": tx.browser, "ip": tx.ip_address, "location": tx.location },
                "reasons": pred.rule_explanations.split('|') if pred.rule_explanations else [],
                "analyst_notes": alert.analyst_notes
            })
    return result

@router.put("/{alert_id}")
def update_investigation(alert_id: int, alert_update: AlertUpdate, db: Session = Depends(get_db)):
    alert = db.query(FraudAlert).filter(FraudAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.status = alert_update.status
    if alert_update.analyst_notes is not None:
        alert.analyst_notes = alert_update.analyst_notes
        
    db.commit()
    db.refresh(alert)
    return alert

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.models import Transaction, FraudPrediction, Customer, Merchant, MLModel
from app.core.seeder import seed_indian_demo_data
import os

router = APIRouter()

@router.get("/health")
def get_system_health(db: Session = Depends(get_db)):
    try:
        from sqlalchemy import text
        db.execute(text("SELECT 1"))
        db_status = "Healthy"
    except:
        db_status = "Disconnected"
        
    return {
        "status": "Operational" if db_status == "Healthy" else "Degraded",
        "backend_api": "Online",
        "database": db_status,
        "ml_model": "Active (XGBoost/LR v1.0)"
    }

@router.post("/load-demo-data")
def load_demo_data(db: Session = Depends(get_db)):
    return seed_indian_demo_data(db)

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    # Group by merchant
    merchants = db.query(
        Merchant.name,
        func.count(Transaction.id).label("volume"),
        func.sum(Transaction.amount).label("revenue")
    ).join(Transaction).group_by(Merchant.name).order_by(func.count(Transaction.id).desc()).limit(5).all()

    merchantData = [
        {"name": m.name, "volume": m.volume, "fraudRate": min(m.volume * 2, 25) } # Mocked fraud rate
        for m in merchants
    ]

    # Group by state
    states = db.query(
        Transaction.state.label("region"),
        func.sum(Transaction.amount).label("volume"),
        func.count(Transaction.id).label("attempts")
    ).group_by(Transaction.state).all()

    heatmapData = [
        {"region": s.region, "volume": f"₹{s.volume:,.2f}" if s.volume else "₹0.00", "attempts": s.attempts, "risk": "Low", "trend": "down"}
        for s in states
    ]

    # Customer data
    customerData = [
        {"age": "18-24", "count": 120, "fraud": 15},
        {"age": "25-34", "count": 450, "fraud": 45},
    ] # Mocking demographic for now as we don't have age in DB

    return {
        "customerData": customerData,
        "merchantData": merchantData,
        "heatmapData": heatmapData
    }

@router.get("/ml-metrics")
def get_ml_metrics(db: Session = Depends(get_db)):
    active_model = db.query(MLModel).filter(MLModel.is_active == True).first()
    
    if not active_model:
        return {
            "active_model": "None",
            "f1_score": 0,
            "precision": 0,
            "training_data": "0",
            "modelComparison": []
        }
        
    model_name = active_model.algorithm or "XGBoost"
    
    modelComparison = [
        {"subject": "Accuracy", "ActiveModel": (active_model.accuracy or 0) * 100, "Baseline": 50, "fullMark": 100},
        {"subject": "Precision", "ActiveModel": (active_model.precision or 0) * 100, "Baseline": 50, "fullMark": 100},
        {"subject": "Recall", "ActiveModel": (active_model.recall or 0) * 100, "Baseline": 50, "fullMark": 100},
        {"subject": "F1 Score", "ActiveModel": (active_model.f1_score or 0) * 100, "Baseline": 50, "fullMark": 100},
        {"subject": "ROC-AUC", "ActiveModel": (active_model.roc_auc or 0) * 100, "Baseline": 50, "fullMark": 100},
    ]

    return {
        "active_model": model_name,
        "f1_score": active_model.f1_score or 0,
        "precision": (active_model.precision or 0) * 100,
        "training_data": "Generated",
        "modelComparison": modelComparison
    }

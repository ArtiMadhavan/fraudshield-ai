from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Merchant

router = APIRouter()

@router.get("/")
def get_merchants(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    merchants = db.query(Merchant).offset(skip).limit(limit).all()
    return merchants

@router.get("/{merchant_id}")
def get_merchant(merchant_id: int, db: Session = Depends(get_db)):
    merchant = db.query(Merchant).filter(Merchant.id == merchant_id).first()
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")
    return merchant

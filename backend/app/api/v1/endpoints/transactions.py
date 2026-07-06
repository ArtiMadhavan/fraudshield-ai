from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import TransactionRequest, PredictionResponse
from app.services.transaction_service import TransactionService

router = APIRouter()

@router.post("/process", response_model=PredictionResponse)
def process_payment(request: TransactionRequest, db: Session = Depends(get_db)):
    try:
        service = TransactionService(db)
        decision = service.process_payment(request.model_dump())
        return decision
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

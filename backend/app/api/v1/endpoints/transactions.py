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

import json
import csv
from io import StringIO
from fastapi import File, UploadFile

from app.dependencies import RoleChecker
from app.models.models import User

@router.post("/upload")
async def upload_transactions(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(RoleChecker(["admin", "analyst", "risk_manager"]))):
    content = await file.read()
    transactions = []
    
    if file.filename.endswith(".json"):
        try:
            transactions = json.loads(content)
            if not isinstance(transactions, list):
                transactions = [transactions]
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid JSON file")
    elif file.filename.endswith(".csv"):
        try:
            csv_reader = csv.DictReader(StringIO(content.decode("utf-8")))
            transactions = [row for row in csv_reader]
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid CSV file")
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format")

    service = TransactionService(db)
    results = {
        "total_uploaded": len(transactions),
        "successful": 0,
        "failed": 0,
        "fraud_count": 0,
        "safe_count": 0,
        "details": []
    }

    for tx in transactions:
        try:
            # Type cast for CSV
            if isinstance(tx.get('amount'), str):
                tx['amount'] = float(tx['amount'])
            
            # Validate with Pydantic
            validated_tx = TransactionRequest(**tx)
                
            decision = service.process_payment(validated_tx.model_dump())
            results["successful"] += 1
            if decision.get("decision") == "BLOCK":
                results["fraud_count"] += 1
            else:
                results["safe_count"] += 1
            results["details"].append({"transaction_id": decision.get("transaction_id"), "status": "success", "decision": decision})
        except Exception as e:
            results["failed"] += 1
            results["details"].append({"error": str(e), "status": "failed"})
            
    return results

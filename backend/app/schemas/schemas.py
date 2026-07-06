from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# --- Merged from root schemas.py ---
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: Optional[str] = "fraud_analyst"

class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime
    class Config:
        from_attributes = True

class TransactionCreate(BaseModel):
    amount: float
    currency: Optional[str] = "USD"
    payment_method: str
    device: str
    browser: str
    os: str
    location: str
    ip_address: str
    transaction_type: str
    customer_age_days: Optional[int] = 30 # Default for simulation

class FraudPredictionResponse(BaseModel):
    transaction_id: str
    risk_score: float
    risk_level: str
    recommendation: str
    confidence: float
    explanation: str

class TransactionResponse(BaseModel):
    id: int
    transaction_id: str
    amount: float
    status: str
    prediction: Optional[FraudPredictionResponse] = None
    created_at: datetime
    class Config:
        from_attributes = True

# --- Original nested schemas.py ---
class Token(BaseModel):
    access_token: str
    token_type: str

class UserLogin(BaseModel):
    username: str
    password: str

class TransactionRequest(BaseModel):
    customer_id: str
    merchant_id: str
    amount: float
    currency: str = "USD"
    payment_method: str
    device: str
    browser: str
    os: str
    location: str
    ip_address: str
    transaction_type: str

class PredictionResponse(BaseModel):
    decision: str
    risk_score: float
    risk_level: str
    confidence: float
    explanations: List[str]
    transaction_id: str
    status: str

class DashboardKPIs(BaseModel):
    total_transactions: int
    fraud_transactions: int
    revenue: float
    fraud_percentage: float
    blocked_transactions: int
    high_risk_customers: int
    avg_transaction_value: float
    model_accuracy: float

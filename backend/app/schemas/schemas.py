from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: Optional[str] = "customer"

class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str

class UserLogin(BaseModel):
    username: str
    password: str

class TransactionRequest(BaseModel):
    customer_name: str
    customer_mobile: Optional[str] = None
    merchant_name: str
    merchant_category: str
    amount: float
    payment_method: str
    upi_app: Optional[str] = None
    upi_id: Optional[str] = None
    bank_name: Optional[str] = None
    device: str
    city: str
    state: str
    ip_address: Optional[str] = None
    transaction_time: Optional[datetime] = None

class PredictionResponse(BaseModel):
    decision: str
    risk_score: float
    fraud_probability: float
    confidence: float
    risk_level: str
    reasons: List[str]
    recommendation: str
    transaction_id: Optional[str] = None
    status: Optional[str] = None

class CustomerResponse(BaseModel):
    id: int
    customer_id: str
    name: str
    email: Optional[str] = None
    mobile_number: Optional[str] = None
    kyc_status: str
    wallet_balance: float
    risk_score: float
    created_at: datetime
    class Config:
        from_attributes = True

class MerchantResponse(BaseModel):
    id: int
    merchant_id: str
    name: str
    category: str
    total_revenue: float
    chargeback_percentage: float
    fraud_percentage: float
    risk_rating: str
    created_at: datetime
    class Config:
        from_attributes = True

class TransactionResponse(BaseModel):
    id: int
    transaction_id: str
    amount: float
    currency: str
    payment_method: str
    upi_app: Optional[str] = None
    status: str
    created_at: datetime
    customer: Optional[CustomerResponse] = None
    merchant: Optional[MerchantResponse] = None
    class Config:
        from_attributes = True

class DashboardKPIs(BaseModel):
    total_transactions: int
    fraud_transactions: int
    revenue: float
    fraud_percentage: float
    model_accuracy: float

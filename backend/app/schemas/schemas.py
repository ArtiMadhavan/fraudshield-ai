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
    email: str
    kyc_status: str
    credit_score: int
    wallet_balance: float
    risk_score: float
    monthly_spend: float
    average_monthly_spend: float
    clv: float
    device_history: Optional[str] = None
    location_history: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

class MerchantResponse(BaseModel):
    id: int
    merchant_id: str
    name: str
    category: str
    countries: Optional[str] = None
    total_revenue: float
    settlement_status: str
    chargeback_percentage: float
    fraud_percentage: float
    risk_level: str
    created_at: datetime
    class Config:
        from_attributes = True

class TransactionResponse(BaseModel):
    id: int
    transaction_id: str
    amount: float
    currency: str
    payment_method: str
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
    blocked_transactions: int
    high_risk_customers: int
    avg_transaction_value: float
    model_accuracy: float
    approval_rate: float
    active_analysts: int
    active_merchants: int
    active_customers: int

from sqlalchemy import Column, Integer, String, Float, Boolean, Text, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    ANALYST = "analyst"
    RISK_MANAGER = "risk_manager"
    CUSTOMER = "customer"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password_hash = Column(String(255))
    role = Column(String(50), default=UserRole.CUSTOMER.value)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MLModel(Base):
    __tablename__ = "ml_models"
    id = Column(Integer, primary_key=True, index=True)
    version = Column(String(50), unique=True, index=True)
    training_date = Column(DateTime(timezone=True), server_default=func.now())
    algorithm = Column(String(50))
    accuracy = Column(Float, nullable=True)
    precision = Column(Float, nullable=True)
    recall = Column(Float, nullable=True)
    f1_score = Column(Float, nullable=True)
    roc_auc = Column(Float, nullable=True)
    confusion_matrix = Column(Text, nullable=True) # JSON
    is_active = Column(Boolean, default=False)

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String(50), unique=True, index=True)
    name = Column(String(100))
    mobile_number = Column(String(20), nullable=True)
    email = Column(String(100), nullable=True)
    kyc_status = Column(String(50), default="Pending")
    wallet_balance = Column(Float, default=0.0)
    risk_score = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    transactions = relationship("Transaction", back_populates="customer")

class Merchant(Base):
    __tablename__ = "merchants"
    id = Column(Integer, primary_key=True, index=True)
    merchant_id = Column(String(50), unique=True, index=True)
    name = Column(String(100))
    category = Column(String(50))
    total_revenue = Column(Float, default=0.0)
    chargeback_percentage = Column(Float, default=0.0)
    fraud_percentage = Column(Float, default=0.0)
    risk_rating = Column(String(50), default="Low")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    transactions = relationship("Transaction", back_populates="merchant")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String(50), unique=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    merchant_id = Column(Integer, ForeignKey("merchants.id"))
    amount = Column(Float)
    currency = Column(String(10), default="INR")
    payment_method = Column(String(50))
    upi_app = Column(String(50), nullable=True)
    upi_id = Column(String(100), nullable=True)
    bank_name = Column(String(100), nullable=True)
    device = Column(String(50))
    city = Column(String(100))
    state = Column(String(100))
    ip_address = Column(String(45))
    status = Column(String(20), default="Completed")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    customer = relationship("Customer", back_populates="transactions")
    merchant = relationship("Merchant", back_populates="transactions")
    prediction = relationship("FraudPrediction", back_populates="transaction", uselist=False)
    alert = relationship("FraudAlert", back_populates="transaction", uselist=False)

class FraudPrediction(Base):
    __tablename__ = "fraud_predictions"
    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String(50), ForeignKey("transactions.transaction_id"))
    fraud_probability = Column(Float)
    risk_score = Column(Float)
    risk_level = Column(String(20))
    decision = Column(String(20))
    recommendation = Column(String(255))
    confidence = Column(Float)
    reasons = Column(Text) # JSON array of reasons
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    transaction = relationship("Transaction", back_populates="prediction")

class FraudAlert(Base):
    __tablename__ = "fraud_alerts"
    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String(50), ForeignKey("transactions.transaction_id"))
    severity = Column(String(20))
    status = Column(String(20), default="open") # open, resolved, rejected
    analyst_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    transaction = relationship("Transaction", back_populates="alert")

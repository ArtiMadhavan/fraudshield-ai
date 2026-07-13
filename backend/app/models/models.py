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
    failed_login_attempts = Column(Integer, default=0)
    is_locked = Column(Boolean, default=False)
    locked_until = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MLModel(Base):
    __tablename__ = "ml_models"
    id = Column(Integer, primary_key=True, index=True)
    version = Column(String(50), unique=True, index=True)
    training_date = Column(DateTime(timezone=True), server_default=func.now())
    dataset_name = Column(String(100))
    algorithm = Column(String(50))
    accuracy = Column(Float, nullable=True)
    precision = Column(Float, nullable=True)
    recall = Column(Float, nullable=True)
    f1_score = Column(Float, nullable=True)
    roc_auc = Column(Float, nullable=True)
    confusion_matrix = Column(Text, nullable=True) # JSON
    feature_importance = Column(Text, nullable=True) # JSON
    is_active = Column(Boolean, default=False)

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String(50), unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String(100))
    email = Column(String(100), unique=True)
    kyc_status = Column(String(50), default="Pending") # Pending, Verified, Rejected
    credit_score = Column(Integer, default=700)
    wallet_balance = Column(Float, default=0.0)
    risk_score = Column(Float, default=0.0)
    monthly_spend = Column(Float, default=0.0)
    average_monthly_spend = Column(Float, default=0.0)
    clv = Column(Float, default=0.0)
    device_history = Column(Text, nullable=True) # JSON array of devices
    location_history = Column(Text, nullable=True) # JSON array of locations
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    transactions = relationship("Transaction", back_populates="customer")

class Merchant(Base):
    __tablename__ = "merchants"
    id = Column(Integer, primary_key=True, index=True)
    merchant_id = Column(String(50), unique=True, index=True)
    name = Column(String(100))
    category = Column(String(50))
    countries = Column(Text, nullable=True) # JSON array
    total_revenue = Column(Float, default=0.0)
    settlement_status = Column(String(50), default="Active")
    chargeback_percentage = Column(Float, default=0.0)
    fraud_percentage = Column(Float, default=0.0)
    risk_level = Column(String(50), default="Low")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    transactions = relationship("Transaction", back_populates="merchant")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String(50), unique=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    merchant_id = Column(Integer, ForeignKey("merchants.id"))
    amount = Column(Float)
    currency = Column(String(10), default="USD")
    payment_method = Column(String(50))
    device = Column(String(50))
    browser = Column(String(50))
    os = Column(String(50))
    location = Column(String(100))
    ip_address = Column(String(45))
    transaction_type = Column(String(50))
    status = Column(String(20), default="processing")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    customer = relationship("Customer", back_populates="transactions")
    merchant = relationship("Merchant", back_populates="transactions")
    prediction = relationship("FraudPrediction", back_populates="transaction", uselist=False)
    alert = relationship("FraudAlert", back_populates="transaction", uselist=False)

class FraudPrediction(Base):
    __tablename__ = "fraud_predictions"
    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String(50), ForeignKey("transactions.transaction_id"))
    ml_probability = Column(Float)
    risk_score = Column(Float)
    risk_level = Column(String(20))
    recommendation = Column(String(255))
    confidence = Column(Float)
    rule_explanations = Column(Text) # JSON array of rules triggered
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    transaction = relationship("Transaction", back_populates="prediction")

class FraudAlert(Base):
    __tablename__ = "fraud_alerts"
    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String(50), ForeignKey("transactions.transaction_id"))
    severity = Column(String(20))
    priority = Column(String(20), default="Medium") # High, Medium, Low
    status = Column(String(20), default="open") # open, investigating, resolved, closed
    resolution_status = Column(String(50), nullable=True) # True Positive, False Positive
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    analyst_notes = Column(Text, nullable=True)
    evidence = Column(Text, nullable=True) # JSON
    timeline_events = Column(Text, nullable=True) # JSON
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    transaction = relationship("Transaction", back_populates="alert")
    assignee = relationship("User")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String(255))
    entity = Column(String(50))
    entity_id = Column(Integer)
    details = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

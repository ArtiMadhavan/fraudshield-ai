from sqlalchemy import Column, Integer, String, Float, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password_hash = Column(String(255))
    role = Column(String(20), default='fraud_analyst')
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String(50), unique=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True)
    risk_score = Column(Float, default=0)
    average_monthly_spend = Column(Float, default=0)
    clv = Column(Float, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Merchant(Base):
    __tablename__ = "merchants"
    id = Column(Integer, primary_key=True, index=True)
    merchant_id = Column(String(50), unique=True, index=True)
    name = Column(String(100))
    category = Column(String(50))
    total_revenue = Column(Float, default=0)
    fraud_percentage = Column(Float, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

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

class FraudPrediction(Base):
    __tablename__ = "fraud_predictions"
    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String(50), ForeignKey("transactions.transaction_id"))
    ml_probability = Column(Float)
    risk_score = Column(Float)
    risk_level = Column(String(20))
    recommendation = Column(String(255))
    confidence = Column(Float)
    rule_explanations = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class FraudAlert(Base):
    __tablename__ = "fraud_alerts"
    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String(50), ForeignKey("transactions.transaction_id"))
    severity = Column(String(20))
    status = Column(String(20), default="open")
    analyst_notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String(255))
    entity = Column(String(50))
    entity_id = Column(Integer)
    details = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

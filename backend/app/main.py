import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import transactions, system, auth, dashboard, customers, merchants, investigations, websockets
from app.core.database import engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FraudShield AI Enterprise API",
    description="Backend API for the FraudShield AI Platform",
    version="2.0.0"
)

# CORS configuration
origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(transactions.router, prefix="/api/v1/payments", tags=["Payments & Fraud"])
app.include_router(system.router, prefix="/api/v1/system", tags=["System & Reports"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])
app.include_router(customers.router, prefix="/api/v1/customers", tags=["Customers"])
app.include_router(merchants.router, prefix="/api/v1/merchants", tags=["Merchants"])
app.include_router(investigations.router, prefix="/api/v1/investigations", tags=["Investigations"])
app.include_router(websockets.router, prefix="", tags=["WebSockets"])

@app.get("/")
def root():
    return {"message": "Welcome to FraudShield AI Enterprise API"}

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "fraudshield-api"}

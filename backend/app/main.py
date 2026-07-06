from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import transactions, system
from app.core.database import engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FraudShield AI Enterprise API",
    description="Backend API for the FraudShield AI Platform",
    version="2.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(transactions.router, prefix="/api/v1/payments", tags=["Payments & Fraud"])
app.include_router(system.router, prefix="/api/v1/system", tags=["System & Reports"])

@app.get("/")
def root():
    return {"message": "Welcome to FraudShield AI Enterprise API"}

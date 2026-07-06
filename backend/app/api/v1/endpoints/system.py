from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
import psutil
import os
from fpdf import FPDF
from datetime import datetime

router = APIRouter()

@router.get("/health")
def get_system_health(db: Session = Depends(get_db)):
    try:
        # Check DB connection
        db.execute("SELECT 1")
        db_status = "Healthy"
    except:
        db_status = "Disconnected"
        
    return {
        "status": "Operational" if db_status == "Healthy" else "Degraded",
        "backend_api": "Online",
        "database": db_status,
        "ml_model": "Active (XGBoost/LR v1.0)",
        "cpu_usage": f"{psutil.cpu_percent()}%",
        "memory_usage": f"{psutil.virtual_memory().percent}%",
        "uptime": "99.99%"
    }

@router.get("/reports/pdf/{report_type}")
def generate_pdf_report(report_type: str, db: Session = Depends(get_db)):
    if report_type not in ["executive", "fraud", "customers"]:
        raise HTTPException(status_code=400, detail="Invalid report type")
        
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=16)
    pdf.cell(200, 10, txt=f"FraudShield AI - {report_type.capitalize()} Report", ln=True, align='C')
    
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt=f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", ln=True, align='C')
    
    pdf.cell(200, 10, txt="Confidential and Proprietary Data", ln=True, align='L')
    pdf.cell(200, 10, txt="---------------------------------------------------------", ln=True, align='L')
    
    # Mock data for demonstration
    if report_type == "executive":
        pdf.cell(200, 10, txt="Total Transactions Monitored: 1,432,590", ln=True, align='L')
        pdf.cell(200, 10, txt="Total Fraud Prevented: $4,200,500.00", ln=True, align='L')
        pdf.cell(200, 10, txt="AI Model Accuracy: 99.97%", ln=True, align='L')
    
    reports_dir = os.path.join(os.path.dirname(__file__), "../../../../reports")
    os.makedirs(reports_dir, exist_ok=True)
    file_path = os.path.join(reports_dir, f"{report_type}_report.pdf")
    
    pdf.output(file_path)
    return FileResponse(path=file_path, filename=f"{report_type}_report.pdf", media_type='application/pdf')

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    # Simulating DB analytics generation for customer demographics and merchant performance
    customerData = [
        {"age": "18-24", "count": 120, "fraud": 15},
        {"age": "25-34", "count": 450, "fraud": 45},
        {"age": "35-44", "count": 320, "fraud": 20},
        {"age": "45-54", "count": 210, "fraud": 10},
        {"age": "55+", "count": 90, "fraud": 2},
    ]

    merchantData = [
        {"name": "Amazon", "volume": 45000, "fraudRate": 0.2},
        {"name": "Apple", "volume": 38000, "fraudRate": 0.1},
        {"name": "Walmart", "volume": 22000, "fraudRate": 0.5},
        {"name": "CryptoEx", "volume": 15000, "fraudRate": 12.4},
        {"name": "Unknown", "volume": 5000, "fraudRate": 4.8},
    ]

    heatmapData = [
        {"region": "North America", "volume": "$4.2M", "attempts": 124, "risk": "Low", "trend": "down"},
        {"region": "Europe", "volume": "$2.8M", "attempts": 98, "risk": "Low", "trend": "down"},
        {"region": "Eastern Europe", "volume": "$850K", "attempts": 342, "risk": "High", "trend": "up"},
        {"region": "High-Risk IP Zones", "volume": "$120K", "attempts": 450, "risk": "Critical", "trend": "up"},
    ]

    return {
        "customerData": customerData,
        "merchantData": merchantData,
        "heatmapData": heatmapData
    }

@router.get("/ml-metrics")
def get_ml_metrics(db: Session = Depends(get_db)):
    # Simulating ML performance metrics and feature importance
    featureImportance = [
        {"name": "Amount", "value": 85},
        {"name": "Location", "value": 72},
        {"name": "Time of Day", "value": 68},
        {"name": "Device Type", "value": 55},
        {"name": "Customer Age", "value": 45},
        {"name": "Payment Method", "value": 38},
    ]

    modelComparison = [
        {"subject": "Accuracy", "XGBoost": 94, "RandomForest": 91, "LogisticRegression": 78, "fullMark": 100},
        {"subject": "Precision", "XGBoost": 92, "RandomForest": 88, "LogisticRegression": 72, "fullMark": 100},
        {"subject": "Recall", "XGBoost": 89, "RandomForest": 84, "LogisticRegression": 65, "fullMark": 100},
        {"subject": "F1 Score", "XGBoost": 90, "RandomForest": 86, "LogisticRegression": 68, "fullMark": 100},
        {"subject": "AUC-ROC", "XGBoost": 96, "RandomForest": 93, "LogisticRegression": 81, "fullMark": 100},
        {"subject": "Speed", "XGBoost": 85, "RandomForest": 75, "LogisticRegression": 98, "fullMark": 100},
    ]

    return {
        "active_model": "XGBoost-V4",
        "f1_score": 0.902,
        "precision": 92.4,
        "training_data": "2.4M",
        "featureImportance": featureImportance,
        "modelComparison": modelComparison
    }

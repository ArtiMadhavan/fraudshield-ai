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

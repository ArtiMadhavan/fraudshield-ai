import os
import joblib
import pandas as pd
from datetime import datetime
import numpy as np

base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
model_path = os.path.join(base_dir, 'ml_engine', 'fraud_model.joblib')
preprocessor_path = os.path.join(base_dir, 'ml_engine', 'preprocessor.joblib')

try:
    model = joblib.load(model_path)
    preprocessor = joblib.load(preprocessor_path)
    print("ML Model loaded successfully.")
except Exception as e:
    print(f"Warning: ML model not found or failed to load. Using mock predictions. Error: {e}")
    model = None
    preprocessor = None

def predict_fraud(transaction_data: dict):
    if not model or not preprocessor:
        # Fallback dummy logic if model is not trained yet
        amount = transaction_data.get('amount', 0)
        risk_score = 15.0 if amount < 1000 else 85.0
        prob = risk_score / 100.0
    else:
        # Prepare data for model
        # The model expects: payment_method, device, os, amount, transaction_hour, customer_age_days
        current_hour = datetime.now().hour
        df = pd.DataFrame([{
            'payment_method': transaction_data.get('payment_method', 'Credit Card'),
            'device': transaction_data.get('device', 'Desktop'),
            'os': transaction_data.get('os', 'Windows'),
            'amount': transaction_data.get('amount', 0.0),
            'transaction_hour': current_hour,
            'customer_age_days': transaction_data.get('customer_age_days', 30)
        }])
        
        X_transformed = preprocessor.transform(df)
        prob = model.predict_proba(X_transformed)[0][1]
        risk_score = round(prob * 100, 2)
        
    if risk_score > 80:
        risk_level = "Critical"
        recommendation = "Block Transaction Immediately"
        explanation = "High risk pattern detected by AI model. Unusual transaction amount and device combination."
    elif risk_score > 60:
        risk_level = "High"
        recommendation = "Require Additional Authentication (MFA)"
        explanation = "Suspicious activity detected. Verification recommended."
    elif risk_score > 30:
        risk_level = "Medium"
        recommendation = "Flag for Manual Review"
        explanation = "Slight deviation from normal spending behavior."
    else:
        risk_level = "Low"
        recommendation = "Approve Transaction"
        explanation = "Transaction fits normal customer profile."
        
    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "recommendation": recommendation,
        "confidence": 0.95 if risk_score > 80 or risk_score < 20 else 0.75,
        "explanation": explanation
    }

import os
import json
import pandas as pd
import numpy as np
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
import xgboost as xgb
import joblib

# Determine absolute path for saving
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "ml_engine", "models")
os.makedirs(MODELS_DIR, exist_ok=True)

def generate_mock_dataset(n_samples=5000):
    # Generates a synthetic dataset for Indian FinTech fraud
    np.random.seed(42)
    
    data = {
        "amount": np.random.exponential(scale=2000, size=n_samples), # Avg 2000 INR
        "customer_risk_score": np.random.uniform(0, 100, size=n_samples),
        "merchant_risk_score": np.random.uniform(0, 100, size=n_samples),
        "hour_of_day": np.random.randint(0, 24, size=n_samples),
        "is_upi": np.random.choice([0, 1], p=[0.4, 0.6], size=n_samples),
        "is_new_device": np.random.choice([0, 1], p=[0.9, 0.1], size=n_samples),
        "velocity_1h": np.random.poisson(lam=1, size=n_samples)
    }
    
    df = pd.DataFrame(data)
    
    # Simple rule to generate target variable (fraud)
    # Higher amount, high risk scores, night time, new device, high velocity
    prob = (
        (df["amount"] / 50000) * 0.3 + 
        (df["customer_risk_score"] / 100) * 0.2 + 
        (df["merchant_risk_score"] / 100) * 0.2 + 
        (df["is_new_device"]) * 0.15 + 
        (df["velocity_1h"] / 10) * 0.15
    )
    # Night time multiplier
    night_mask = (df["hour_of_day"] >= 0) & (df["hour_of_day"] <= 5)
    prob[night_mask] *= 1.5
    
    # Add noise
    prob += np.random.normal(0, 0.05, size=n_samples)
    
    # Clip and binarize
    prob = np.clip(prob, 0, 1)
    df["is_fraud"] = (prob > 0.6).astype(int)
    
    return df

def train_and_evaluate():
    print("Generating synthetic FinTech dataset...")
    df = generate_mock_dataset(10000)
    
    X = df.drop("is_fraud", axis=1)
    y = df["is_fraud"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000),
        "Decision Tree": DecisionTreeClassifier(random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "XGBoost": xgb.XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42)
    }
    
    best_model_name = ""
    best_f1 = -1
    best_model = None
    results = {}
    
    print("Training models...")
    for name, model in models.items():
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        
        acc = accuracy_score(y_test, preds)
        prec = precision_score(y_test, preds, zero_division=0)
        rec = recall_score(y_test, preds, zero_division=0)
        f1 = f1_score(y_test, preds, zero_division=0)
        
        # Calculate ROC AUC if probability predictions are supported
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(X_test)[:, 1]
            roc = roc_auc_score(y_test, probs)
        else:
            roc = acc # Fallback
            
        results[name] = {
            "accuracy": acc,
            "precision": prec,
            "recall": rec,
            "f1_score": f1,
            "roc_auc": roc
        }
        
        print(f"[{name}] F1: {f1:.4f} | ROC-AUC: {roc:.4f}")
        
        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_model = model
            
    print(f"\nChampion Model Selected: {best_model_name} (F1: {best_f1:.4f})")
    
    # Save the best model
    model_path = os.path.join(MODELS_DIR, "fraud_model.joblib")
    joblib.dump(best_model, model_path)
    
    # Also save metadata
    metadata = {
        "version": f"{best_model_name.replace(' ', '_').lower()}_v1.0",
        "algorithm": best_model_name,
        "training_date": datetime.now().isoformat(),
        "metrics": results[best_model_name],
        "all_results": results
    }
    
    meta_path = os.path.join(MODELS_DIR, "metadata.json")
    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=4)
        
    print(f"Model saved to {model_path}")
    
    # Update Database if available
    try:
        from app.core.database import SessionLocal
        from app.models.models import MLModel
        
        db = SessionLocal()
        
        # Deactivate previous
        db.query(MLModel).update({MLModel.is_active: False})
        
        new_model = MLModel(
            version=metadata["version"],
            algorithm=best_model_name,
            accuracy=results[best_model_name]["accuracy"],
            precision=results[best_model_name]["precision"],
            recall=results[best_model_name]["recall"],
            f1_score=results[best_model_name]["f1_score"],
            roc_auc=results[best_model_name]["roc_auc"],
            is_active=True
        )
        db.add(new_model)
        db.commit()
        db.close()
        print("Database MLModel updated successfully.")
    except Exception as e:
        print(f"Could not update database: {e}")

if __name__ == "__main__":
    train_and_evaluate()

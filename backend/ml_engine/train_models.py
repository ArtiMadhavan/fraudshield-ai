import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
import json

def generate_synthetic_data(n_samples=10000):
    print(f"Generating {n_samples} synthetic transaction records...")
    np.random.seed(42)
    
    # Normal transactions
    n_normal = int(n_samples * 0.95)
    amt_normal = np.random.exponential(scale=50, size=n_normal)
    vel_normal = np.random.poisson(lam=1, size=n_normal)
    dist_normal = np.random.exponential(scale=10, size=n_normal)
    
    # Fraud transactions
    n_fraud = n_samples - n_normal
    amt_fraud = np.random.exponential(scale=500, size=n_fraud)
    vel_fraud = np.random.poisson(lam=5, size=n_fraud)
    dist_fraud = np.random.exponential(scale=500, size=n_fraud)
    
    amount = np.concatenate([amt_normal, amt_fraud])
    velocity = np.concatenate([vel_normal, vel_fraud])
    distance = np.concatenate([dist_normal, dist_fraud])
    is_fraud = np.concatenate([np.zeros(n_normal), np.ones(n_fraud)])
    
    # Shuffle
    idx = np.random.permutation(n_samples)
    
    df = pd.DataFrame({
        'amount': amount[idx],
        'velocity': velocity[idx],
        'distance': distance[idx],
        'is_fraud': is_fraud[idx]
    })
    return df

def train_and_evaluate():
    df = generate_synthetic_data(10000)
    X = df[['amount', 'velocity', 'distance']]
    y = df['is_fraud']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "XGBoost": XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42)
    }
    
    best_model = None
    best_f1 = 0
    best_name = ""
    best_metrics = {}
    
    for name, model in models.items():
        print(f"Training {name}...")
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        y_prob = model.predict_proba(X_test)[:, 1]
        
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred)
        rec = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        auc = roc_auc_score(y_test, y_prob)
        
        print(f"[{name}] Accuracy: {acc:.4f} | Precision: {prec:.4f} | Recall: {rec:.4f} | F1: {f1:.4f} | AUC: {auc:.4f}")
        
        if f1 > best_f1:
            best_f1 = f1
            best_model = model
            best_name = name
            best_metrics = {
                "accuracy": acc,
                "precision": prec,
                "recall": rec,
                "f1_score": f1,
                "roc_auc": auc
            }
            
    print(f"\nBest Model: {best_name} (F1 Score: {best_f1:.4f})")
    
    # Save the best model
    model_path = "fraud_model.joblib"
    joblib.dump(best_model, model_path)
    print(f"Model saved to {model_path}")
    
    # Save metrics
    with open("model_metrics.json", "w") as f:
        json.dump(best_metrics, f)
        
if __name__ == "__main__":
    train_and_evaluate()

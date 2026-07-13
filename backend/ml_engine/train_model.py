import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
import joblib
import os
import sqlite3
import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'sql_app.db')

def load_data():
    conn = sqlite3.connect(DB_PATH)
    query = """
    SELECT 
        t.amount,
        c.risk_score as customer_risk,
        m.fraud_percentage as merchant_risk,
        t.status
    FROM transactions t
    JOIN customers c ON t.customer_id = c.id
    JOIN merchants m ON t.merchant_id = m.id
    """
    df = pd.read_sql_query(query, conn)
    conn.close()
    
    # Preprocessing
    df['is_fraud'] = df['status'].apply(lambda x: 1 if x == 'blocked' else 0)
    
    # If there are no blocked transactions, simulate some for training
    if df['is_fraud'].sum() < 5:
        print("Warning: Not enough fraud data. Injecting synthetic fraud for training...")
        # Make top 5% highest amount transactions fraud
        threshold = df['amount'].quantile(0.95)
        df.loc[df['amount'] >= threshold, 'is_fraud'] = 1
        
    return df

def train_and_evaluate():
    print("Loading data from database...")
    df = load_data()
    
    X = df[['amount', 'customer_risk', 'merchant_risk']]
    y = df['is_fraud']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000),
        "Decision Tree": DecisionTreeClassifier(random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "XGBoost": XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42)
    }
    
    results = {}
    best_model_name = None
    best_f1 = -1
    best_model = None
    
    print("Training models...")
    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        # Handle cases where only one class is predicted
        try:
            y_prob = model.predict_proba(X_test)[:, 1]
            roc_auc = roc_auc_score(y_test, y_prob)
        except:
            roc_auc = 0.5
            
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        
        results[name] = {
            "Accuracy": acc,
            "Precision": prec,
            "Recall": rec,
            "F1 Score": f1,
            "ROC-AUC": roc_auc
        }
        
        print(f"[{name}] F1: {f1:.4f} | ROC-AUC: {roc_auc:.4f}")
        
        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_model = model
            
    print(f"\nChampion Model: {best_model_name} (F1: {best_f1:.4f})")
    
    # Save the model
    model_path = os.path.join(os.path.dirname(__file__), 'fraud_model.joblib')
    joblib.dump(best_model, model_path)
    print(f"Model saved to {model_path}")
    
    # Save to Database MLModel table
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    import json
    metrics_json = json.dumps(results[best_model_name])
    version_id = f"{best_model_name.replace(' ', '_').lower()}_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
    
    # Deactivate previous
    cursor.execute("UPDATE ml_models SET is_active = False")
    
    # Insert new
    cursor.execute(
        "INSERT INTO ml_models (version, dataset_name, metrics, is_active) VALUES (?, ?, ?, ?)",
        (version_id, "transactions_v1", metrics_json, True)
    )
    conn.commit()
    conn.close()
    print("Model metadata saved to database.")

if __name__ == "__main__":
    train_and_evaluate()

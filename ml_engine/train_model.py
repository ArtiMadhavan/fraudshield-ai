import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
import joblib
import os
import json

def train_and_evaluate():
    print("Loading enterprise dataset...")
    df = pd.read_csv('data/synthetic_transactions.csv')
    
    # Feature Engineering
    features = ['merchant_category', 'payment_method', 'device_type', 'browser', 'os', 'transaction_type', 'currency', 'amount', 'transaction_hour']
    X = df[features]
    y = df['is_fraud']
    
    # Preprocessing
    numeric_features = ['amount', 'transaction_hour']
    categorical_features = ['merchant_category', 'payment_method', 'device_type', 'browser', 'os', 'transaction_type', 'currency']
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Define Models
    models = {
        'LogisticRegression': LogisticRegression(max_iter=1000, class_weight='balanced'),
        'DecisionTree': DecisionTreeClassifier(class_weight='balanced', random_state=42),
        'RandomForest': RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42),
        'XGBoost': XGBClassifier(scale_pos_weight=95/5, random_state=42, eval_metric='logloss')
    }
    
    results = {}
    best_model = None
    best_score = 0
    best_name = ""
    
    print("Training models...")
    for name, clf in models.items():
        pipeline = Pipeline(steps=[('preprocessor', preprocessor), ('classifier', clf)])
        pipeline.fit(X_train, y_train)
        
        y_pred = pipeline.predict(X_test)
        y_prob = pipeline.predict_proba(X_test)[:, 1]
        
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred)
        rec = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        roc = roc_auc_score(y_test, y_prob)
        
        results[name] = {
            'Accuracy': float(acc),
            'Precision': float(prec),
            'Recall': float(rec),
            'F1-Score': float(f1),
            'ROC-AUC': float(roc)
        }
        print(f"{name} -> ROC-AUC: {roc:.4f}, F1: {f1:.4f}")
        
        if roc > best_score:
            best_score = roc
            best_model = pipeline
            best_name = name
            
    print(f"\nBest Model Selected: {best_name} (ROC-AUC: {best_score:.4f})")
    
    # Save the best model
    os.makedirs('models', exist_ok=True)
    joblib.dump(best_model, 'models/production_fraud_model.joblib')
    
    with open('models/model_metrics.json', 'w') as f:
        json.dump({'best_model': best_name, 'metrics': results}, f, indent=4)
        
    print("Model and metrics saved successfully to ml_engine/models/")

if __name__ == "__main__":
    train_and_evaluate()

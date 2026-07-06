import pandas as pd
import numpy as np
import random
import uuid
import os

# Set seed for reproducibility
np.random.seed(42)
random.seed(42)

NUM_SAMPLES = 50000

def generate_synthetic_data(num_samples=NUM_SAMPLES):
    print(f"Generating {num_samples} synthetic transactions...")
    
    data = []
    for _ in range(num_samples):
        # Base features
        amount = round(np.random.lognormal(mean=3.5, sigma=1.2), 2)
        payment_methods = ['Credit Card', 'Debit Card', 'PayPal', 'Crypto', 'Bank Transfer']
        payment_method = np.random.choice(payment_methods, p=[0.5, 0.3, 0.15, 0.03, 0.02])
        
        devices = ['Mobile', 'Desktop', 'Tablet']
        device = np.random.choice(devices, p=[0.7, 0.25, 0.05])
        
        os_list = ['iOS', 'Android', 'Windows', 'macOS', 'Linux']
        if device == 'Mobile' or device == 'Tablet':
            os_type = np.random.choice(['iOS', 'Android'], p=[0.4, 0.6])
        else:
            os_type = np.random.choice(['Windows', 'macOS', 'Linux'], p=[0.6, 0.35, 0.05])
            
        transaction_hour = np.random.randint(0, 24)
        customer_age_days = np.random.randint(1, 3650) # account age
        
        # Fraud logic (injecting patterns)
        is_fraud = 0
        fraud_prob = 0.01 # Base fraud rate 1%
        
        if amount > 5000:
            fraud_prob += 0.3
        if transaction_hour >= 1 and transaction_hour <= 4:
            fraud_prob += 0.2 # late night
        if payment_method == 'Crypto':
            fraud_prob += 0.15
        if customer_age_days < 7:
            fraud_prob += 0.25 # new account
        
        if random.random() < fraud_prob:
            is_fraud = 1
            
        data.append({
            'transaction_id': str(uuid.uuid4()),
            'amount': amount,
            'payment_method': payment_method,
            'device': device,
            'os': os_type,
            'transaction_hour': transaction_hour,
            'customer_age_days': customer_age_days,
            'is_fraud': is_fraud
        })
        
    df = pd.DataFrame(data)
    
    # Save to CSV
    output_path = os.path.join(os.path.dirname(__file__), 'fraud_dataset.csv')
    df.to_csv(output_path, index=False)
    print(f"Dataset generated with shape {df.shape} and saved to {output_path}")
    print(f"Fraud distribution: \n{df['is_fraud'].value_counts(normalize=True)}")

if __name__ == "__main__":
    generate_synthetic_data()

import pandas as pd
import numpy as np
import random
from faker import Faker
import os

fake = Faker()
Faker.seed(42)
np.random.seed(42)
random.seed(42)

def generate_realistic_dataset(num_records=50000):
    print(f"Generating {num_records} realistic enterprise transactions...")
    
    # 1. Base Setup
    customer_ids = [fake.uuid4() for _ in range(num_records // 10)] # 5000 unique customers
    customer_names = {cid: fake.name() for cid in customer_ids}
    
    merchant_categories = ['Retail', 'Travel', 'Digital Goods', 'Food', 'Electronics', 'Crypto', 'Gaming']
    merchant_ids = [fake.uuid4() for _ in range(num_records // 50)] # 1000 unique merchants
    merchant_names = {mid: fake.company() for mid in merchant_ids}
    merchant_cats = {mid: random.choice(merchant_categories) for mid in merchant_ids}
    
    payment_methods = ['Credit Card', 'Debit Card', 'PayPal', 'Crypto Wallet', 'Bank Transfer']
    devices = ['Mobile', 'Desktop', 'Tablet']
    browsers = ['Chrome', 'Safari', 'Firefox', 'Edge']
    os_list = ['iOS', 'Android', 'Windows', 'macOS']
    currencies = ['USD', 'EUR', 'GBP', 'INR']
    transaction_types = ['Purchase', 'Refund', 'Subscription', 'Transfer']
    
    data = []
    
    for i in range(num_records):
        is_fraud = np.random.choice([0, 1], p=[0.95, 0.05]) # 5% fraud rate
        
        cid = random.choice(customer_ids)
        mid = random.choice(merchant_ids)
        
        # Base realistic amounts
        if is_fraud:
            amount = round(random.uniform(500.0, 10000.0), 2)
            payment = random.choice(['Crypto Wallet', 'Credit Card'])
            device = 'Desktop' if random.random() > 0.5 else 'Mobile'
            tx_type = 'Transfer' if random.random() > 0.5 else 'Purchase'
            country = random.choice(['Nigeria', 'Russia', 'Brazil', 'Unknown'])
            merchant_cat = random.choice(['Crypto', 'Gaming', 'Digital Goods'])
        else:
            amount = round(random.uniform(5.0, 800.0), 2)
            payment = random.choice(payment_methods)
            device = random.choice(devices)
            tx_type = random.choice(transaction_types)
            country = 'USA' if random.random() > 0.2 else fake.country()
            merchant_cat = merchant_cats[mid]

        row = {
            'transaction_id': fake.uuid4(),
            'customer_id': cid,
            'customer_name': customer_names[cid],
            'merchant_id': mid,
            'merchant_name': merchant_names[mid],
            'merchant_category': merchant_cat,
            'payment_method': payment,
            'device_type': device,
            'browser': random.choice(browsers),
            'os': random.choice(os_list),
            'ip_address': fake.ipv4(),
            'city': fake.city(),
            'state': fake.state_abbr(),
            'country': country,
            'transaction_type': tx_type,
            'currency': random.choice(currencies),
            'amount': amount,
            'transaction_hour': random.randint(0, 23),
            'is_fraud': is_fraud
        }
        data.append(row)
        
        if (i+1) % 10000 == 0:
            print(f"Generated {i+1} records...")

    df = pd.DataFrame(data)
    
    os.makedirs('data', exist_ok=True)
    file_path = 'data/synthetic_transactions.csv'
    df.to_csv(file_path, index=False)
    print(f"Dataset saved to {file_path}")
    print(df['is_fraud'].value_counts(normalize=True) * 100)

if __name__ == "__main__":
    generate_realistic_dataset()

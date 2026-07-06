-- SQL Views Optimized for Power BI Desktop

CREATE OR REPLACE VIEW vw_executive_summary AS
SELECT 
    COUNT(id) as total_transactions,
    SUM(amount) as total_volume,
    SUM(CASE WHEN status = 'blocked' THEN amount ELSE 0 END) as total_fraud_amount,
    COUNT(CASE WHEN status = 'blocked' THEN 1 END) as total_fraud_transactions,
    (COUNT(CASE WHEN status = 'blocked' THEN 1 END) / COUNT(id)) * 100 as fraud_rate
FROM transactions;

CREATE OR REPLACE VIEW vw_fraud_by_geography AS
SELECT 
    location,
    COUNT(id) as transaction_count,
    SUM(amount) as total_volume,
    SUM(CASE WHEN status = 'blocked' THEN 1 ELSE 0 END) as fraud_count
FROM transactions
GROUP BY location;

CREATE OR REPLACE VIEW vw_merchant_risk_profile AS
SELECT 
    m.name as merchant_name,
    m.category as merchant_category,
    COUNT(t.id) as total_transactions,
    SUM(t.amount) as total_revenue,
    SUM(CASE WHEN t.status = 'blocked' THEN 1 ELSE 0 END) as fraud_count,
    AVG(p.risk_score) as avg_risk_score
FROM merchants m
LEFT JOIN transactions t ON m.id = t.merchant_id
LEFT JOIN fraud_predictions p ON t.transaction_id = p.transaction_id
GROUP BY m.id;

CREATE OR REPLACE VIEW vw_customer_segmentation AS
SELECT 
    c.id as customer_id,
    c.name as customer_name,
    COUNT(t.id) as transaction_frequency,
    SUM(t.amount) as customer_lifetime_value,
    AVG(p.risk_score) as avg_customer_risk
FROM customers c
LEFT JOIN transactions t ON c.id = t.customer_id
LEFT JOIN fraud_predictions p ON t.transaction_id = p.transaction_id
GROUP BY c.id;

CREATE OR REPLACE VIEW vw_hourly_fraud_trend AS
SELECT 
    HOUR(created_at) as hour_of_day,
    COUNT(id) as total_transactions,
    SUM(CASE WHEN status = 'blocked' THEN 1 ELSE 0 END) as fraud_count
FROM transactions
GROUP BY HOUR(created_at)
ORDER BY hour_of_day;

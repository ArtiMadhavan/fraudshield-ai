import urllib.request
import urllib.parse
import json

def test_api():
    print("Testing ML Metrics API...")
    req = urllib.request.Request("http://127.0.0.1:8080/api/v1/system/ml-metrics")
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            if "featureImportance" not in data:
                print("[SUCCESS] featureImportance successfully removed")
            else:
                print("[FAIL] featureImportance still exists")
    except Exception as e:
        print("API Error:", e)

    print("Testing Upload API...")
    payload = [{
        "customer_id": "CUST-9921",
        "merchant_id": "M-APPLE",
        "amount": 1250.00,
        "currency": "USD",
        "payment_method": "Credit Card",
        "device": "Desktop",
        "browser": "Chrome",
        "os": "Windows",
        "location": "New York, USA",
        "ip_address": "192.168.1.1",
        "transaction_type": "Purchase"
    }]
    file_data = json.dumps(payload).encode('utf-8')
    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
    
    body = (
        f"--{boundary}\r\n"
        f"Content-Disposition: form-data; name=\"file\"; filename=\"test.json\"\r\n"
        f"Content-Type: application/json\r\n\r\n"
    ).encode('utf-8') + file_data + f"\r\n--{boundary}--\r\n".encode('utf-8')

    req = urllib.request.Request(
        "http://127.0.0.1:8080/api/v1/payments/upload",
        data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode())
            print("Response:", json.dumps(res_data, indent=2))
            details = res_data.get("details", [{}])[0].get("decision", {})
            required_keys = ["decision", "risk_score", "fraud_probability", "confidence", "risk_level", "reasons", "recommendation"]
            for key in required_keys:
                if key in details:
                    print(f"[SUCCESS] Found {key}: {details[key]}")
                else:
                    print(f"[FAIL] Missing {key}")
    except Exception as e:
        print("Upload Error:", e)

if __name__ == "__main__":
    test_api()

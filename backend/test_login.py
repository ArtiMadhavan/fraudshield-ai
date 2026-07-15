import requests
import json

data = {
    "username": "testuser",
    "email": "test@test.com",
    "password": "Password123!",
    "role": "customer"
}

# Register
print("Registering...")
response = requests.post("http://127.0.0.1:8000/api/v1/auth/register", json=data)
print("Register Status:", response.status_code)
print("Register Body:", response.json())

# Login
login_data = {
    "username": "test@test.com",
    "password": "Password123!"
}
print("\nLogging in...")
response2 = requests.post("http://127.0.0.1:8000/api/v1/auth/login", data=login_data)
print("Login Status:", response2.status_code)
print("Login Body:", response2.json())

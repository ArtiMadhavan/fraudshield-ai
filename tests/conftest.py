import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import Base, get_db
from app.auth import get_password_hash
from app.models.models import User, Transaction, Customer, Merchant, FraudPrediction, FraudAlert, AuditLog

from sqlalchemy.pool import StaticPool

# Use an in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def setup_database():
    print(f"Creating tables in {engine.url}")
    print(f"Registered tables: {Base.metadata.tables.keys()}")
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    # Seed a test admin
    admin = User(
        username="testadmin",
        email="admin@test.com",
        password_hash=get_password_hash("testpass"),
        role="admin"
    )
    db.add(admin)
    db.commit()
    db.close()
    print("Test admin seeded.")
    yield
    Base.metadata.drop_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module")
def client(setup_database):
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="module")
def admin_token(client, setup_database):
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "testadmin", "password": "testpass"}
    )
    return response.json()["access_token"]

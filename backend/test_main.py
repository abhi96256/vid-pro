import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db
from main import app
import os
import io

# Test Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture
def auth_token():
    # Register and Login to get token
    client.post("/register", json={"email": "test@example.com", "password": "password123"})
    response = client.post("/token", data={"username": "test@example.com", "password": "password123"})
    return response.json()["access_token"]

def test_register_user():
    response = client.post(
        "/register",
        json={"email": "newuser@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == "newuser@example.com"

def test_login_user():
    response = client.post(
        "/token",
        data={"username": "newuser@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_unauthorized_upload():
    response = client.post("/upload")
    assert response.status_code == 401

def test_upload_file(auth_token):
    file_content = b"fake pdf content"
    file = io.BytesIO(file_content)
    response = client.post(
        "/upload",
        headers={"Authorization": f"Bearer {auth_token}"},
        files={"file": ("test.pdf", file, "application/pdf")}
    )
    assert response.status_code == 200
    assert "filename" in response.json()
    return response.json()["id"]

def test_list_files(auth_token):
    response = client.get(
        "/files",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_chat_unauthorized():
    response = client.post("/chat/1", json={"message": "hi"})
    assert response.status_code == 401

# Cleanup
@pytest.fixture(scope="session", autouse=True)
def cleanup(request):
    def remove_test_db():
        if os.path.exists("./test.db"):
            os.remove("./test.db")
    request.addfinalizer(remove_test_db)

from fastapi.testclient import TestClient
from main import app
import pytest
import uuid

# Create a test client that interacts with our FastAPI application
client = TestClient(app)

# Generate unique credentials for this specific test run
# This ensures our tests don't fail if they run multiple times against the same database
UNIQUE_ID = str(uuid.uuid4())[:8]
TEST_EMAIL = f"testuser_{UNIQUE_ID}@mzansibuilds.co.za"
TEST_USERNAME = f"tester_{UNIQUE_ID}"
TEST_PASSWORD = "SuperSecurePassword123!"

def test_read_root():
    """Test that the API is running and returns the expected message."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "MzansiBuilds API is running securely"}

def test_register_user_missing_data():
    """Test that the API rejects registration attempts with missing fields (Secure By Design)."""
    response = client.post(
        "/api/auth/register",
        json={"email": "badrequest@mzansibuilds.co.za"} # Deliberately missing username and password
    )
    # 422 Unprocessable Entity
    assert response.status_code == 422

def test_register_user_success():
    """Test the happy path: successfully registering a new user."""
    response = client.post(
        "/api/auth/register",
        json={
            "email": TEST_EMAIL,
            "username": TEST_USERNAME,
            "password": TEST_PASSWORD
        }
    )
    # Most APIs return 200 OK or 201 Created on success
    assert response.status_code in [200, 201]
    data = response.json()
    assert data["email"] == TEST_EMAIL
    assert data["username"] == TEST_USERNAME
    assert "id" in data # Ensure the database assigned an ID

def test_register_duplicate_email():
    """Test that the API prevents multiple accounts with the same email."""
    response = client.post(
        "/api/auth/register",
        json={
            "email": TEST_EMAIL, # Re-using the email we just registered
            "username": f"different_name_{UNIQUE_ID}",
            "password": "AnotherPassword123!"
        }
    )
    # 400 Bad Request
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"].lower()

def test_login_success():
    """Test the happy path: successfully logging in and receiving a JWT."""
    # Remember, our login endpoint uses OAuth2 form data, so we send it as 'data', not 'json'
    response = client.post(
        "/api/auth/login",
        data={
            "username": TEST_EMAIL, # OAuth2 expects the email in the 'username' field
            "password": TEST_PASSWORD
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_credentials():
    """Test that the API prevents unauthorised access with bad passwords."""
    response = client.post(
        "/api/auth/login",
        data={
            "username": TEST_EMAIL,
            "password": "WrongPassword123!"
        }
    )
    # 401 Unauthorised
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"
from fastapi.testclient import TestClient
from main import app
import pytest

client = TestClient(app)

def test_read_root():
    """Test that the API is running and returns the expected message."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "MzansiBuilds API is running securely"}

def test_register_user_missing_data():
    """Test that the API rejects registration attempts with missing fields (Secure By Design)."""
    response = client.post(
        "/api/auth/register",
        json={"email": "test@mzansibuilds.co.za"} # Deliberately missing username and password
    )
    # 422 is the standard HTTP status code for Validation Errors (Unprocessable Entity)
    assert response.status_code == 422

def test_login_invalid_credentials():
    """Test that the API prevents unauthorised access with bad passwords."""
    response = client.post(
        "/api/auth/login",
        json={
            "email": "dev@mzansibuilds.co.za",
            "password": "WrongPassword123!"
        }
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"
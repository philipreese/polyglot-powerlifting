from unittest.mock import patch

from fastapi.testclient import TestClient

from main import app
from middleware.auth import require_current_user
from repositories.lifts import LiftsRepository

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Welcome" in response.json()["message"]


def test_create_lift_anonymous():
    payload = {
        "bodyweight": 100.0,
        "gender": "male",
        "equipment": "raw",
        "squat": 200.0,
        "bench": 150.0,
        "deadlift": 250.0,
    }
    response = client.post("/lifts/", json=payload)
    if response.status_code != 200:
        print(response.json())
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 600.0
    assert "wilks" in data
    assert "dots" in data
    assert "ipf_gl" in data
    assert "reshel" in data
    assert data.get("user_id") is None  # Because we didn't send an auth token


def test_create_lift_validation_error():
    payload = {
        "bodyweight": -10.0,  # Invalid bodyweight
        "gender": "alien",  # Invalid gender
        "equipment": "raw",
        "squat": 200.0,
        "bench": 150.0,
        "deadlift": 250.0,
    }
    response = client.post("/lifts/", json=payload)
    assert response.status_code == 422  # Unprocessable Entity


def test_get_lifts_unauthorized():
    # Without Auth header, endpoints requiring tokens should fail
    # Our new `require_current_user` dependency enforces this nicely
    response = client.get("/lifts/")
    assert response.status_code == 401  # Unauthorized


@patch.object(LiftsRepository, "get_by_user")
def test_get_lifts_authorized(mock_get_by_user):
    # Setup mock data for the repository
    mock_data = {
        "id": "123e4567-e89b-12d3-a456-426614174001",
        "user_id": "123e4567-e89b-12d3-a456-426614174000",
        "bodyweight": 100.0,
        "gender": "male",
        "equipment": "raw",
        "squat": 200.0,
        "bench": 100.0,
        "deadlift": 200.0,
        "total": 500.0,
        "wilks": 305.0,
        "dots": 308.0,
        "ipf_gl": 83.0,
        "reshel": 457.0,
    }
    mock_get_by_user.return_value = [mock_data]

    # Use FastAPI Dependency Injection overrides to "bypass" the real auth check
    app.dependency_overrides[require_current_user] = lambda: "123e4567-e89b-12d3-a456-426614174000"

    response = client.get("/lifts/", headers={"Authorization": "Bearer fake_token"})
    assert response.status_code == 200
    assert response.json()[0]["total"] == 500.0

    # Clean up the override
    app.dependency_overrides = {}

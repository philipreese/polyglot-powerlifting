from unittest.mock import patch

from fastapi.testclient import TestClient
from main import app

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
        "deadlift": 250.0
    }
    response = client.post("/lifts/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 600.0
    assert "wilks" in data
    assert "dots" in data
    assert "ipf_gl" in data
    assert "reshel" in data
    assert data.get("user_id") is None # Because we didn't send an auth token

def test_create_lift_validation_error():
    payload = {
        "bodyweight": -10.0, # Invalid bodyweight
        "gender": "alien",   # Invalid gender
        "equipment": "raw",
        "squat": 200.0,
        "bench": 150.0,
        "deadlift": 250.0
    }
    response = client.post("/lifts/", json=payload)
    assert response.status_code == 422 # Unprocessable Entity
    
@patch('routes.lifts.supabase') # Mock the supabase client import
def test_get_lifts_unauthorized(mock_supabase):
    # Without Auth header, endpoints requiring tokens should fail
    response = client.get("/lifts/")
    assert response.status_code == 422 # Missing Header
    
@patch('routes.lifts.supabase')
def test_get_lifts_authorized(mock_supabase):
    # Mocking a successful user token lookup
    mock_supabase.auth.get_user.return_value.user.id = "123e4567-e89b-12d3-a456-426614174000"
    
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
        "reshel": 457.0
    }
    
    mock_supabase.table().select().eq().execute.return_value.data = [mock_data]
    
    response = client.get("/lifts/", headers={"Authorization": "Bearer fake_token"})
    assert response.status_code == 200
    assert response.json()[0]["total"] == 500.0

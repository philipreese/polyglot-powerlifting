curl -X POST http://localhost:8000/lifts/sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TEST" \
  -d '[{"bodyweight": 80.0, "gender": "male", "equipment": "raw", "squat": 100, "bench": 100, "deadlift": 100, "total": 300, "wilks": 0, "dots": 0, "ipf_gl": 0, "reshel": 0, "id": "00000000-0000-0000-0000-000000000000", "created_at": "2024-03-22T00:00:00Z", "user_id": null}]'

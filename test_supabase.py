from services.db import supabase
import uuid, json, datetime
res = supabase.table('lifts').select('*').limit(1).execute()
user_id = res.data[0]['user_id'] if res.data else "00000000-0000-0000-0000-000000000000"

records = [{
    "bodyweight": 80.0, "gender": "male", "equipment": "raw", "squat": 100.0, "bench": 100.0, "deadlift": 100.0, 
    "id": str(uuid.uuid4()), "user_id": user_id, "created_at": datetime.datetime.now().isoformat(), "total": 300.0, "wilks": 0.0, "dots": 0.0, "ipf_gl": 0.0, "reshel": 0.0
}]

print("Inserting...", records)
try:
    print(supabase.table("lifts").insert(records).execute())
except Exception as e:
    import traceback
    traceback.print_exc()

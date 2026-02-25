from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Header, HTTPException
from models.schemas import LiftRequest, LiftResponse
from services.db import supabase
from services.formulas import calculate_dots, calculate_ipf_gl, calculate_reshel, calculate_wilks

router = APIRouter(prefix="/lifts", tags=["lifts"])

@router.post("/", response_model=LiftResponse)
def create_lift(request: LiftRequest, authorization: Optional[str] = Header(None)):
    # Calculate the total and all coefficients
    total = request.squat + request.bench + request.deadlift
    wilks = calculate_wilks(request.bodyweight, total, request.gender)
    dots = calculate_dots(request.bodyweight, total, request.gender)
    ipf_gl = calculate_ipf_gl(request.bodyweight, total, request.gender, request.equipment)
    reshel = calculate_reshel(request.bodyweight, total, request.gender)
    
    # Construct the response object
    response_data = request.model_dump()
    response_data.update({
        "total": total,
        "wilks": wilks,
        "dots": dots,
        "ipf_gl": ipf_gl,
        "reshel": reshel
    })
    
    # If Supabase is connected and an auth token is provided, attempt to save
    if supabase and authorization:
        try:
            token = authorization.replace("Bearer ", "")
            user = supabase.auth.get_user(token)
            if user:
                response_data["user_id"] = user.user.id
                db_res = supabase.table("lifts").insert(response_data).execute()
                return db_res.data[0] # Return the DB record (includes id and created_at)
        except Exception:
            # Token invalid or DB failure, returning calculated values silently
            pass
            
    return response_data

@router.get("/", response_model=List[LiftResponse])
def get_lifts(authorization: str = Header(...)):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
        token = authorization.replace("Bearer ", "")
        user = supabase.auth.get_user(token)
        user_id = user.user.id
        db_res = supabase.table("lifts").select("*").eq("user_id", user_id).execute()
        return db_res.data
    except Exception:
        raise HTTPException(status_code=401, detail="Unauthorized")

@router.delete("/{lift_id}")
def delete_lift(lift_id: UUID, authorization: str = Header(...)):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
        token = authorization.replace("Bearer ", "")
        user = supabase.auth.get_user(token)
        user_id = user.user.id
        
        db_res = supabase.table("lifts").delete().eq("id", str(lift_id)).eq("user_id", user_id).execute()
        
        # Check if a row was actually deleted
        if not db_res.data:
            raise HTTPException(status_code=404, detail="Lift not found or not owned by user")
            
        return {"message": "Lift deleted successfully"}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Unauthorized")

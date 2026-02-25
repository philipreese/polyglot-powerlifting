from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from middleware.auth import get_current_user, require_current_user
from models.schemas import LiftRequest, LiftResponse
from repositories.lifts import LiftsRepository
from services.formulas import calculate_dots, calculate_ipf_gl, calculate_reshel, calculate_wilks

router = APIRouter(prefix="/lifts", tags=["lifts"])

@router.post("/", response_model=LiftResponse)
def create_lift(
    request: LiftRequest,
    user_id: Optional[str] = Depends(get_current_user)
):
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
    
    # Materialize the data into the canonical Domain Model
    lift_response_model = LiftResponse(**response_data)
    
    # If the user is authenticated, save to the database via Repository
    if user_id:
        lift_response_model.user_id = UUID(user_id) if isinstance(user_id, str) else user_id
        db_record = LiftsRepository.create(lift_response_model)
        if db_record:
            return db_record
            
    return lift_response_model

@router.get("/", response_model=List[LiftResponse])
def get_lifts(user_id: str = Depends(require_current_user)):
    return LiftsRepository.get_by_user(user_id)

@router.delete("/{lift_id}")
def delete_lift(lift_id: UUID, user_id: str = Depends(require_current_user)):
    success = LiftsRepository.delete(lift_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Lift not found or not owned by user")
    return {"message": "Lift deleted successfully"}

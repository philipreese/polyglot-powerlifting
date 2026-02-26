from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from middleware.auth import get_current_user, require_current_user, get_token
from models.schemas import LiftRequest, LiftResponse
from repositories.lifts import LiftsRepository
from services.formulas import calculate_dots, calculate_ipf_gl, calculate_reshel, calculate_wilks

router = APIRouter(prefix="/lifts", tags=["lifts"])

@router.post("/", response_model=LiftResponse)
def create_lift(
    request: LiftRequest,
    user_id: Optional[str] = Depends(get_current_user),
    token: Optional[str] = Depends(get_token)
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
    if user_id and token:
        lift_response_model.user_id = UUID(user_id) if isinstance(user_id, str) else user_id
        db_record = LiftsRepository.create(lift_response_model, token)
        if db_record:
            return db_record
            
    return lift_response_model

@router.get("/", response_model=List[LiftResponse])
def get_lifts(
    user_id: str = Depends(require_current_user),
    token: str = Depends(get_token)
):
    return LiftsRepository.get_by_user(user_id, token)

@router.delete("/{lift_id}")
def delete_lift(
    lift_id: UUID, 
    user_id: str = Depends(require_current_user),
    token: str = Depends(get_token)
):
    success = LiftsRepository.delete(lift_id, user_id, token)
    if not success:
        raise HTTPException(status_code=404, detail="Lift not found or not owned by user")
    return {"message": "Lift deleted successfully"}

@router.delete("/")
def clear_lifts(
    user_id: str = Depends(require_current_user),
    token: str = Depends(get_token)
):
    """Clear all authenticated history."""
    LiftsRepository.delete_all(user_id, token)
    return {"message": "All lifts cleared"}

@router.post("/sync", response_model=List[LiftResponse])
def sync_lifts(
    lifts: List[LiftResponse],
    user_id: str = Depends(require_current_user),
    token: str = Depends(get_token)
):
    """Bulk import local offline history into the user's account."""
    try:
        for lift in lifts:
            lift.user_id = UUID(user_id) if isinstance(user_id, str) else user_id
            
        return LiftsRepository.bulk_create(lifts, token)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")

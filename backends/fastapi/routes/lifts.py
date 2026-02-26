from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from middleware.auth import get_current_user, get_token, require_current_user
from models.schemas import LiftRequest, LiftResponse
from services.lifts import LiftsService

router = APIRouter(prefix="/lifts", tags=["lifts"])

@router.post("/", response_model=LiftResponse)
def create_lift(
    request: LiftRequest,
    user_id: Optional[str] = Depends(get_current_user),
    token: Optional[str] = Depends(get_token)
):
    """Calculate and optionally save a new lift."""
    return LiftsService.create_lift(request, user_id, token)

@router.get("/", response_model=List[LiftResponse])
def get_lifts(
    user_id: str = Depends(require_current_user),
    token: str = Depends(get_token)
):
    """Fetch all history for the authenticated user."""
    return LiftsService.get_history(user_id, token)

@router.delete("/{lift_id}")
def delete_lift(
    lift_id: UUID, 
    user_id: str = Depends(require_current_user),
    token: str = Depends(get_token)
):
    """Delete a specific record."""
    success = LiftsService.delete_lift(lift_id, user_id, token)
    if not success:
        raise HTTPException(status_code=404, detail="Lift not found or not owned by user")
    return {"message": "Lift deleted successfully"}

@router.delete("/")
def clear_lifts(
    user_id: str = Depends(require_current_user),
    token: str = Depends(get_token)
):
    """Clear all authenticated history."""
    LiftsService.clear_history(user_id, token)
    return {"message": "All lifts cleared"}

@router.post("/sync", response_model=List[LiftResponse])
def sync_lifts(
    lifts: List[LiftResponse],
    user_id: str = Depends(require_current_user),
    token: str = Depends(get_token)
):
    """Bulk import local offline history into the user's account."""
    try:
        return LiftsService.sync_lifts(lifts, user_id, token)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")

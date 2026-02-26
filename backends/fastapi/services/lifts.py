from typing import List, Optional
from uuid import UUID

from fastapi import Depends
from models.schemas import LiftRequest, LiftResponse
from repositories.lifts import LiftsRepository, get_lifts_repository
from services.formulas import calculate_dots, calculate_ipf_gl, calculate_reshel, calculate_wilks


class LiftsService:
    def __init__(self, lifts_repo: LiftsRepository):
        self.lifts_repo = lifts_repo

    def calculate_results(self, request: LiftRequest) -> LiftResponse:
        """Calculate all powerlifting scores for a given request."""
        total = request.squat + request.bench + request.deadlift
        
        wilks = calculate_wilks(request.bodyweight, total, request.gender)
        dots = calculate_dots(request.bodyweight, total, request.gender)
        ipf_gl = calculate_ipf_gl(request.bodyweight, total, request.gender, request.equipment)
        reshel = calculate_reshel(request.bodyweight, total, request.gender)
        
        response_data = request.model_dump()
        response_data.update({
            "total": total,
            "wilks": wilks,
            "dots": dots,
            "ipf_gl": ipf_gl,
            "reshel": reshel
        })
        
        return LiftResponse(**response_data)

    def create_lift(self, request: LiftRequest, user_id: Optional[str] = None, token: Optional[str] = None) -> LiftResponse:
        """Complete orchestration for creating a lift, including calculation and persistence."""
        lift_model = self.calculate_results(request)
        
        if user_id and token:
            lift_model.user_id = UUID(user_id) if isinstance(user_id, str) else user_id
            db_record = self.lifts_repo.create(lift_model, token)
            if db_record:
                return db_record
                
        return lift_model

    def get_history(self, user_id: str, token: str) -> List[LiftResponse]:
        """Fetch user history via repository."""
        return self.lifts_repo.get_by_user(user_id, token)

    def delete_lift(self, lift_id: UUID, user_id: str, token: str) -> bool:
        """Delete a lift via repository."""
        return self.lifts_repo.delete(lift_id, user_id, token)

    def clear_history(self, user_id: str, token: str) -> bool:
        """Clear all lifts for a user via repository."""
        return self.lifts_repo.delete_all(user_id, token)

    def sync_lifts(self, lifts: List[LiftResponse], user_id: str, token: str) -> List[LiftResponse]:
        """Sync local lifts to the database."""
        for lift in lifts:
            lift.user_id = UUID(user_id) if isinstance(user_id, str) else user_id
            
        return self.lifts_repo.bulk_create(lifts, token)

def get_lifts_service(lifts_repo: LiftsRepository = Depends(get_lifts_repository)) -> LiftsService:
    """Provider function for LiftsService injection."""
    return LiftsService(lifts_repo)

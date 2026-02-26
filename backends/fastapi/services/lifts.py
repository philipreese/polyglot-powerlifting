from typing import List, Optional
from uuid import UUID

from models.schemas import LiftRequest, LiftResponse
from repositories.lifts import LiftsRepository
from services.formulas import calculate_dots, calculate_ipf_gl, calculate_reshel, calculate_wilks


class LiftsService:
    @staticmethod
    def calculate_results(request: LiftRequest) -> LiftResponse:
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

    @classmethod
    def create_lift(cls, request: LiftRequest, user_id: Optional[str] = None, token: Optional[str] = None) -> LiftResponse:
        """Complete orchestration for creating a lift, including calculation and persistence."""
        lift_model = cls.calculate_results(request)
        
        if user_id and token:
            lift_model.user_id = UUID(user_id) if isinstance(user_id, str) else user_id
            db_record = LiftsRepository.create(lift_model, token)
            if db_record:
                return db_record
                
        return lift_model

    @staticmethod
    def get_history(user_id: str, token: str) -> List[LiftResponse]:
        """Fetch user history via repository."""
        return LiftsRepository.get_by_user(user_id, token)

    @staticmethod
    def delete_lift(lift_id: UUID, user_id: str, token: str) -> bool:
        """Delete a lift via repository."""
        return LiftsRepository.delete(lift_id, user_id, token)

    @staticmethod
    def clear_history(user_id: str, token: str) -> bool:
        """Clear all lifts for a user via repository."""
        return LiftsRepository.delete_all(user_id, token)

    @staticmethod
    def sync_lifts(lifts: List[LiftResponse], user_id: str, token: str) -> List[LiftResponse]:
        """Sync local lifts to the database."""
        for lift in lifts:
            lift.user_id = UUID(user_id) if isinstance(user_id, str) else user_id
            
        return LiftsRepository.bulk_create(lifts, token)

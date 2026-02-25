from typing import List, Optional
from uuid import UUID

from models.schemas import LiftResponse
from services.db import supabase


class LiftsRepository:
    """
    Repository pattern to handle all database interactions for Lifts.
    This decouples the database (Supabase) from the FastAPI routing logic,
    making it easier to swap or mock the database later.
    """
    
    @staticmethod
    def create(lift: LiftResponse) -> Optional[LiftResponse]:
        """Insert a new lift record."""
        if not supabase:
            return None
            
        lift_data = lift.model_dump(mode="json", exclude_unset=True)
        res = supabase.table("lifts").insert(lift_data).execute()
        return LiftResponse(**res.data[0]) if res.data else None

    @staticmethod
    def get_by_user(user_id: str) -> List[LiftResponse]:
        """Fetch all lifts belonging to a specific user."""
        if not supabase:
            return []
            
        res = supabase.table("lifts").select("*").eq("user_id", user_id).execute()
        return [LiftResponse(**lift) for lift in res.data]

    @staticmethod
    def delete(lift_id: UUID, user_id: str) -> bool:
        """Delete a lift, ensuring it belongs to the requesting user."""
        if not supabase:
            return False
            
        res = supabase.table("lifts").delete().eq("id", str(lift_id)).eq("user_id", user_id).execute()
        return len(res.data) > 0

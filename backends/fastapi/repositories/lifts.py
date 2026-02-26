from typing import List, Optional
from uuid import UUID

from models.schemas import LiftResponse
from services.db import get_auth_client, supabase


class LiftsRepository:
    """
    Repository pattern to handle all database interactions for Lifts.
    This decouples the database (Supabase) from the FastAPI routing logic,
    making it easier to swap or mock the database later.
    """
    
    @staticmethod
    def create(lift: LiftResponse, token: Optional[str] = None) -> Optional[LiftResponse]:
        """Insert a new lift record."""
        client = get_auth_client(token) if token else supabase
        if not client:
            return None
            
        lift_data = lift.model_dump(mode="json", exclude_unset=True, exclude={"total"})
        res = client.table("lifts").insert(lift_data).execute()
        return LiftResponse(**res.data[0]) if res.data else None

    @staticmethod
    def get_by_user(user_id: str, token: str) -> List[LiftResponse]:
        """Fetch all lifts belonging to a specific user."""
        client = get_auth_client(token)
        if not client:
            return []
            
        res = client.table("lifts").select("*").eq("user_id", user_id).execute()
        return [LiftResponse(**lift) for lift in res.data]

    @staticmethod
    def delete(lift_id: UUID, user_id: str, token: str) -> bool:
        """Delete a lift, ensuring it belongs to the requesting user."""
        client = get_auth_client(token)
        if not client:
            return False
            
        res = client.table("lifts").delete().eq("id", str(lift_id)).eq("user_id", user_id).execute()
        return len(res.data) > 0

    @staticmethod
    def bulk_create(lifts: List[LiftResponse], token: str) -> List[LiftResponse]:
        """Insert multiple lift records at once."""
        client = get_auth_client(token)
        if not client or not lifts:
            return []
        
        records = [lift.model_dump(mode="json", exclude_none=True, exclude={"total"}) for lift in lifts]
        res = client.table("lifts").insert(records).execute()
        return [LiftResponse(**lift) for lift in res.data] if res.data else []

    @staticmethod
    def delete_all(user_id: str, token: str) -> bool:
        """Clear all lifts for a user."""
        client = get_auth_client(token)
        if not client:
            return False
        
        # We must include a filter on user_id to prevent destroying other users' data.
        # But Supabase requires an equality check for deletes
        _ = client.table("lifts").delete().eq("user_id", user_id).execute()
        return True

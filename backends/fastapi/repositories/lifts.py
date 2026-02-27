from typing import List, Optional
from uuid import UUID, uuid4

from middleware.logging import DomainException
from models.schemas import LiftResponse
from services.db import get_auth_client, supabase


class LiftsRepository:
    """
    Repository pattern to handle all database interactions for Lifts.
    This decouples the database (Supabase) from the FastAPI routing logic,
    making it easier to swap or mock the database later.
    """

    def create(self, lift: LiftResponse, token: Optional[str] = None) -> Optional[LiftResponse]:
        """Insert a new lift record."""
        client = get_auth_client(token) if token else supabase
        if not client:
            raise DomainException("Database client not initialized", status_code=500)

        lift_data = lift.model_dump(mode="json", exclude_unset=True, exclude={"total"})
        try:
            res = client.table("lifts").insert(lift_data).execute()
            if not res.data:
                raise DomainException("Failed to create lift record", status_code=500)
            return LiftResponse(**res.data[0])
        except Exception as e:
            raise DomainException(f"Database error: {str(e)}", status_code=500)

    def get_by_user(self, user_id: str, token: str) -> List[LiftResponse]:
        """Fetch all lifts belonging to a specific user."""
        client = get_auth_client(token)
        if not client:
            raise DomainException("Database client not initialized", status_code=500)

        try:
            res = (
                client.table("lifts")
                .select("*")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .execute()
            )
            return [LiftResponse(**lift) for lift in res.data]
        except Exception as e:
            raise DomainException(f"Failed to fetch history: {str(e)}", status_code=500)

    def delete(self, lift_id: UUID, user_id: str, token: str) -> bool:
        """Delete a lift, ensuring it belongs to the requesting user."""
        client = get_auth_client(token)
        if not client:
            raise DomainException("Database client not initialized", status_code=500)

        try:
            res = (
                client.table("lifts")
                .delete()
                .eq("id", str(lift_id))
                .eq("user_id", user_id)
                .execute()
            )
            if not res.data:
                raise DomainException("Lift not found or not owned by user", status_code=404)
            return True
        except DomainException:
            raise
        except Exception as e:
            raise DomainException(f"Failed to delete lift: {str(e)}", status_code=500)

    def bulk_create(self, lifts: List[LiftResponse], token: str) -> List[LiftResponse]:
        """Insert multiple lift records at once."""
        client = get_auth_client(token)
        if not client:
            raise DomainException("Database client not initialized", status_code=500)

        if not lifts:
            return []

        records = []
        for lift in lifts:
            # PostgREST requires uniform keys for bulk inserts.
            # If some records are missing 'id', it pads with null, causing constraint violations.
            # We ensure every record has an ID here.
            if lift.id is None:
                lift.id = uuid4()

            data = lift.model_dump(mode="json", exclude_none=True, exclude={"total"})
            records.append(data)

        try:
            res = client.table("lifts").insert(records).execute()
            return [LiftResponse(**lift) for lift in res.data] if res.data else []
        except Exception as e:
            raise DomainException(f"Bulk sync failed: {str(e)}", status_code=500)

    def delete_all(self, user_id: str, token: str) -> bool:
        """Clear all lifts for a user."""
        client = get_auth_client(token)
        if not client:
            raise DomainException("Database client not initialized", status_code=500)

        try:
            client.table("lifts").delete().eq("user_id", user_id).execute()
            return True
        except Exception as e:
            raise DomainException(f"Failed to clear history: {str(e)}", status_code=500)


def get_lifts_repository() -> LiftsRepository:
    """Provider function for LiftsRepository injection."""
    return LiftsRepository()

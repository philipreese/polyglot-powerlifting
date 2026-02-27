from typing import Optional

from supabase import Client, create_client

from config import settings

# Initialize the client if environment variables are present.
# If not, the app will still boot for local math-only calculations.
supabase: Optional[Client] = None
if settings.is_supabase_configured:
    supabase = create_client(settings.supabase_url, settings.supabase_anon_key)


def get_auth_client(token: str) -> Optional[Client]:
    """Returns a new Supabase client perfectly scoped with the user's JWT for RLS."""
    if not settings.is_supabase_configured:
        return None
    from supabase import ClientOptions

    options = ClientOptions(headers={"Authorization": f"Bearer {token}"})
    return create_client(settings.supabase_url, settings.supabase_anon_key, options=options)

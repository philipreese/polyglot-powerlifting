import os
from typing import Optional

from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_KEY", "")

# We initialize the client if environment variables are present. 
# If not, the app will still boot for local math-only calculations.
if url and key:
    supabase: Client = create_client(url, key)
else:
    supabase = None

def get_auth_client(token: str) -> Optional[Client]:
    """Returns a new Supabase client perfectly scoped with the user's JWT for RLS."""
    if not url or not key:
        return None
    from supabase import ClientOptions
    options = ClientOptions(headers={'Authorization': f'Bearer {token}'})
    return create_client(url, key, options=options)

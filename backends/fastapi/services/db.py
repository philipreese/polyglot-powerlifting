import os

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

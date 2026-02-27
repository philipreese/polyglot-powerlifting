import structlog
from config import settings
from fastapi import APIRouter
from services.db import supabase

router = APIRouter(prefix="/health", tags=["health"])
logger = structlog.get_logger()

@router.get("/supabase")
async def check_supabase():
    """Diagnostic endpoint to verify Supabase configuration and connectivity."""
    url = settings.supabase_url
    # Mask key for safety
    key_prefix = settings.supabase_anon_key[:10] + "..." if settings.supabase_anon_key else "None"
    
    status = "configured" if settings.is_supabase_configured else "not_configured"
    client_status = "initialized" if supabase is not None else "failed"
    
    try:
        # Simple query to check connectivity
        if supabase:
            _ = supabase.table("lifts").select("count", count="exact").limit(1).execute()
            connectivity = "ok"
        else:
            connectivity = "client_missing"
    except Exception as e:
        connectivity = f"error: {str(e)}"
        logger.error("health_check_failed", error=str(e))

    return {
        "status": status,
        "client": client_status,
        "connectivity": connectivity,
        "url": url,
        "key_prefix": key_prefix
    }

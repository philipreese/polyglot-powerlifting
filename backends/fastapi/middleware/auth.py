from typing import Optional

from fastapi import Depends, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from middleware.logging import DomainException
from services.db import supabase

security = HTTPBearer(auto_error=False) # auto_error=False allows optional auth

async def get_token(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Optional[str]:
    """Extracts the raw JWT string."""
    return credentials.credentials if credentials else None

async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Optional[str]:
    """
    FastAPI Dependency that extracts the JWT from the header, 
    verifies it with Supabase, and returns the user's UUID.
    """
    if not credentials:
        return None
        
    if not supabase:
        raise DomainException("Database not configured", status_code=500)
        
    import structlog
    logger = structlog.get_logger()
    try:
        token = credentials.credentials
        segments = token.count('.') + 1
        
        # Safe logging for production debugging
        logger.info("auth_attempt", 
            token_prefix=f"{token[:10]}..." if token else "none",
            segments=segments,
            has_supabase_client=supabase is not None
        )

        if segments != 3:
            logger.error("auth_invalid_segments", count=segments)
            return None

        user_resp = supabase.auth.get_user(token)
        if user_resp and user_resp.user:
            return user_resp.user.id
            
        logger.warning("auth_failed", 
            reason="No user returned from Supabase",
            response_type=type(user_resp).__name__
        )
        return None
    except Exception as e:
        logger.error("auth_exception", 
            error=str(e),
            type=type(e).__name__
        )
        return None

async def require_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> str:
    """
    FastAPI Dependency that forces authentication.
    """
    if not credentials:
        raise DomainException("Not authenticated", status_code=status.HTTP_401_UNAUTHORIZED)
        
    user_id = await get_current_user(credentials)
    if not user_id:
        raise DomainException("Invalid authentication credentials", status_code=status.HTTP_401_UNAUTHORIZED)
        
    return user_id

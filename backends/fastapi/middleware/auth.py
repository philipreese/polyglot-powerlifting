from typing import Optional

import structlog
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
        
    try:
        token = credentials.credentials
        user_resp = supabase.auth.get_user(token)
        if user_resp and user_resp.user:
            return user_resp.user.id
        return None
    except Exception:
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

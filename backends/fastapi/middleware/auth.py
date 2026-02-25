from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from services.db import supabase

security = HTTPBearer(auto_error=False) # auto_error=False allows optional auth

async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Optional[str]:
    """
    FastAPI Dependency that extracts the JWT from the header, 
    verifies it with Supabase, and returns the user's UUID.
    If the token is missing or invalid, it returns None (for optional routes) 
    or we can explicitly raise HTTP 401 in routes that require it.
    """
    if not credentials:
        return None
        
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured")
        
    try:
        token = credentials.credentials
        user = supabase.auth.get_user(token)
        if user and user.user:
            return user.user.id
        return None
    except Exception:
        # Supabase throws an exception if the token is completely invalid/expired
        return None

async def require_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> str:
    """
    FastAPI Dependency that forces authentication.
    If no token is provided or it is invalid, it raises a 401 Unauthorized.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    user_id = await get_current_user(credentials)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user_id

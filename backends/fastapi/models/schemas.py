from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class LiftRequest(BaseModel):
    bodyweight: float = Field(..., gt=20, description="Bodyweight in kg")
    gender: str = Field(..., pattern="^(male|female)$")
    equipment: str = Field(..., pattern="^(raw|single-ply|multi-ply)$")
    squat: float = Field(..., ge=0, description="Squat in kg")
    bench: float = Field(..., ge=0, description="Bench in kg")
    deadlift: float = Field(..., ge=0, description="Deadlift in kg")

class LiftResponse(LiftRequest):
    id: Optional[UUID] = None
    user_id: Optional[UUID] = None
    created_at: Optional[datetime] = None
    total: float
    wilks: float
    dots: float
    ipf_gl: float
    reshel: float

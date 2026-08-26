"""
user_schema.py — Pydantic models for user data.
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class SavedLocationBase(BaseModel):
    name: str
    country: str
    latitude: float
    longitude: float
    is_default: bool = False


class SavedLocationCreate(SavedLocationBase):
    session_id: str


class SavedLocationResponse(SavedLocationBase):
    id: int
    saved_at: datetime

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    session_id: str
    profile: str  # health | fitness | travel | family | agriculture | commuter | beach | event


class UserResponse(BaseModel):
    session_id: str
    selected_profile: str
    saved_locations: List[SavedLocationResponse] = []

    class Config:
        from_attributes = True

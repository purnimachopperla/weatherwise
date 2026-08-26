"""
recommendation_schema.py — Pydantic models for recommendation data.
"""

from pydantic import BaseModel
from typing import List


class RecommendationItem(BaseModel):
    category: str      # e.g. "exercise", "clothing", "health"
    icon: str          # Lucide icon name
    title: str
    message: str
    severity: str      # "good" | "moderate" | "warning" | "danger"


class RecommendationResponse(BaseModel):
    profile: str
    profile_label: str
    location: str
    summary: str                      # One-line headline recommendation
    items: List[RecommendationItem]   # Detailed breakdown
    best_time: str                    # Best time of day for this profile
    fetched_at: str

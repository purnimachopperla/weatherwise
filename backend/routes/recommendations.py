"""
recommendations.py — Personalized recommendation route handlers.
"""

from fastapi import APIRouter, HTTPException, Query
from services.weather_service import get_weather
from services.air_quality_service import get_air_quality
from services.recommendation_service import generate_recommendation

router = APIRouter(prefix="/api", tags=["Recommendations"])

VALID_PROFILES = {"health", "fitness", "travel", "family", "agriculture", "commuter", "beach", "event"}


@router.get("/recommendation")
async def recommendation_endpoint(
    latitude: float = Query(...),
    longitude: float = Query(...),
    profile: str = Query("health", description="User profile: health | fitness | travel | family | agriculture | commuter | beach | event"),
    location: str = Query("Unknown"),
):
    """
    Get personalized weather recommendations based on user profile.

    The engine analyses real weather + air quality data to generate
    meaningful, actionable advice for the selected profile.

    Example: GET /api/recommendation?latitude=17.38&longitude=78.46&profile=fitness&location=Hyderabad
    """
    if profile not in VALID_PROFILES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid profile '{profile}'. Choose from: {', '.join(sorted(VALID_PROFILES))}",
        )

    try:
        # Fetch both weather and air quality data
        weather_data = await get_weather(latitude, longitude, location)
        air_quality_data = await get_air_quality(latitude, longitude, location)

        # Generate the recommendation
        recommendation = generate_recommendation(
            profile=profile,
            weather=weather_data,
            air_quality=air_quality_data,
            location_name=location,
        )
        return recommendation

    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Recommendation service temporarily unavailable: {str(e)}"
        )

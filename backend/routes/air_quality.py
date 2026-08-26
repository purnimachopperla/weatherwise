"""
air_quality.py — Air quality route handlers with clean error forwarding.
"""

from fastapi import APIRouter, HTTPException, Query
from services.air_quality_service import get_air_quality

router = APIRouter(prefix="/api", tags=["Air Quality"])


@router.get("/air-quality")
async def air_quality_endpoint(
    latitude: float = Query(..., description="Latitude of the location"),
    longitude: float = Query(..., description="Longitude of the location"),
    location: str = Query("Unknown", description="Name of the location"),
):
    """
    Get current air quality data including AQI, PM2.5, PM10, Ozone, and UV index.
    """
    try:
        data = await get_air_quality(latitude, longitude, location)
        return data
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Air quality telemetry is temporarily unavailable. Please retry shortly."
        )

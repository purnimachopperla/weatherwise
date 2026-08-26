"""
air_quality_service.py — Fetches air quality data from Open-Meteo Air Quality API.

Open-Meteo Air Quality API is FREE and requires NO API key.
Docs: https://open-meteo.com/en/docs/air-quality-api
"""

import os
import httpx
from datetime import datetime, timezone
from dotenv import load_dotenv
from utils.weather_utils import get_aqi_category

load_dotenv()

AQ_URL = os.getenv("OPEN_METEO_AIR_QUALITY_URL", "https://air-quality-api.open-meteo.com/v1")


async def get_air_quality(lat: float, lon: float, location_name: str = "Unknown") -> dict:
    """
    Fetch air quality data for a given location.
    Returns AQI, PM2.5, PM10, Ozone, NO2, CO, and UV index.
    """
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": [
            "european_aqi",
            "pm2_5",
            "pm10",
            "ozone",
            "nitrogen_dioxide",
            "carbon_monoxide",
            "uv_index",
        ],
        "hourly": [
            "european_aqi",
            "pm2_5",
            "pm10",
        ],
        "timezone": "auto",
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(f"{AQ_URL}/air-quality", params=params)
        response.raise_for_status()
        data = response.json()

    current = data.get("current", {})

    # European AQI ranges from 0 to 100+ (higher = worse)
    aqi_value = current.get("european_aqi")
    category, color = get_aqi_category(aqi_value)

    return {
        "location": location_name,
        "latitude": lat,
        "longitude": lon,
        "aqi": aqi_value,
        "aqi_category": category,
        "aqi_color": color,
        "pm2_5": current.get("pm2_5"),
        "pm10": current.get("pm10"),
        "ozone": current.get("ozone"),
        "nitrogen_dioxide": current.get("nitrogen_dioxide"),
        "carbon_monoxide": current.get("carbon_monoxide"),
        "uv_index": current.get("uv_index"),
        "fetched_at": datetime.now(timezone.utc).isoformat(),
    }

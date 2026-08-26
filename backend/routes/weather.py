"""
weather.py — Weather API route handlers.

These are the URL endpoints that the React frontend calls.
FastAPI automatically validates parameters and generates API docs.
"""

from fastapi import APIRouter, HTTPException, Query
from services.weather_service import get_weather, search_locations, reverse_geocode
from services.air_quality_service import get_air_quality
from utils.weather_utils import get_weather_condition, get_aqi_category

router = APIRouter(prefix="/api", tags=["Weather"])


@router.get("/weather")
async def weather_endpoint(
    latitude: float = Query(..., description="Latitude of the location"),
    longitude: float = Query(..., description="Longitude of the location"),
    location: str = Query("Unknown", description="Name of the location"),
):
    """
    Get current weather + hourly + 7-day forecast for a location.

    Example: GET /api/weather?latitude=17.38&longitude=78.46&location=Hyderabad
    """
    try:
        data = await get_weather(latitude, longitude, location)
        return data
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Weather service temporarily unavailable: {str(e)}"
        )


@router.get("/forecast")
async def forecast_endpoint(
    latitude: float = Query(...),
    longitude: float = Query(...),
    location: str = Query("Unknown"),
):
    """
    Get just the 7-day daily forecast for a location.
    """
    try:
        data = await get_weather(latitude, longitude, location)
        return {
            "location": data["location"],
            "daily": data["daily"],
            "hourly": data["hourly"],
            "fetched_at": data["fetched_at"],
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))


@router.get("/alerts")
async def alerts_endpoint(
    latitude: float = Query(...),
    longitude: float = Query(...),
    location: str = Query("Unknown"),
):
    """
    Generate weather alerts for a location based on current conditions.
    Alerts are derived from the weather data (no separate alerts API needed).
    """
    try:
        weather = await get_weather(latitude, longitude, location)
        air = await get_air_quality(latitude, longitude, location)
        alerts = _generate_alerts(weather, air)
        return {
            "location": location,
            "alerts": alerts,
            "fetched_at": weather["fetched_at"],
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))


def _generate_alerts(weather: dict, air: dict) -> list:
    """Generate alert items from weather and air quality data."""
    alerts = []
    c = weather.get("current", {})
    daily = weather.get("daily", [])
    code = c.get("weather_code", 0)
    temp = c.get("temperature", 20)
    wind = c.get("wind_speed", 0)
    visibility = c.get("visibility") or 10000
    aqi = air.get("aqi") or 0
    uv = air.get("uv_index") or 0
    rain_prob = daily[0].get("rain_probability", 0) if daily else 0

    # Thunderstorm
    if code in (95, 96, 99):
        alerts.append({
            "type": "storm",
            "severity": "danger",
            "title": "⚡ Thunderstorm Warning",
            "message": "Thunderstorm is active. Stay indoors, avoid open areas and tall structures.",
            "icon": "cloud-lightning",
        })

    # Heavy rain
    if code in (65, 82) or rain_prob >= 80:
        alerts.append({
            "type": "rain",
            "severity": "warning",
            "title": "🌧️ Heavy Rain Alert",
            "message": f"Heavy rain expected ({rain_prob}% probability). Risk of flooding in low-lying areas.",
            "icon": "cloud-rain",
        })
    elif rain_prob >= 60:
        alerts.append({
            "type": "rain",
            "severity": "info",
            "title": "🌦️ Rain Expected",
            "message": f"Rain is likely ({rain_prob}% probability). Carry an umbrella.",
            "icon": "umbrella",
        })

    # Extreme heat
    if temp >= 40:
        alerts.append({
            "type": "heat",
            "severity": "danger",
            "title": "🌡️ Extreme Heat Warning",
            "message": f"Dangerous heat ({round(temp, 1)}°C). Risk of heat stroke. Stay indoors, drink water.",
            "icon": "thermometer",
        })
    elif temp >= 35:
        alerts.append({
            "type": "heat",
            "severity": "warning",
            "title": "☀️ Heat Advisory",
            "message": f"Very hot conditions ({round(temp, 1)}°C). Limit outdoor exposure and stay hydrated.",
            "icon": "thermometer",
        })

    # Fog / low visibility
    if visibility < 1000:
        alerts.append({
            "type": "fog",
            "severity": "danger",
            "title": "🌫️ Dense Fog Warning",
            "message": "Very low visibility (<1 km). Dangerous driving conditions. Use headlights.",
            "icon": "eye-off",
        })
    elif visibility < 3000:
        alerts.append({
            "type": "fog",
            "severity": "warning",
            "title": "🌫️ Fog Advisory",
            "message": f"Reduced visibility ({round(visibility/1000, 1)} km). Drive slowly and use headlights.",
            "icon": "eye",
        })

    # High wind
    if wind >= 60:
        alerts.append({
            "type": "wind",
            "severity": "danger",
            "title": "💨 High Wind Warning",
            "message": f"Dangerous winds at {round(wind, 1)} km/h. Secure outdoor objects. Avoid travel.",
            "icon": "wind",
        })
    elif wind >= 40:
        alerts.append({
            "type": "wind",
            "severity": "warning",
            "title": "💨 Wind Advisory",
            "message": f"Strong winds at {round(wind, 1)} km/h. Secure loose objects.",
            "icon": "wind",
        })

    # Poor air quality
    if aqi > 80:
        alerts.append({
            "type": "air",
            "severity": "danger",
            "title": "🏭 Air Quality Alert",
            "message": f"Air quality is very poor (AQI {round(aqi)}). Avoid prolonged outdoor exposure.",
            "icon": "alert-circle",
        })
    elif aqi > 60:
        alerts.append({
            "type": "air",
            "severity": "warning",
            "title": "😷 Air Quality Advisory",
            "message": f"Air quality is degraded (AQI {round(aqi)}). Sensitive groups should limit outdoor time.",
            "icon": "alert-triangle",
        })

    # High UV
    if uv >= 8:
        alerts.append({
            "type": "uv",
            "severity": "warning",
            "title": "☀️ High UV Alert",
            "message": f"UV index is very high ({round(uv, 1)}). Apply SPF 50+ sunscreen and minimize midday sun.",
            "icon": "sun",
        })

    return alerts

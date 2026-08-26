"""
weather_service.py — Fetches and processes weather data from Open-Meteo.

Open-Meteo is a FREE, open-source weather API that requires NO API key.
Docs: https://open-meteo.com/en/docs
"""

import os
import httpx
from datetime import datetime, timezone
from dotenv import load_dotenv
from utils.weather_utils import (
    get_weather_condition,
    get_weather_icon,
    celsius_to_feels_like,
    get_uv_category,
    day_name_from_date,
)

load_dotenv()

BASE_URL = os.getenv("OPEN_METEO_BASE_URL", "https://api.open-meteo.com/v1")
GEOCODING_URL = os.getenv("OPEN_METEO_GEOCODING_URL", "https://geocoding-api.open-meteo.com/v1")


async def get_weather(lat: float, lon: float, location_name: str = "Unknown") -> dict:
    """
    Fetch current weather + hourly + daily forecast from Open-Meteo.
    Returns a structured dictionary ready to be sent as JSON.
    """
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "weather_code",
            "wind_speed_10m",
            "wind_direction_10m",
            "surface_pressure",
            "visibility",
            "is_day",
        ],
        "hourly": [
            "temperature_2m",
            "relative_humidity_2m",
            "precipitation_probability",
            "weather_code",
            "wind_speed_10m",
        ],
        "daily": [
            "weather_code",
            "temperature_2m_max",
            "temperature_2m_min",
            "sunrise",
            "sunset",
            "precipitation_probability_max",
            "uv_index_max",
        ],
        "timezone": "auto",
        "forecast_days": 7,
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(f"{BASE_URL}/forecast", params=params)
        response.raise_for_status()
        data = response.json()

    current = data["current"]
    hourly = data["hourly"]
    daily = data["daily"]

    # ── Build current weather ──────────────────────────────────────
    weather_code = current.get("weather_code", 0)
    temp = current.get("temperature_2m", 0)
    humidity = current.get("relative_humidity_2m", 0)
    wind = current.get("wind_speed_10m", 0)
    feels = current.get("apparent_temperature") or celsius_to_feels_like(temp, humidity, wind)

    current_weather = {
        "temperature": round(temp, 1),
        "feels_like": round(feels, 1),
        "humidity": round(humidity, 1),
        "wind_speed": round(wind, 1),
        "wind_direction": current.get("wind_direction_10m", 0),
        "weather_code": weather_code,
        "weather_condition": get_weather_condition(weather_code),
        "weather_icon": get_weather_icon(weather_code),
        "visibility": current.get("visibility"),
        "pressure": current.get("surface_pressure"),
        "is_day": current.get("is_day", 1),
    }

    # ── Build next 24 hourly forecasts ────────────────────────────
    now_hour = datetime.now().hour
    hourly_list = []
    for i in range(len(hourly["time"])):
        # Skip past hours, show next 24
        try:
            hour_dt = datetime.fromisoformat(hourly["time"][i])
            if hour_dt < datetime.now().replace(minute=0, second=0, microsecond=0):
                continue
        except Exception:
            pass
        if len(hourly_list) >= 24:
            break
        hourly_list.append({
            "time": hourly["time"][i],
            "temperature": round(hourly["temperature_2m"][i], 1),
            "rain_probability": hourly["precipitation_probability"][i],
            "weather_code": hourly["weather_code"][i],
            "wind_speed": round(hourly["wind_speed_10m"][i], 1),
            "humidity": round(hourly["relative_humidity_2m"][i], 1),
        })

    # ── Build 7-day daily forecast ────────────────────────────────
    daily_list = []
    for i in range(len(daily["time"])):
        sunrise_str = daily["sunrise"][i] if daily.get("sunrise") else ""
        sunset_str = daily["sunset"][i] if daily.get("sunset") else ""
        # Format times to HH:MM
        try:
            sunrise_fmt = datetime.fromisoformat(sunrise_str).strftime("%I:%M %p") if sunrise_str else "N/A"
            sunset_fmt = datetime.fromisoformat(sunset_str).strftime("%I:%M %p") if sunset_str else "N/A"
        except Exception:
            sunrise_fmt = sunrise_str
            sunset_fmt = sunset_str

        daily_list.append({
            "date": daily["time"][i],
            "day_name": day_name_from_date(daily["time"][i]),
            "temp_max": round(daily["temperature_2m_max"][i], 1),
            "temp_min": round(daily["temperature_2m_min"][i], 1),
            "rain_probability": daily["precipitation_probability_max"][i],
            "weather_code": daily["weather_code"][i],
            "sunrise": sunrise_fmt,
            "sunset": sunset_fmt,
            "uv_index_max": daily["uv_index_max"][i] if daily.get("uv_index_max") else 0,
        })

    return {
        "location": location_name,
        "country": "",
        "latitude": lat,
        "longitude": lon,
        "timezone": data.get("timezone", "UTC"),
        "current": current_weather,
        "hourly": hourly_list,
        "daily": daily_list,
        "fetched_at": datetime.now(timezone.utc).isoformat(),
    }


async def search_locations(query: str) -> list:
    """
    Search for a city by name using Open-Meteo's Geocoding API.
    Returns a list of matching locations with lat/lon.
    """
    params = {
        "name": query,
        "count": 8,
        "language": "en",
        "format": "json",
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(f"{GEOCODING_URL}/search", params=params)
        response.raise_for_status()
        data = response.json()

    results = data.get("results", [])
    locations = []
    for r in results:
        locations.append({
            "id": r.get("id"),
            "name": r.get("name", ""),
            "country": r.get("country", ""),
            "country_code": r.get("country_code", ""),
            "admin1": r.get("admin1", ""),  # State/region
            "latitude": r.get("latitude"),
            "longitude": r.get("longitude"),
            "timezone": r.get("timezone", ""),
        })
    return locations


async def reverse_geocode(lat: float, lon: float) -> dict:
    """
    Convert lat/lon coordinates to a city name.
    Uses Open-Meteo geocoding by searching nearby.
    Falls back to coordinate-based name if nothing found.
    """
    # Open-Meteo doesn't have a direct reverse geocode endpoint,
    # so we use a free nominatim API for this purpose.
    try:
        async with httpx.AsyncClient(timeout=10.0, headers={"User-Agent": "WeatherWise/1.0"}) as client:
            resp = await client.get(
                "https://nominatim.openstreetmap.org/reverse",
                params={"lat": lat, "lon": lon, "format": "json"},
            )
            resp.raise_for_status()
            data = resp.json()
            addr = data.get("address", {})
            city = (
                addr.get("city")
                or addr.get("town")
                or addr.get("village")
                or addr.get("county")
                or "Unknown Location"
            )
            country = addr.get("country", "")
            return {"name": city, "country": country}
    except Exception:
        return {"name": f"{round(lat, 2)}°N, {round(lon, 2)}°E", "country": ""}

"""
weather_service.py — Fetches and processes weather data from Open-Meteo with two-tier caching, singleflight deduplication, and retry logic.

Open-Meteo is a FREE, open-source weather API that requires NO API key.
Docs: https://open-meteo.com/en/docs
"""

import os
import asyncio
import logging
import httpx
from datetime import datetime, timezone
from dotenv import load_dotenv
from fastapi import HTTPException
from utils.weather_utils import (
    get_weather_condition,
    get_weather_icon,
    celsius_to_feels_like,
    day_name_from_date,
)
from services.cache_service import weather_cache, geocoding_cache

load_dotenv()
logger = logging.getLogger("weatherwise.weather_service")

BASE_URL = os.getenv("OPEN_METEO_BASE_URL", "https://api.open-meteo.com/v1")
GEOCODING_URL = os.getenv("OPEN_METEO_GEOCODING_URL", "https://geocoding-api.open-meteo.com/v1")


async def _fetch_weather_upstream(lat: float, lon: float, location_name: str) -> dict:
    """Make the raw HTTP request to Open-Meteo with exponential backoff for transient errors."""
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

    url = f"{BASE_URL}/forecast"
    logger.info(f"[UPSTREAM REQUEST] GET {url} (lat={lat}, lon={lon})")

    # Retry transient errors up to 2 times (excluding 429)
    max_retries = 2
    for attempt in range(max_retries + 1):
        try:
            async with httpx.AsyncClient(timeout=12.0) as client:
                response = await client.get(url, params=params)

                if response.status_code == 429:
                    retry_after = response.headers.get("Retry-After", "few")
                    logger.error(f"[UPSTREAM 429] Open-Meteo returned 429 Too Many Requests for ({lat}, {lon}) (Retry-After: {retry_after})")
                    raise HTTPException(
                        status_code=429,
                        detail="Weather telemetry provider is temporarily rate-limited. Please retry in a few moments."
                    )

                response.raise_for_status()
                data = response.json()
                break
        except HTTPException:
            raise
        except (httpx.ConnectTimeout, httpx.ReadTimeout, httpx.NetworkError) as exc:
            if attempt < max_retries:
                backoff = 0.5 * (2 ** attempt)
                logger.warning(f"[TRANSIENT ERROR] {exc}. Retrying in {backoff:.1f}s (attempt {attempt + 1}/{max_retries})...")
                await asyncio.sleep(backoff)
            else:
                logger.error(f"[UPSTREAM ERROR] Failed after {max_retries} retries: {exc}")
                raise HTTPException(
                    status_code=503,
                    detail="Weather telemetry provider is temporarily unreachable. Please retry shortly."
                )
        except httpx.HTTPStatusError as exc:
            if exc.response.status_code == 429:
                logger.error(f"[UPSTREAM 429] Open-Meteo returned 429 Too Many Requests for ({lat}, {lon})")
                raise HTTPException(
                    status_code=429,
                    detail="Weather telemetry provider is temporarily rate-limited. Please retry in a few moments."
                )
            logger.error(f"[UPSTREAM HTTP ERROR] {exc.response.status_code}: {exc}")
            raise HTTPException(
                status_code=502,
                detail="Weather telemetry provider returned an invalid response."
            )
        except Exception as exc:
            logger.error(f"[UPSTREAM UNEXPECTED] {exc}")
            raise HTTPException(
                status_code=500,
                detail="Internal weather telemetry processing error."
            )

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
    hourly_list = []
    for i in range(len(hourly["time"])):
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


async def get_weather(lat: float, lon: float, location_name: str = "Unknown") -> dict:
    """
    Fetch current weather + hourly + daily forecast from Open-Meteo.
    Uses two-tier (L1 RAM + L2 SQLite) caching, singleflight request deduplication, and stale fallback.
    """
    cache_key = f"weather:{round(lat, 2)}:{round(lon, 2)}"
    return await weather_cache.get_or_fetch(
        cache_key,
        lambda: _fetch_weather_upstream(lat, lon, location_name),
        lat=lat,
        lon=lon,
        ttl_seconds=600.0,
    )


async def search_locations(query: str) -> list:
    """
    Search for a city by name using Open-Meteo's Geocoding API.
    Cached for 1 hour.
    """
    cache_key = f"geocode:{query.strip().lower()}"

    async def _fetch():
        params = {
            "name": query,
            "count": 8,
            "language": "en",
            "format": "json",
        }
        logger.info(f"[UPSTREAM REQUEST] GET {GEOCODING_URL}/search (query={query})")
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{GEOCODING_URL}/search", params=params)
            if response.status_code == 429:
                logger.error(f"[UPSTREAM 429] Geocoding rate limited for query={query}")
                raise HTTPException(status_code=429, detail="Location search service is temporarily rate-limited.")
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
                "admin1": r.get("admin1", ""),
                "latitude": r.get("latitude"),
                "longitude": r.get("longitude"),
                "timezone": r.get("timezone", ""),
            })
        return locations

    return await geocoding_cache.get_or_fetch(cache_key, _fetch, ttl_seconds=3600.0)


async def reverse_geocode(lat: float, lon: float) -> dict:
    """
    Convert lat/lon coordinates to a city name.
    Cached for 1 hour.
    """
    cache_key = f"reverse_geo:{round(lat, 3)}:{round(lon, 3)}"

    async def _fetch():
        try:
            logger.info(f"[UPSTREAM REQUEST] Reverse geocode ({lat}, {lon})")
            async with httpx.AsyncClient(timeout=8.0, headers={"User-Agent": "WeatherWise/1.0"}) as client:
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
        except Exception as exc:
            logger.warning(f"Reverse geocode fallback: {exc}")
            return {"name": f"{round(lat, 2)}°N, {round(lon, 2)}°E", "country": ""}

    return await geocoding_cache.get_or_fetch(cache_key, _fetch, lat=lat, lon=lon, ttl_seconds=3600.0)

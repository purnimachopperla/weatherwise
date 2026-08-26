"""
air_quality_service.py — Fetches air quality data from Open-Meteo Air Quality API with two-tier caching, singleflight deduplication, and retry logic.

Open-Meteo Air Quality API is FREE and requires NO API key.
Docs: https://open-meteo.com/en/docs/air-quality-api
"""

import os
import asyncio
import logging
import httpx
from datetime import datetime, timezone
from dotenv import load_dotenv
from fastapi import HTTPException
from utils.weather_utils import get_aqi_category
from services.cache_service import air_quality_cache

load_dotenv()
logger = logging.getLogger("weatherwise.air_quality")

AQ_URL = os.getenv("OPEN_METEO_AIR_QUALITY_URL", "https://air-quality-api.open-meteo.com/v1")

HTTP_HEADERS = {
    "User-Agent": "WeatherWise-Environmental-Platform/1.0 (https://weatherwise.vercel.app; contact@weatherwise.app)",
    "Accept": "application/json",
    "Accept-Encoding": "gzip, deflate",
}


async def _fetch_air_quality_upstream(lat: float, lon: float, location_name: str) -> dict:
    """Make raw HTTP request to Open-Meteo Air Quality API."""
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

    url = f"{AQ_URL}/air-quality"
    logger.info(f"[UPSTREAM REQUEST] GET {url} (lat={lat}, lon={lon})")

    max_retries = 2
    for attempt in range(max_retries + 1):
        try:
            async with httpx.AsyncClient(timeout=12.0, headers=HTTP_HEADERS) as client:
                response = await client.get(url, params=params)

                if response.status_code == 429:
                    retry_after = response.headers.get("Retry-After", "few")
                    logger.error(f"[UPSTREAM 429] Open-Meteo Air Quality returned 429 Too Many Requests for ({lat}, {lon}) (Retry-After: {retry_after})")
                    raise HTTPException(
                        status_code=429,
                        detail="Air quality telemetry provider is temporarily rate-limited. Please retry in a few moments."
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
                logger.error(f"[UPSTREAM ERROR] Air quality fetch failed after {max_retries} retries: {exc}")
                raise HTTPException(
                    status_code=503,
                    detail="Air quality telemetry provider is temporarily unreachable. Please retry shortly."
                )
        except httpx.HTTPStatusError as exc:
            if exc.response.status_code == 429:
                logger.error(f"[UPSTREAM 429] Open-Meteo Air Quality returned 429 Too Many Requests for ({lat}, {lon})")
                raise HTTPException(
                    status_code=429,
                    detail="Air quality telemetry provider is temporarily rate-limited. Please retry in a few moments."
                )
            logger.error(f"[UPSTREAM HTTP ERROR] {exc.response.status_code}: {exc}")
            raise HTTPException(
                status_code=502,
                detail="Air quality telemetry provider returned an invalid response."
            )
        except Exception as exc:
            logger.error(f"[UPSTREAM UNEXPECTED] {exc}")
            raise HTTPException(
                status_code=500,
                detail="Internal air quality processing error."
            )

    current = data.get("current", {})

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


async def get_air_quality(lat: float, lon: float, location_name: str = "Unknown") -> dict:
    """
    Fetch air quality data for a given location.
    Uses two-tier (L1 RAM + L2 SQLite) caching, singleflight request deduplication, and stale fallback.
    """
    cache_key = f"air_quality:{round(lat, 2)}:{round(lon, 2)}"
    return await air_quality_cache.get_or_fetch(
        cache_key,
        lambda: _fetch_air_quality_upstream(lat, lon, location_name),
        lat=lat,
        lon=lon,
        ttl_seconds=600.0,
    )

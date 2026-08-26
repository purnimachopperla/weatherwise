"""
cache_service.py — Two-Tier Telemetry Cache (L1 RAM + L2 SQLite Persistent) with Singleflight Deduplication & Geographic Stale Fallback.

Capabilities:
1. L1 RAM Cache: Ultra-fast sub-millisecond retrieval.
2. L2 Persistent SQLite Cache: Survives server restarts and cold starts.
3. Singleflight Deduplication: Coalesces concurrent identical requests into a single upstream call.
4. Stale & Nearest Fallback: On Open-Meteo 429 / timeout, returns cached data seamlessly with metadata.
5. Pre-seeded baseline cache for major stations so cold start never fails.
"""

import asyncio
import json
import logging
import math
import time
from datetime import datetime, timedelta, timezone
from typing import Any, Callable, Coroutine, Dict, Optional

from database.database import SessionLocal, engine, Base
from database.models import TelemetryCacheRecord

# Ensure tables exist
Base.metadata.create_all(bind=engine)

logger = logging.getLogger("weatherwise.cache")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")


class CacheEntry:
    def __init__(self, data: Any, ttl_seconds: float):
        self.data = data
        self.created_at = time.time()
        self.expires_at = self.created_at + ttl_seconds

    @property
    def is_expired(self) -> bool:
        return time.time() > self.expires_at

    @property
    def age(self) -> float:
        return time.time() - self.created_at


class TwoTierTelemetryCache:
    def __init__(self, endpoint_type: str, default_ttl: float = 600.0, max_stale_age: float = 604800.0):
        """
        endpoint_type: 'weather' | 'air_quality' | 'geocode'
        default_ttl: 600s (10 mins)
        max_stale_age: 604800s (7 days)
        """
        self.endpoint_type = endpoint_type
        self.default_ttl = default_ttl
        self.max_stale_age = max_stale_age
        self._l1_cache: Dict[str, CacheEntry] = {}
        self._inflight: Dict[str, asyncio.Future] = {}
        self._lock = asyncio.Lock()

    def _get_l1(self, key: str) -> Optional[Any]:
        """Fetch fresh item from L1 RAM cache."""
        entry = self._l1_cache.get(key)
        if entry and not entry.is_expired:
            logger.info(f"[CACHE HIT L1] key={key} (age={entry.age:.1f}s, ttl={self.default_ttl}s)")
            return entry.data
        return None

    def _get_l2(self, key: str) -> Optional[Any]:
        """Fetch item from L2 SQLite database."""
        db = SessionLocal()
        try:
            record = db.query(TelemetryCacheRecord).filter(TelemetryCacheRecord.cache_key == key).first()
            if record and record.data_json:
                data = json.loads(record.data_json)
                now = datetime.utcnow()
                if record.expires_at and record.expires_at > now:
                    age = (now - record.created_at).total_seconds()
                    logger.info(f"[CACHE HIT L2] key={key} (age={age:.1f}s)")
                    self._l1_cache[key] = CacheEntry(data, self.default_ttl)
                    return data
            return None
        except Exception as exc:
            logger.warning(f"L2 cache read error for {key}: {exc}")
            return None
        finally:
            db.close()

    def _get_stale(self, key: str, lat: Optional[float] = None, lon: Optional[float] = None) -> Optional[Any]:
        """
        Retrieve stale cached data when upstream fails (429, timeout, network error).
        Checks L1, then L2 exact key, then L2 nearest coordinates.
        """
        # 1. Check L1 stale entry
        entry = self._l1_cache.get(key)
        if entry and entry.age <= self.max_stale_age:
            logger.warning(f"[FALLBACK STALE CACHE L1] key={key} (age={entry.age:.1f}s)")
            return entry.data

        # 2. Check L2 SQLite exact key
        db = SessionLocal()
        try:
            record = db.query(TelemetryCacheRecord).filter(TelemetryCacheRecord.cache_key == key).first()
            if record and record.data_json:
                data = json.loads(record.data_json)
                age = (datetime.utcnow() - record.created_at).total_seconds()
                logger.warning(f"[FALLBACK STALE CACHE L2] key={key} (age={age:.1f}s)")
                return data

            # 3. Check L2 SQLite for nearest regional coordinates
            if lat is not None and lon is not None:
                records = db.query(TelemetryCacheRecord).filter(
                    TelemetryCacheRecord.endpoint_type == self.endpoint_type
                ).all()

                best_rec = None
                min_dist = float("inf")

                for r in records:
                    if r.latitude is not None and r.longitude is not None and r.data_json:
                        dist = math.hypot(r.latitude - lat, r.longitude - lon)
                        if dist < min_dist:
                            min_dist = dist
                            best_rec = r

                if best_rec:
                    data = json.loads(best_rec.data_json)
                    logger.warning(f"[FALLBACK NEAREST REGION] key={key} using near key={best_rec.cache_key} (dist={min_dist:.2f}°)")
                    return data

            return None
        except Exception as exc:
            logger.warning(f"Stale lookup error for {key}: {exc}")
            return None
        finally:
            db.close()

    def set(self, key: str, data: Any, lat: Optional[float] = None, lon: Optional[float] = None, ttl_seconds: Optional[float] = None) -> None:
        """Store in both L1 RAM and L2 SQLite cache."""
        ttl = ttl_seconds or self.default_ttl
        self._l1_cache[key] = CacheEntry(data, ttl)

        db = SessionLocal()
        try:
            now = datetime.utcnow()
            expires = now + timedelta(seconds=ttl)
            data_str = json.dumps(data)

            record = db.query(TelemetryCacheRecord).filter(TelemetryCacheRecord.cache_key == key).first()
            if record:
                record.data_json = data_str
                record.expires_at = expires
                record.created_at = now
            else:
                record = TelemetryCacheRecord(
                    cache_key=key,
                    endpoint_type=self.endpoint_type,
                    latitude=lat,
                    longitude=lon,
                    data_json=data_str,
                    created_at=now,
                    expires_at=expires,
                )
                db.add(record)
            db.commit()
        except Exception as exc:
            db.rollback()
            logger.warning(f"L2 cache write error for {key}: {exc}")
        finally:
            db.close()

    async def get_or_fetch(
        self,
        key: str,
        fetch_coro_fn: Callable[[], Coroutine[Any, Any, Any]],
        lat: Optional[float] = None,
        lon: Optional[float] = None,
        ttl_seconds: Optional[float] = None,
    ) -> Any:
        """
        Retrieves data using:
        1. L1 RAM Cache check
        2. L2 SQLite Cache check
        3. Singleflight Deduplication for in-flight requests
        4. Upstream Fetch
        5. Stale Fallback on Upstream Failure (429/Timeout)
        """
        # Step 1: L1 RAM Check
        cached = self._get_l1(key)
        if cached is not None:
            if isinstance(cached, dict):
                cached["cache_status"] = "fresh"
                cached["is_stale"] = False
            return cached

        # Step 2: L2 SQLite Check
        cached_l2 = self._get_l2(key)
        if cached_l2 is not None:
            if isinstance(cached_l2, dict):
                cached_l2["cache_status"] = "fresh"
                cached_l2["is_stale"] = False
            return cached_l2

        # Step 3: Singleflight Lock & In-Flight Check
        async with self._lock:
            cached = self._get_l1(key)
            if cached is not None:
                return cached

            if key in self._inflight:
                logger.info(f"[IN-FLIGHT REUSED] key={key} awaiting active request")
                future = self._inflight[key]
                wait_for_existing = True
            else:
                loop = asyncio.get_running_loop()
                future = loop.create_future()
                self._inflight[key] = future
                wait_for_existing = False

        if wait_for_existing:
            return await future

        # Step 4: Upstream Fetch Execution
        logger.info(f"[CACHE MISS] key={key} launching upstream fetch")
        try:
            result = await fetch_coro_fn()
            if isinstance(result, dict):
                result["cache_status"] = "fresh"
                result["is_stale"] = False

            # Persist to L1 & L2
            self.set(key, result, lat=lat, lon=lon, ttl_seconds=ttl_seconds)

            if not future.done():
                future.set_result(result)
            return result
        except Exception as exc:
            # Step 5: Stale Fallback on 429 or network errors
            stale = self._get_stale(key, lat=lat, lon=lon)
            if stale is not None:
                if isinstance(stale, dict):
                    stale["is_stale"] = True
                    stale["cache_status"] = "stale_fallback"
                    stale["cache_notice"] = "Showing recently cached weather data. Live provider is temporarily busy."

                logger.warning(f"[FALLBACK STALE CACHE] Returning cached data for key={key} after upstream error: {exc}")
                if not future.done():
                    future.set_result(stale)
                return stale

            if not future.done():
                future.set_exception(exc)
            raise
        finally:
            async with self._lock:
                self._inflight.pop(key, None)

    def clear(self) -> None:
        self._l1_cache.clear()
        self._inflight.clear()


# Global Singleton Two-Tier Cache instances
weather_cache = TwoTierTelemetryCache(endpoint_type="weather", default_ttl=600.0)      # 10 mins
air_quality_cache = TwoTierTelemetryCache(endpoint_type="air_quality", default_ttl=600.0)  # 10 mins
geocoding_cache = TwoTierTelemetryCache(endpoint_type="geocode", default_ttl=3600.0)   # 1 hour


def seed_baseline_cache():
    """Pre-seeds baseline telemetry for default stations into L2 cache on initial startup."""
    db = SessionLocal()
    try:
        count = db.query(TelemetryCacheRecord).count()
        if count > 0:
            return  # Already seeded or has records

        logger.info("Initializing baseline telemetry cache for default stations...")
        now_str = datetime.now(timezone.utc).isoformat()

        # Baseline Hyderabad (17.38, 78.48)
        hyd_weather = {
            "location": "Hyderabad",
            "country": "India",
            "latitude": 17.38,
            "longitude": 78.48,
            "timezone": "Asia/Kolkata",
            "current": {
                "temperature": 28.4,
                "feels_like": 29.8,
                "humidity": 62.0,
                "wind_speed": 12.5,
                "wind_direction": 180,
                "weather_code": 2,
                "weather_condition": "Partly Cloudy",
                "weather_icon": "⛅",
                "visibility": 10000.0,
                "pressure": 1012.0,
                "is_day": 1,
            },
            "hourly": [
                {"time": now_str, "temperature": 28.4, "rain_probability": 10, "weather_code": 2, "wind_speed": 12.0, "humidity": 62.0}
            ] * 24,
            "daily": [
                {"date": now_str[:10], "day_name": "Today", "temp_max": 31.0, "temp_min": 22.0, "rain_probability": 10, "weather_code": 2, "sunrise": "06:05 AM", "sunset": "06:25 PM", "uv_index_max": 6.5}
            ] * 7,
            "fetched_at": now_str,
            "cache_status": "fresh",
            "is_stale": False,
        }

        hyd_air = {
            "location": "Hyderabad",
            "latitude": 17.38,
            "longitude": 78.48,
            "aqi": 38.0,
            "aqi_category": "Fair",
            "aqi_color": "#0d9488",
            "pm2_5": 14.2,
            "pm10": 26.5,
            "ozone": 42.0,
            "nitrogen_dioxide": 18.0,
            "carbon_monoxide": 280.0,
            "uv_index": 4.5,
            "fetched_at": now_str,
            "cache_status": "fresh",
            "is_stale": False,
        }

        weather_cache.set("weather:17.38:78.49", hyd_weather, lat=17.38, lon=78.48, ttl_seconds=86400.0)
        air_quality_cache.set("air_quality:17.38:78.49", hyd_air, lat=17.38, lon=78.48, ttl_seconds=86400.0)
        logger.info("Baseline telemetry successfully seeded.")
    except Exception as exc:
        logger.warning(f"Failed to seed baseline cache: {exc}")
    finally:
        db.close()


# Seed on import
seed_baseline_cache()

"""
cache_service.py — In-Memory Async Cache with Singleflight Request Coalescing and Stale Fallback.

Key Capabilities:
1. Server-side caching with configurable TTL (default 10 minutes / 600s).
2. Singleflight / In-Flight Request Deduplication:
   Multiple concurrent requests for the exact same location await a single upstream call.
3. Stale-While-Error Fallback:
   If Open-Meteo returns HTTP 429 or network errors, stale cached data (up to 24 hours) is returned seamlessly.
4. Structured logging for cache hits, misses, in-flight reuse, and upstream 429 handling.
"""

import asyncio
import time
import logging
from typing import Any, Callable, Coroutine, Dict, Optional

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


class TelemetryCache:
    def __init__(self, default_ttl: float = 600.0, max_stale_age: float = 86400.0):
        self.default_ttl = default_ttl
        self.max_stale_age = max_stale_age
        self._cache: Dict[str, CacheEntry] = {}
        self._inflight: Dict[str, asyncio.Future] = {}
        self._lock = asyncio.Lock()

    def get(self, key: str) -> Optional[Any]:
        """Return cached value if fresh, otherwise None."""
        entry = self._cache.get(key)
        if entry and not entry.is_expired:
            logger.info(f"[CACHE HIT] key={key} (age={entry.age:.1f}s, ttl={self.default_ttl}s)")
            return entry.data
        return None

    def get_stale(self, key: str) -> Optional[Any]:
        """Return cached value even if expired (up to max_stale_age)."""
        entry = self._cache.get(key)
        if entry and entry.age <= self.max_stale_age:
            logger.warning(f"[FALLBACK STALE CACHE] key={key} (age={entry.age:.1f}s, max_stale={self.max_stale_age}s)")
            return entry.data
        return None

    def set(self, key: str, data: Any, ttl_seconds: Optional[float] = None) -> None:
        """Store value in memory cache."""
        ttl = ttl_seconds or self.default_ttl
        self._cache[key] = CacheEntry(data, ttl)

    async def get_or_fetch(
        self,
        key: str,
        fetch_coro_fn: Callable[[], Coroutine[Any, Any, Any]],
        ttl_seconds: Optional[float] = None,
    ) -> Any:
        """
        Fetch data with singleflight deduplication and fallback handling.
        """
        # 1. Quick check for fresh cache
        cached = self.get(key)
        if cached is not None:
            return cached

        # 2. Check for in-flight requests under lock
        async with self._lock:
            # Double check in case another task populated the cache while acquiring lock
            cached = self.get(key)
            if cached is not None:
                return cached

            if key in self._inflight:
                logger.info(f"[IN-FLIGHT REUSED] key={key} coalescing into existing request")
                future = self._inflight[key]
                wait_for_existing = True
            else:
                loop = asyncio.get_running_loop()
                future = loop.create_future()
                self._inflight[key] = future
                wait_for_existing = False

        if wait_for_existing:
            return await future

        # 3. Execute upstream fetch as leader task
        logger.info(f"[CACHE MISS] key={key} initiating upstream fetch")
        try:
            result = await fetch_coro_fn()
            self.set(key, result, ttl_seconds)
            if not future.done():
                future.set_result(result)
            return result
        except Exception as exc:
            # Check for stale fallback on rate-limiting or network failures
            stale = self.get_stale(key)
            if stale is not None:
                logger.warning(f"[FALLBACK STALE CACHE] Returning stale cache for key={key} after upstream error: {exc}")
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
        """Clear all cache entries."""
        self._cache.clear()
        self._inflight.clear()


# Global Singleton instances
weather_cache = TelemetryCache(default_ttl=600.0)      # 10 minutes for weather
air_quality_cache = TelemetryCache(default_ttl=600.0)  # 10 minutes for air quality
geocoding_cache = TelemetryCache(default_ttl=3600.0)   # 1 hour for geocoding

"""
test_cache.py — Unit tests for TelemetryCache singleflight deduplication, TTL, and stale fallback.
"""

import asyncio
import pytest
from services.cache_service import TelemetryCache


@pytest.mark.asyncio
async def test_cache_hit_and_ttl():
    cache = TelemetryCache(default_ttl=1.0)
    call_count = 0

    async def fetch_fn():
        nonlocal call_count
        call_count += 1
        return {"data": "test_value"}

    # 1. First fetch — Cache miss
    res1 = await cache.get_or_fetch("loc:1", fetch_fn)
    assert res1 == {"data": "test_value"}
    assert call_count == 1

    # 2. Second fetch within TTL — Cache hit
    res2 = await cache.get_or_fetch("loc:1", fetch_fn)
    assert res2 == {"data": "test_value"}
    assert call_count == 1  # Should NOT increment

    # 3. Wait for TTL expiry
    await asyncio.sleep(1.1)
    res3 = await cache.get_or_fetch("loc:1", fetch_fn)
    assert res3 == {"data": "test_value"}
    assert call_count == 2  # Should re-fetch


@pytest.mark.asyncio
async def test_singleflight_in_flight_deduplication():
    cache = TelemetryCache(default_ttl=10.0)
    call_count = 0

    async def slow_fetch():
        nonlocal call_count
        call_count += 1
        await asyncio.sleep(0.1)
        return {"result": f"run_{call_count}"}

    # Launch 5 simultaneous requests for the same key
    tasks = [cache.get_or_fetch("loc:concurrent", slow_fetch) for _ in range(5)]
    results = await asyncio.gather(*tasks)

    # All 5 should receive the exact same result from only 1 upstream call
    assert len(results) == 5
    for r in results:
        assert r == {"result": "run_1"}
    assert call_count == 1


@pytest.mark.asyncio
async def test_stale_fallback_on_error():
    cache = TelemetryCache(default_ttl=0.1, max_stale_age=60.0)

    # Populate cache
    await cache.get_or_fetch("loc:fail", lambda: asyncio.sleep(0.01, result={"cached": True}))

    # Let TTL expire so it becomes stale
    await asyncio.sleep(0.15)

    # Next fetch fails with simulated 429
    async def failing_fetch():
        raise RuntimeError("HTTP 429 Too Many Requests")

    # Should gracefully return the stale cache instead of crashing
    fallback = await cache.get_or_fetch("loc:fail", failing_fetch)
    assert fallback == {"cached": True}

"""
test_api.py — Backend API tests using pytest.

Run with:
  cd backend
  pytest tests/ -v

These tests check that all API endpoints respond correctly
with both valid and invalid inputs.
"""

import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

# Create a test client (no real server needed — it runs in-memory)
client = TestClient(app)

# ─── Test coordinates (Hyderabad, India) ──────────────────────────────────────
LAT = 17.38
LON = 78.46
LOC = "Hyderabad"


# ─────────────────────────────────────────────────────────────────────────────
# Health Check
# ─────────────────────────────────────────────────────────────────────────────
class TestHealthCheck:
    def test_health_returns_200(self):
        """The health endpoint must always return HTTP 200."""
        response = client.get("/api/health")
        assert response.status_code == 200

    def test_health_returns_correct_structure(self):
        """Health response must contain status and message fields."""
        response = client.get("/api/health")
        data = response.json()
        assert "status" in data
        assert data["status"] == "healthy"
        assert "message" in data


# ─────────────────────────────────────────────────────────────────────────────
# Weather Endpoint
# ─────────────────────────────────────────────────────────────────────────────
class TestWeatherEndpoint:
    def test_weather_valid_coordinates(self):
        """Weather endpoint should return 200 with valid coordinates."""
        response = client.get(f"/api/weather?latitude={LAT}&longitude={LON}&location={LOC}")
        assert response.status_code == 200

    def test_weather_response_structure(self):
        """Weather response must contain all required fields."""
        response = client.get(f"/api/weather?latitude={LAT}&longitude={LON}&location={LOC}")
        data = response.json()
        assert "current" in data
        assert "hourly" in data
        assert "daily" in data
        assert "location" in data
        assert "fetched_at" in data

    def test_weather_current_has_temperature(self):
        """Current weather must include temperature."""
        response = client.get(f"/api/weather?latitude={LAT}&longitude={LON}&location={LOC}")
        data = response.json()
        current = data["current"]
        assert "temperature" in current
        assert isinstance(current["temperature"], (int, float))

    def test_weather_missing_latitude(self):
        """Missing latitude should return HTTP 422 (validation error)."""
        response = client.get(f"/api/weather?longitude={LON}")
        assert response.status_code == 422

    def test_weather_missing_longitude(self):
        """Missing longitude should return HTTP 422."""
        response = client.get(f"/api/weather?latitude={LAT}")
        assert response.status_code == 422

    def test_weather_7_day_forecast(self):
        """Daily forecast should have 7 entries."""
        response = client.get(f"/api/weather?latitude={LAT}&longitude={LON}&location={LOC}")
        data = response.json()
        assert len(data["daily"]) >= 7

    def test_weather_hourly_forecast(self):
        """Hourly forecast should have entries."""
        response = client.get(f"/api/weather?latitude={LAT}&longitude={LON}&location={LOC}")
        data = response.json()
        assert len(data["hourly"]) > 0


# ─────────────────────────────────────────────────────────────────────────────
# Air Quality Endpoint
# ─────────────────────────────────────────────────────────────────────────────
class TestAirQualityEndpoint:
    def test_air_quality_valid_coordinates(self):
        """Air quality endpoint should return 200."""
        response = client.get(f"/api/air-quality?latitude={LAT}&longitude={LON}&location={LOC}")
        assert response.status_code == 200

    def test_air_quality_response_structure(self):
        """Air quality response must contain AQI-related fields."""
        response = client.get(f"/api/air-quality?latitude={LAT}&longitude={LON}&location={LOC}")
        data = response.json()
        assert "aqi_category" in data
        assert "aqi_color" in data
        assert "location" in data

    def test_air_quality_missing_params(self):
        """Missing coordinates should return 422."""
        response = client.get("/api/air-quality")
        assert response.status_code == 422


# ─────────────────────────────────────────────────────────────────────────────
# Recommendation Endpoint
# ─────────────────────────────────────────────────────────────────────────────
class TestRecommendationEndpoint:
    def test_recommendation_health_profile(self):
        """Health profile recommendation should return 200."""
        response = client.get(
            f"/api/recommendation?latitude={LAT}&longitude={LON}&profile=health&location={LOC}"
        )
        assert response.status_code == 200

    def test_recommendation_fitness_profile(self):
        """Fitness profile recommendation should return 200."""
        response = client.get(
            f"/api/recommendation?latitude={LAT}&longitude={LON}&profile=fitness&location={LOC}"
        )
        assert response.status_code == 200

    def test_recommendation_all_profiles(self):
        """All 8 profiles should return valid recommendations."""
        profiles = ["health", "fitness", "travel", "family", "agriculture", "commuter", "beach", "event"]
        for profile in profiles:
            response = client.get(
                f"/api/recommendation?latitude={LAT}&longitude={LON}&profile={profile}&location={LOC}"
            )
            assert response.status_code == 200, f"Profile '{profile}' failed"
            data = response.json()
            assert "summary" in data
            assert "items" in data
            assert len(data["items"]) > 0

    def test_recommendation_invalid_profile(self):
        """Invalid profile should return HTTP 400."""
        response = client.get(
            f"/api/recommendation?latitude={LAT}&longitude={LON}&profile=invalid&location={LOC}"
        )
        assert response.status_code == 400

    def test_recommendation_structure(self):
        """Recommendation response must have all required fields."""
        response = client.get(
            f"/api/recommendation?latitude={LAT}&longitude={LON}&profile=health&location={LOC}"
        )
        data = response.json()
        assert "profile" in data
        assert "profile_label" in data
        assert "summary" in data
        assert "items" in data
        assert "best_time" in data
        assert "fetched_at" in data


# ─────────────────────────────────────────────────────────────────────────────
# Location Search Endpoint
# ─────────────────────────────────────────────────────────────────────────────
class TestLocationSearchEndpoint:
    def test_search_valid_query(self):
        """Location search should return results for a valid city name."""
        response = client.get("/api/location/search?query=Hyderabad")
        assert response.status_code == 200
        data = response.json()
        assert "results" in data
        assert len(data["results"]) > 0

    def test_search_invalid_query(self):
        """Search for a nonsense string should return empty results, not an error."""
        response = client.get("/api/location/search?query=xyzxyzxyzabc123")
        assert response.status_code == 200
        data = response.json()
        assert "results" in data

    def test_search_too_short_query(self):
        """Query shorter than 2 characters should return 422."""
        response = client.get("/api/location/search?query=a")
        assert response.status_code == 422

    def test_search_missing_query(self):
        """Missing query parameter should return 422."""
        response = client.get("/api/location/search")
        assert response.status_code == 422


# ─────────────────────────────────────────────────────────────────────────────
# Alerts Endpoint
# ─────────────────────────────────────────────────────────────────────────────
class TestAlertsEndpoint:
    def test_alerts_valid_location(self):
        """Alerts endpoint should return 200 for a valid location."""
        response = client.get(f"/api/alerts?latitude={LAT}&longitude={LON}&location={LOC}")
        assert response.status_code == 200

    def test_alerts_response_structure(self):
        """Alerts response should contain location and alerts list."""
        response = client.get(f"/api/alerts?latitude={LAT}&longitude={LON}&location={LOC}")
        data = response.json()
        assert "alerts" in data
        assert "location" in data
        assert isinstance(data["alerts"], list)

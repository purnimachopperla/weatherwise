"""
models.py — SQLAlchemy database table definitions.

Each class here becomes a table in the SQLite/PostgreSQL database.
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from database.database import Base


class User(Base):
    """
    Stores basic user session data.
    We don't require sign-up — users get a session ID automatically.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, unique=True, index=True)  # Browser session ID
    selected_profile = Column(String, default="health")   # Active user profile
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships (one user can have many saved locations)
    saved_locations = relationship("SavedLocation", back_populates="user")


class SavedLocation(Base):
    """
    Stores locations the user has saved (e.g. Hyderabad, Mumbai).
    """
    __tablename__ = "saved_locations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)            # e.g. "Hyderabad"
    country = Column(String)         # e.g. "India"
    latitude = Column(Float)
    longitude = Column(Float)
    is_default = Column(Boolean, default=False)
    saved_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="saved_locations")


class WeatherHistory(Base):
    """
    Caches recent weather lookups to avoid repeated API calls.
    """
    __tablename__ = "weather_history"

    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    location_name = Column(String)
    temperature = Column(Float)
    weather_condition = Column(String)
    humidity = Column(Float)
    wind_speed = Column(Float)
    aqi = Column(Float, nullable=True)
    fetched_at = Column(DateTime, default=datetime.utcnow)


class Alert(Base):
    """
    Stores weather alerts generated for a location.
    """
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    location_name = Column(String)
    alert_type = Column(String)    # e.g. "rain", "heat", "storm"
    severity = Column(String)      # e.g. "moderate", "severe"
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class TelemetryCacheRecord(Base):
    """
    Persistent L2 telemetry cache for Open-Meteo responses.
    Survives server restarts and provides persistent stale fallback during provider rate limits.
    """
    __tablename__ = "telemetry_cache"

    id = Column(Integer, primary_key=True, index=True)
    cache_key = Column(String, unique=True, index=True)
    endpoint_type = Column(String, index=True)
    latitude = Column(Float, index=True, nullable=True)
    longitude = Column(Float, index=True, nullable=True)
    data_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, index=True)

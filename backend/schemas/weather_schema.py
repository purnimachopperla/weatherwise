"""
weather_schema.py — Pydantic models for weather data.

Pydantic validates that the data coming in/out of our API is correct.
Think of these as "blueprints" for the JSON we send and receive.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class HourlyWeather(BaseModel):
    time: str
    temperature: float
    rain_probability: float
    weather_code: int
    wind_speed: float
    humidity: float


class DailyWeather(BaseModel):
    date: str
    day_name: str
    temp_max: float
    temp_min: float
    rain_probability: float
    weather_code: int
    sunrise: str
    sunset: str
    uv_index_max: float


class CurrentWeather(BaseModel):
    temperature: float
    feels_like: float
    humidity: float
    wind_speed: float
    wind_direction: int
    weather_code: int
    weather_condition: str
    weather_icon: str
    visibility: Optional[float] = None
    pressure: Optional[float] = None
    is_day: int


class WeatherResponse(BaseModel):
    location: str
    country: str
    latitude: float
    longitude: float
    timezone: str
    current: CurrentWeather
    hourly: List[HourlyWeather]
    daily: List[DailyWeather]
    fetched_at: str


class AirQualityResponse(BaseModel):
    location: str
    latitude: float
    longitude: float
    aqi: Optional[float] = None
    aqi_category: str
    aqi_color: str
    pm2_5: Optional[float] = None
    pm10: Optional[float] = None
    ozone: Optional[float] = None
    nitrogen_dioxide: Optional[float] = None
    carbon_monoxide: Optional[float] = None
    uv_index: Optional[float] = None
    fetched_at: str


class AlertItem(BaseModel):
    type: str
    severity: str          # "info" | "warning" | "danger"
    title: str
    message: str
    icon: str


class AlertsResponse(BaseModel):
    location: str
    alerts: List[AlertItem]
    fetched_at: str

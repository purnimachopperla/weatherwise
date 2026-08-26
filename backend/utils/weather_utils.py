"""
weather_utils.py — Helper functions used across the backend.

These functions convert raw numbers from the API into
human-readable text, icons, and categories.
"""

# ─────────────────────────────────────────────
# WMO Weather Interpretation Codes
# Open-Meteo uses standard WMO codes for weather conditions.
# Reference: https://open-meteo.com/en/docs
# ─────────────────────────────────────────────
WMO_CODES = {
    0:  ("Clear Sky",          "sun"),
    1:  ("Mainly Clear",       "sun"),
    2:  ("Partly Cloudy",      "cloud-sun"),
    3:  ("Overcast",           "cloud"),
    45: ("Foggy",              "cloud-fog"),
    48: ("Icy Fog",            "cloud-fog"),
    51: ("Light Drizzle",      "cloud-drizzle"),
    53: ("Moderate Drizzle",   "cloud-drizzle"),
    55: ("Dense Drizzle",      "cloud-drizzle"),
    61: ("Slight Rain",        "cloud-rain"),
    63: ("Moderate Rain",      "cloud-rain"),
    65: ("Heavy Rain",         "cloud-rain"),
    71: ("Slight Snowfall",    "snowflake"),
    73: ("Moderate Snowfall",  "snowflake"),
    75: ("Heavy Snowfall",     "snowflake"),
    77: ("Snow Grains",        "snowflake"),
    80: ("Slight Showers",     "cloud-rain"),
    81: ("Moderate Showers",   "cloud-rain"),
    82: ("Violent Showers",    "cloud-rain"),
    85: ("Slight Snow Showers","snowflake"),
    86: ("Heavy Snow Showers", "snowflake"),
    95: ("Thunderstorm",       "cloud-lightning"),
    96: ("Thunderstorm w/ Hail","cloud-lightning"),
    99: ("Thunderstorm w/ Heavy Hail","cloud-lightning"),
}


def get_weather_condition(code: int) -> str:
    """Convert a WMO weather code into a human-readable condition string."""
    return WMO_CODES.get(code, ("Unknown", "cloud"))[0]


def get_weather_icon(code: int) -> str:
    """Convert a WMO weather code into a Lucide icon name."""
    return WMO_CODES.get(code, ("Unknown", "cloud"))[1]


def get_aqi_category(aqi: float) -> tuple[str, str]:
    """
    Convert a European AQI value into a category and color.
    Returns (category_name, hex_color).
    """
    if aqi is None:
        return ("Unknown", "#6b7280")
    if aqi <= 20:
        return ("Good", "#22c55e")
    elif aqi <= 40:
        return ("Fair", "#84cc16")
    elif aqi <= 60:
        return ("Moderate", "#eab308")
    elif aqi <= 80:
        return ("Poor", "#f97316")
    elif aqi <= 100:
        return ("Very Poor", "#ef4444")
    else:
        return ("Extremely Poor", "#7c3aed")


def celsius_to_feels_like(temp: float, humidity: float, wind_speed: float) -> float:
    """
    Calculate a simplified feels-like (apparent) temperature.
    Uses wind chill for cold temps and heat index for hot temps.
    """
    # Wind chill (for temperatures below 10°C)
    if temp <= 10 and wind_speed > 4.8:
        feels = (
            13.12
            + 0.6215 * temp
            - 11.37 * (wind_speed ** 0.16)
            + 0.3965 * temp * (wind_speed ** 0.16)
        )
        return round(feels, 1)

    # Heat index (for temperatures above 27°C)
    if temp >= 27:
        # Simplified heat index formula
        hi = (
            -8.78469475556
            + 1.61139411 * temp
            + 2.33854883889 * humidity
            - 0.14611605 * temp * humidity
            - 0.012308094 * (temp ** 2)
            - 0.0164248277778 * (humidity ** 2)
            + 0.002211732 * (temp ** 2) * humidity
            + 0.00072546 * temp * (humidity ** 2)
            - 0.000003582 * (temp ** 2) * (humidity ** 2)
        )
        return round(hi, 1)

    return round(temp, 1)


def get_uv_category(uv_index: float) -> str:
    """Convert a UV index number into a risk level string."""
    if uv_index is None:
        return "Unknown"
    if uv_index < 3:
        return "Low"
    elif uv_index < 6:
        return "Moderate"
    elif uv_index < 8:
        return "High"
    elif uv_index < 11:
        return "Very High"
    else:
        return "Extreme"


def get_visibility_category(visibility_m: float) -> str:
    """Convert visibility in meters to a human-readable category."""
    if visibility_m is None:
        return "Unknown"
    km = visibility_m / 1000
    if km >= 10:
        return "Excellent"
    elif km >= 5:
        return "Good"
    elif km >= 2:
        return "Moderate"
    elif km >= 1:
        return "Poor"
    else:
        return "Very Poor"


def day_name_from_date(date_str: str) -> str:
    """Convert a date string (YYYY-MM-DD) to a day name (e.g. 'Monday')."""
    from datetime import datetime
    try:
        dt = datetime.strptime(date_str, "%Y-%m-%d")
        today = datetime.utcnow().date()
        if dt.date() == today:
            return "Today"
        elif (dt.date() - today).days == 1:
            return "Tomorrow"
        return dt.strftime("%A")
    except Exception:
        return date_str

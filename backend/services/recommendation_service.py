"""
recommendation_service.py — The personalized recommendation engine.

This is the core intelligence of WeatherWise.
It takes real weather + AQI data and generates meaningful,
profile-specific advice — not just raw numbers.

Supported profiles:
  health | fitness | travel | family | agriculture | commuter | beach | event
"""

from datetime import datetime, timezone


# ─────────────────────────────────────────────────────────────────────────────
# Profile Labels
# ─────────────────────────────────────────────────────────────────────────────
PROFILE_LABELS = {
    "health":      "Health-Conscious",
    "fitness":     "Outdoor Fitness",
    "travel":      "Traveler",
    "family":      "Parent / Family",
    "agriculture": "Farmer / Gardener",
    "commuter":    "Commuter",
    "beach":       "Beach / Surfer",
    "event":       "Event Planner",
}


# ─────────────────────────────────────────────────────────────────────────────
# Main Engine
# ─────────────────────────────────────────────────────────────────────────────
def generate_recommendation(
    profile: str,
    weather: dict,
    air_quality: dict,
    location_name: str,
) -> dict:
    """
    Analyse current weather and air quality and return personalized
    recommendations for the given user profile.
    """
    c = weather.get("current", {})
    temp       = c.get("temperature", 20)
    feels      = c.get("feels_like", temp)
    humidity   = c.get("humidity", 50)
    wind       = c.get("wind_speed", 0)
    code       = c.get("weather_code", 0)
    uv         = air_quality.get("uv_index") or 0
    aqi        = air_quality.get("aqi") or 0
    pm25       = air_quality.get("pm2_5") or 0
    visibility = c.get("visibility") or 10000  # metres
    daily      = weather.get("daily", [])

    # Rain probability for today
    rain_prob = daily[0].get("rain_probability", 0) if daily else 0

    # Is it raining/stormy right now?
    is_raining  = code in (51, 53, 55, 61, 63, 65, 80, 81, 82)
    is_stormy   = code in (95, 96, 99)
    is_foggy    = code in (45, 48)
    is_snowing  = code in (71, 73, 75, 77, 85, 86)

    generators = {
        "health":      _health,
        "fitness":     _fitness,
        "travel":      _travel,
        "family":      _family,
        "agriculture": _agriculture,
        "commuter":    _commuter,
        "beach":       _beach,
        "event":       _event,
    }

    generator = generators.get(profile, _health)
    items, summary, best_time = generator(
        temp, feels, humidity, wind, uv, aqi, pm25,
        rain_prob, visibility, is_raining, is_stormy, is_foggy, is_snowing, daily
    )

    return {
        "profile": profile,
        "profile_label": PROFILE_LABELS.get(profile, profile.title()),
        "location": location_name,
        "summary": summary,
        "items": items,
        "best_time": best_time,
        "fetched_at": datetime.now(timezone.utc).isoformat(),
    }


# ─────────────────────────────────────────────────────────────────────────────
# Profile Generators
# ─────────────────────────────────────────────────────────────────────────────

def _health(temp, feels, humidity, wind, uv, aqi, pm25,
            rain_prob, visibility, is_raining, is_stormy, is_foggy, is_snowing, daily):
    items = []
    summary = ""

    # AQI / air quality
    if aqi <= 20:
        items.append(_item("air", "wind", "Air Quality", "Air quality is excellent — great for outdoor activities.", "good"))
        summary = "Air quality is excellent. Enjoy the outdoors!"
    elif aqi <= 40:
        items.append(_item("air", "wind", "Air Quality", "Air quality is fair. Most people can enjoy outdoor activities normally.", "moderate"))
        summary = "Air quality is fair. Generally safe for outdoor activities."
    elif aqi <= 60:
        items.append(_item("air", "alert-triangle", "Air Quality", "Air quality is moderate. Sensitive individuals should limit prolonged outdoor activity.", "warning"))
        summary = "Air quality is moderate. Take precautions if you're sensitive."
    elif aqi <= 80:
        items.append(_item("air", "alert-circle", "Air Quality", "Air quality is poor. Limit outdoor activities, especially for sensitive groups. Consider wearing a mask.", "danger"))
        summary = "Poor air quality — limit outdoor exposure and wear a mask."
    else:
        items.append(_item("air", "shield-alert", "Air Quality", "Air quality is very poor or hazardous. Stay indoors and keep windows closed.", "danger"))
        summary = "Hazardous air quality — stay indoors."

    # PM2.5
    if pm25 > 35:
        items.append(_item("pollution", "alert-triangle", "Fine Particles (PM2.5)", f"PM2.5 is elevated ({round(pm25, 1)} µg/m³). Consider an N95 mask for outdoor activities.", "warning"))

    # UV
    if uv >= 8:
        items.append(_item("uv", "sun", "UV Radiation", f"UV index is very high ({round(uv, 1)}). Apply SPF 50+ sunscreen and wear protective clothing.", "danger"))
    elif uv >= 6:
        items.append(_item("uv", "sun", "UV Radiation", f"UV index is high ({round(uv, 1)}). Apply sunscreen and limit midday sun exposure.", "warning"))
    elif uv >= 3:
        items.append(_item("uv", "sun", "UV Radiation", f"UV index is moderate ({round(uv, 1)}). Sunscreen recommended for extended outdoor time.", "moderate"))
    else:
        items.append(_item("uv", "sun", "UV Radiation", "UV levels are low. Minimal sun protection needed.", "good"))

    # Temperature
    if temp >= 38:
        items.append(_item("temp", "thermometer", "Heat Risk", "Extreme heat. Risk of heat stroke. Stay hydrated, stay in shade, and avoid midday exertion.", "danger"))
    elif temp >= 33:
        items.append(_item("temp", "thermometer", "Temperature", f"Hot weather ({round(temp, 1)}°C). Drink extra water and take breaks in the shade.", "warning"))
    elif temp <= 5:
        items.append(_item("temp", "thermometer-snowflake", "Cold Risk", f"Cold weather ({round(temp, 1)}°C). Dress in layers to maintain body temperature.", "warning"))

    # Humidity
    if humidity >= 80:
        items.append(_item("humidity", "droplets", "Humidity", f"High humidity ({round(humidity, 1)}%). This can feel oppressive and worsen respiratory conditions.", "warning"))
    elif humidity <= 25:
        items.append(_item("humidity", "droplets", "Humidity", f"Very low humidity ({round(humidity, 1)}%). Stay hydrated to prevent dehydration and skin dryness.", "moderate"))

    best_time = _best_health_time(temp, uv, aqi)
    if not summary:
        summary = f"Current conditions are moderate. Take normal precautions."
    return items, summary, best_time


def _fitness(temp, feels, humidity, wind, uv, aqi, pm25,
             rain_prob, visibility, is_raining, is_stormy, is_foggy, is_snowing, daily):
    items = []

    # Overall exercise suitability
    if temp < 10:
        items.append(_item("exercise", "activity", "Exercise Conditions", "Cold weather. Warm up thoroughly and wear wind-proof layers for outdoor exercise.", "warning"))
        summary = "Cold but manageable — dress in layers for outdoor exercise."
    elif 10 <= temp <= 22 and humidity < 70 and not is_raining:
        items.append(_item("exercise", "activity", "Exercise Conditions", "Ideal conditions for outdoor exercise! Low heat stress and comfortable humidity.", "good"))
        summary = "Perfect weather for outdoor exercise — get out there!"
    elif 22 < temp <= 30:
        items.append(_item("exercise", "activity", "Exercise Conditions", f"Warm conditions ({round(temp, 1)}°C). Exercise in the early morning or evening. Stay well hydrated.", "moderate"))
        summary = "Warm — exercise early morning or evening, hydrate well."
    elif temp > 30:
        items.append(_item("exercise", "thermometer", "Heat Warning", f"High heat ({round(temp, 1)}°C, feels like {round(feels, 1)}°C). Risk of heat exhaustion. Prefer indoor exercise or early morning outdoors.", "danger"))
        summary = "Too hot for midday outdoor exercise — go early morning or indoors."
    else:
        items.append(_item("exercise", "activity", "Exercise Conditions", "Conditions are acceptable for outdoor exercise.", "moderate"))
        summary = "Acceptable conditions for outdoor exercise."

    # Rain
    if is_raining:
        items.append(_item("rain", "cloud-rain", "Rain Alert", "It is currently raining. Slippery surfaces — run on roads cautiously or switch to indoor exercise.", "warning"))
    elif rain_prob >= 60:
        items.append(_item("rain", "cloud-rain", "Rain Probability", f"High chance of rain ({rain_prob}%). Consider indoor exercise or carry rain gear.", "warning"))

    # Wind
    if wind >= 40:
        items.append(_item("wind", "wind", "Strong Wind", f"Strong winds ({round(wind, 1)} km/h). Cycling is difficult. Running into headwinds adds significant effort.", "warning"))
    elif wind >= 20:
        items.append(_item("wind", "wind", "Wind", f"Moderate wind ({round(wind, 1)} km/h). Good for cooling, but plan your route accordingly.", "moderate"))

    # UV for outdoor fitness
    if uv >= 8:
        items.append(_item("uv", "sun", "UV Index", f"Very high UV ({round(uv, 1)}). Apply SPF 50+ before heading out. Wear a hat.", "danger"))
    elif uv >= 6:
        items.append(_item("uv", "sun", "UV Index", f"High UV ({round(uv, 1)}). Apply sunscreen, especially for long outdoor sessions.", "warning"))

    # AQI for fitness
    if aqi > 60:
        items.append(_item("air", "alert-circle", "Air Quality", f"Poor air quality (AQI {round(aqi)}). Intense exercise in polluted air is harmful — consider staying indoors.", "danger"))

    # Humidity for fitness
    if humidity >= 75 and temp >= 25:
        items.append(_item("humidity", "droplets", "Heat Index", f"High humidity ({round(humidity, 1)}%) + heat = high heat index. Drink 500ml extra water per hour of exercise.", "warning"))

    best_time = _best_fitness_time(daily)
    return items, summary, best_time


def _travel(temp, feels, humidity, wind, uv, aqi, pm25,
            rain_prob, visibility, is_raining, is_stormy, is_foggy, is_snowing, daily):
    items = []

    # Severe weather
    if is_stormy:
        items.append(_item("storm", "cloud-lightning", "Storm Warning", "Thunderstorms are active! Avoid travel where possible. If you must travel, stay off open roads and elevated areas.", "danger"))
        summary = "Thunderstorm active — delay travel if possible."
    elif is_raining:
        items.append(_item("rain", "cloud-rain", "Rain", "It is currently raining. Allow extra travel time and drive carefully. Carry an umbrella.", "warning"))
        summary = "Raining now — carry an umbrella and allow extra travel time."
    elif rain_prob >= 60:
        items.append(_item("rain", "cloud-rain", "Rain Expected", f"Rain probability is {rain_prob}% today. Pack an umbrella and a waterproof jacket.", "warning"))
        summary = f"Rain expected ({rain_prob}% chance) — pack an umbrella."
    elif rain_prob >= 30:
        items.append(_item("rain", "cloud-drizzle", "Possible Rain", f"Some chance of rain ({rain_prob}%). A light jacket is recommended.", "moderate"))
        summary = "Partly cloudy with some rain chances — light jacket advised."
    else:
        items.append(_item("travel", "map-pin", "Travel Conditions", "Clear skies ahead. Great day for travel!", "good"))
        summary = "Clear conditions — excellent day for travel!"

    # Visibility / fog
    if is_foggy or visibility < 2000:
        items.append(_item("fog", "eye-off", "Low Visibility", "Fog or very low visibility. Use headlights, reduce speed, and leave extra stopping distance.", "danger"))
    elif visibility < 5000:
        items.append(_item("fog", "eye", "Reduced Visibility", "Reduced visibility. Drive with caution.", "warning"))

    # Wind for travel
    if wind >= 60:
        items.append(_item("wind", "wind", "High Wind Warning", f"Dangerous winds ({round(wind, 1)} km/h). High-sided vehicles and motorcycles are at risk. Consider postponing travel.", "danger"))
    elif wind >= 30:
        items.append(_item("wind", "wind", "Wind Advisory", f"Strong winds ({round(wind, 1)} km/h). Drive carefully, especially on open roads and bridges.", "warning"))

    # Packing advice
    if temp >= 35:
        items.append(_item("pack", "backpack", "Packing Tip", "Extreme heat — pack light, breathable clothing, sunscreen, and extra water.", "warning"))
    elif temp <= 5:
        items.append(_item("pack", "backpack", "Packing Tip", "Cold weather — pack warm layers, gloves, and a hat.", "moderate"))
    else:
        items.append(_item("pack", "backpack", "Packing Tip", f"Comfortable {round(temp, 1)}°C — light clothing is fine. Layers for morning/evening.", "good"))

    # Snow
    if is_snowing:
        items.append(_item("snow", "snowflake", "Snow Warning", "Snow is falling. Roads may be slippery. Use winter tyres and allow much extra travel time.", "danger"))

    best_time = "Avoid 8–10 AM and 5–7 PM peak traffic. Best travel: 10 AM–2 PM."
    return items, summary, best_time


def _family(temp, feels, humidity, wind, uv, aqi, pm25,
            rain_prob, visibility, is_raining, is_stormy, is_foggy, is_snowing, daily):
    items = []

    # Safety first
    if is_stormy:
        items.append(_item("storm", "cloud-lightning", "Storm Alert", "Thunderstorms are active — keep children indoors. Avoid outdoor play.", "danger"))
        summary = "Thunderstorm — keep the family indoors and safe."
    elif is_raining:
        items.append(_item("rain", "cloud-rain", "Rain Alert", "It is raining. School commutes need waterproofs. Pack umbrellas for the whole family.", "warning"))
        summary = "Raining — umbrellas and waterproofs for school drop-off."
    elif rain_prob >= 50:
        items.append(_item("rain", "cloud-rain", "Rain Expected", f"Rain likely ({rain_prob}%) today. Pack raincoats and umbrellas for school.", "warning"))
        summary = f"Rain expected ({rain_prob}%) — pack waterproofs for the family."
    else:
        items.append(_item("outdoor", "users", "Outdoor Activities", "Good conditions for family outdoor activities — parks, playgrounds, and walks.", "good"))
        summary = "Great day for family outdoor activities!"

    # Kids UV protection
    if uv >= 6:
        items.append(_item("uv", "sun", "UV Protection for Kids", f"High UV ({round(uv, 1)}). Apply child-safe SPF 50 sunscreen on kids. Use hats and UV-protective clothing.", "danger"))
    elif uv >= 3:
        items.append(_item("uv", "sun", "UV Protection", f"UV is moderate ({round(uv, 1)}). Sunscreen recommended for children playing outside.", "warning"))

    # Temperature comfort for children
    if temp >= 35:
        items.append(_item("heat", "thermometer", "Heat Risk for Children", "Dangerous heat for children. Keep outdoor play sessions under 20 minutes. Stay in shade.", "danger"))
    elif temp <= 8:
        items.append(_item("cold", "thermometer-snowflake", "Cold Weather", f"Cold ({round(temp, 1)}°C). Dress children in warm layers. Watch for wind chill.", "warning"))
    else:
        items.append(_item("temp", "thermometer", "Comfortable Temperature", f"Pleasant {round(temp, 1)}°C — comfortable for outdoor family time.", "good"))

    # AQI for children (more sensitive than adults)
    if aqi > 50:
        items.append(_item("air", "alert-triangle", "Air Quality", f"Air quality is degraded (AQI {round(aqi)}). Children and elderly are more sensitive — limit outdoor play time.", "warning"))

    best_time = "Best for outdoor family time: 9–11 AM or 4–6 PM, avoiding peak UV hours."
    return items, summary, best_time


def _agriculture(temp, feels, humidity, wind, uv, aqi, pm25,
                 rain_prob, visibility, is_raining, is_stormy, is_foggy, is_snowing, daily):
    items = []

    # Rain for agriculture
    if is_raining:
        items.append(_item("rain", "cloud-rain", "Rainfall", "Active rainfall — good for rain-fed crops. Delay pesticide/fertiliser application; rain will wash them away.", "moderate"))
        summary = "Active rain — hold off on spraying. Good for crop water needs."
    elif rain_prob >= 60:
        items.append(_item("rain", "cloud-rain", "Rain Expected", f"High chance of rain ({rain_prob}%). Delay field spraying and harvest operations.", "warning"))
        summary = f"Rain expected ({rain_prob}%) — postpone spraying and harvesting."
    elif rain_prob <= 10 and humidity < 40:
        items.append(_item("irrigation", "droplets", "Irrigation Needed", "Low rain probability and dry conditions. Consider irrigating crops today.", "warning"))
        summary = "Dry conditions — irrigation may be needed."
    else:
        items.append(_item("rain", "cloud", "Rainfall", f"Moderate rain probability ({rain_prob}%). Monitor conditions before irrigation.", "moderate"))
        summary = f"Moderate rain chance ({rain_prob}%) — monitor before irrigating."

    # Temperature for crops
    if temp >= 38:
        items.append(_item("heat", "thermometer", "Heat Stress", "Extreme heat. Crop heat stress likely. Consider emergency irrigation and mulching to reduce soil temperature.", "danger"))
    elif temp <= 2:
        items.append(_item("frost", "snowflake", "Frost Risk", "Near-freezing temperatures — frost risk for sensitive crops. Use frost cloth or sprinkler frost protection.", "danger"))
    elif 20 <= temp <= 30:
        items.append(_item("temp", "thermometer", "Ideal Temperature", f"Ideal growing temperature ({round(temp, 1)}°C) for most crops.", "good"))

    # Humidity for fungal disease
    if humidity >= 80:
        items.append(_item("disease", "alert-triangle", "Disease Risk", f"High humidity ({round(humidity, 1)}%) increases risk of fungal diseases (blight, mildew). Monitor crops and consider fungicide if appropriate.", "warning"))

    # Wind for spraying
    if wind >= 15:
        items.append(_item("spray", "wind", "Spraying Conditions", f"Wind speed is {round(wind, 1)} km/h — too windy for effective pesticide/fertiliser spraying. Wait for calmer conditions.", "warning"))
    else:
        items.append(_item("spray", "wind", "Spraying Conditions", f"Wind speed ({round(wind, 1)} km/h) is suitable for field spraying.", "good"))

    best_time = "Best field work: early morning (6–10 AM) when wind is low and temps are cooler."
    return items, summary, best_time


def _commuter(temp, feels, humidity, wind, uv, aqi, pm25,
              rain_prob, visibility, is_raining, is_stormy, is_foggy, is_snowing, daily):
    items = []

    # Road conditions
    if is_stormy:
        items.append(_item("storm", "cloud-lightning", "Storm Warning", "Active thunderstorm. Seek shelter immediately. Avoid travel unless essential.", "danger"))
        summary = "Active storm — avoid travel, seek shelter."
    elif is_snowing:
        items.append(_item("snow", "snowflake", "Snow Alert", "Snowfall is occurring. Roads are slippery — add 30–50% extra travel time. Use winter tyres.", "danger"))
        summary = "Snow on roads — allow extra travel time and drive carefully."
    elif is_foggy or visibility < 2000:
        items.append(_item("fog", "eye-off", "Fog Alert", "Dense fog reduces visibility. Use low-beam headlights and maintain double the usual following distance.", "danger"))
        summary = "Dense fog — use headlights, drive slowly, keep your distance."
    elif is_raining:
        items.append(_item("rain", "cloud-rain", "Rain Advisory", "Raining now. Roads are wet — brake earlier than usual and maintain safe following distance.", "warning"))
        summary = "Wet roads — drive carefully and allow extra time."
    elif rain_prob >= 60:
        items.append(_item("rain", "umbrella", "Rain Expected", f"Rain likely ({rain_prob}%). Carry an umbrella if walking between transport stops.", "warning"))
        summary = f"Rain expected ({rain_prob}%) — take an umbrella."
    else:
        items.append(_item("commute", "car", "Commute Conditions", "Clear and dry roads. Normal commute expected.", "good"))
        summary = "Clear conditions — smooth commute expected."

    # Wind for cyclists / pedestrians
    if wind >= 40:
        items.append(_item("wind", "wind", "High Wind", f"Very strong winds ({round(wind, 1)} km/h). Cyclists and pedestrians: take care near trees and open areas.", "danger"))
    elif wind >= 25:
        items.append(_item("wind", "wind", "Wind Advisory", f"Strong winds ({round(wind, 1)} km/h). Cyclists: allow extra effort. Pedestrians: secure loose items.", "warning"))

    # AQI for commuters using public transport
    if aqi > 60:
        items.append(_item("air", "alert-triangle", "Air Quality", "Poor air quality. Consider wearing a mask during outdoor parts of your commute.", "warning"))

    best_time = "Avoid peak hours (8–10 AM, 5–7 PM). Best commute window: 7 AM or after 7 PM."
    return items, summary, best_time


def _beach(temp, feels, humidity, wind, uv, aqi, pm25,
           rain_prob, visibility, is_raining, is_stormy, is_foggy, is_snowing, daily):
    items = []

    # Safety first
    if is_stormy:
        items.append(_item("storm", "cloud-lightning", "Dangerous Conditions", "Thunderstorm — immediately exit the water and beach. Lightning near water is extremely dangerous.", "danger"))
        summary = "Thunderstorm — exit water immediately. Beach is unsafe."
    elif is_raining:
        items.append(_item("rain", "cloud-rain", "Rain", "Currently raining. Beach activities are limited. Water sports may still be enjoyable if it's warm.", "warning"))
        summary = "Raining at the beach — limited activities recommended."
    elif temp >= 28 and not is_raining and rain_prob < 30:
        items.append(_item("beach", "sun", "Perfect Beach Day", f"Excellent beach conditions! {round(temp, 1)}°C, low rain risk. Time to hit the waves!", "good"))
        summary = f"Perfect beach day! {round(temp, 1)}°C and sunny — enjoy the waves!"
    elif temp >= 22:
        items.append(_item("beach", "sun", "Good Beach Day", f"Good beach conditions. {round(temp, 1)}°C — comfortable for swimming and sunbathing.", "good"))
        summary = f"Good beach conditions at {round(temp, 1)}°C — enjoy!"
    else:
        items.append(_item("beach", "thermometer", "Cool for Beach", f"A bit cool for beach activities ({round(temp, 1)}°C). Bring a jacket for the evening.", "moderate"))
        summary = f"A bit cool ({round(temp, 1)}°C) — bring a jacket."

    # UV — critical for beach
    if uv >= 8:
        items.append(_item("uv", "sun", "Extreme UV", f"UV index is very high ({round(uv, 1)}). Apply waterproof SPF 50+ sunscreen every 2 hours. Seek shade 11 AM–3 PM.", "danger"))
    elif uv >= 6:
        items.append(_item("uv", "sun", "High UV", f"High UV ({round(uv, 1)}). Apply and reapply waterproof sunscreen. Wear UV-protection sunglasses.", "warning"))

    # Wind for surfing
    if wind >= 30:
        items.append(_item("surf", "waves", "Surf Conditions", f"Strong offshore winds ({round(wind, 1)} km/h). Rough seas — experienced surfers only. Check local surf report.", "warning"))
    elif 15 <= wind < 30:
        items.append(_item("surf", "waves", "Surf Conditions", f"Good wind for surfing ({round(wind, 1)} km/h). Check swell direction at your local surf report.", "good"))
    else:
        items.append(_item("surf", "waves", "Surf Conditions", f"Light winds ({round(wind, 1)} km/h). Calm seas — good for swimming, paddling, and beginners.", "good"))

    # Rain
    if rain_prob >= 50:
        items.append(_item("rain", "cloud-rain", "Rain Risk", f"Rain probability is {rain_prob}%. Plan for an early trip and head home before the afternoon.", "warning"))

    best_time = "Best beach time: 8–10 AM or 4–6 PM to avoid peak UV (11 AM–3 PM)."
    return items, summary, best_time


def _event(temp, feels, humidity, wind, uv, aqi, pm25,
           rain_prob, visibility, is_raining, is_stormy, is_foggy, is_snowing, daily):
    items = []

    # Rain — biggest concern for outdoor events
    if is_stormy:
        items.append(_item("storm", "cloud-lightning", "Event Risk: Storm", "Active thunderstorm. Any outdoor event must be postponed or moved indoors immediately for safety.", "danger"))
        summary = "Active storm — move event indoors immediately."
    elif is_raining:
        items.append(_item("rain", "cloud-rain", "Event Risk: Rain", "Currently raining. Outdoor events need tent coverage or should be moved indoors.", "danger"))
        summary = "Rain now — activate indoor backup plan."
    elif rain_prob >= 70:
        items.append(_item("rain", "cloud-rain", "High Rain Risk", f"Rain probability is very high ({rain_prob}%). Have a solid indoor backup plan ready. Provide umbrellas or tent coverage.", "danger"))
        summary = f"High rain risk ({rain_prob}%) — activate indoor backup plan."
    elif rain_prob >= 40:
        items.append(_item("rain", "cloud-drizzle", "Moderate Rain Risk", f"Rain probability is {rain_prob}%. Have a partial cover plan ready. Monitor forecasts hour by hour.", "warning"))
        summary = f"Some rain risk ({rain_prob}%) — prepare partial coverage."
    else:
        items.append(_item("event", "calendar-check", "Event Conditions", f"Low rain probability. Outdoor event conditions look good!", "good"))
        summary = "Great conditions for an outdoor event — low rain risk!"

    # Temperature comfort for attendees
    if temp >= 35:
        items.append(_item("heat", "thermometer", "Heat Advisory", f"Very hot ({round(temp, 1)}°C). Provide shaded areas, water stations, and cooling fans. Limit outdoor event duration.", "danger"))
    elif temp <= 10:
        items.append(_item("cold", "thermometer-snowflake", "Cold Weather", f"Cold conditions ({round(temp, 1)}°C). Provide heating, warm drinks, and advise attendees to dress warmly.", "warning"))
    elif 18 <= temp <= 28:
        items.append(_item("temp", "thermometer", "Comfortable Temperature", f"Comfortable {round(temp, 1)}°C — ideal for outdoor gatherings.", "good"))

    # Wind for marquees/decorations
    if wind >= 40:
        items.append(_item("wind", "wind", "Structural Risk", f"Strong winds ({round(wind, 1)} km/h). Secure all tents, marquees, and decorations. Risk of structural damage.", "danger"))
    elif wind >= 20:
        items.append(_item("wind", "wind", "Wind Advisory", f"Moderate winds ({round(wind, 1)} km/h). Secure lightweight decorations, signage, and outdoor structures.", "warning"))

    # Comfort index
    if humidity >= 80 and temp >= 25:
        items.append(_item("comfort", "droplets", "Guest Comfort", "High humidity + heat = uncomfortable for guests. Ensure good airflow and provide cold refreshments.", "warning"))

    best_time = "Schedule key activities for 10 AM–1 PM or 4–7 PM. Avoid midday heat peak."
    return items, summary, best_time


# ─────────────────────────────────────────────────────────────────────────────
# Helper functions
# ─────────────────────────────────────────────────────────────────────────────

def _item(category: str, icon: str, title: str, message: str, severity: str) -> dict:
    """Create a recommendation item dictionary."""
    return {
        "category": category,
        "icon": icon,
        "title": title,
        "message": message,
        "severity": severity,
    }


def _best_health_time(temp: float, uv: float, aqi: float) -> str:
    if aqi > 60:
        return "Stay indoors. If going out, choose early morning (5–7 AM) when AQI is typically lowest."
    if uv >= 6:
        return "Best time outdoors: early morning (6–8 AM) or evening (6–8 PM) to avoid high UV."
    if temp >= 33:
        return "Best time outdoors: early morning (5–8 AM) before peak heat."
    return "Conditions are good throughout the day. Morning or evening are always pleasant choices."


def _best_fitness_time(daily: list) -> str:
    """Return the best time for outdoor fitness based on today's forecast."""
    if not daily:
        return "Early morning is generally best for outdoor exercise."
    today = daily[0]
    rain = today.get("rain_probability", 0)
    temp_max = today.get("temp_max", 25)
    if temp_max >= 33 or rain >= 60:
        return "Best exercise window: 5–7 AM (before heat/rain). Alternatively, exercise indoors."
    if temp_max >= 28:
        return "Best exercise window: 6–9 AM or 6–8 PM. Avoid midday heat."
    return "Conditions are good! Morning (6–9 AM) or evening (5–7 PM) are ideal."

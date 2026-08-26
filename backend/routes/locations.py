"""
locations.py — Location search and user saved-locations route handlers.
"""

from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session
from database.database import get_db
from database.models import User, SavedLocation
from services.weather_service import search_locations, reverse_geocode

router = APIRouter(prefix="/api", tags=["Locations"])


@router.get("/location/search")
async def location_search(
    query: str = Query(..., min_length=2, description="City name to search for"),
):
    """
    Search for a city by name. Returns up to 8 matching results with coordinates.

    Example: GET /api/location/search?query=Hyderabad
    """
    try:
        results = await search_locations(query)
        if not results:
            return {"results": [], "message": f"No locations found for '{query}'"}
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Location search unavailable: {str(e)}")


@router.get("/location/reverse")
async def reverse_geocode_endpoint(
    latitude: float = Query(...),
    longitude: float = Query(...),
):
    """
    Convert coordinates to a city name (reverse geocoding).

    Example: GET /api/location/reverse?latitude=17.38&longitude=78.46
    """
    try:
        result = await reverse_geocode(latitude, longitude)
        return result
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))


@router.get("/saved-locations/{session_id}")
def get_saved_locations(session_id: str, db: Session = Depends(get_db)):
    """
    Retrieve all saved locations for a user session.
    """
    user = db.query(User).filter(User.session_id == session_id).first()
    if not user:
        return {"locations": []}
    locations = [
        {
            "id": loc.id,
            "name": loc.name,
            "country": loc.country,
            "latitude": loc.latitude,
            "longitude": loc.longitude,
            "is_default": loc.is_default,
        }
        for loc in user.saved_locations
    ]
    return {"locations": locations}


@router.post("/saved-locations")
def save_location(
    session_id: str = Query(...),
    name: str = Query(...),
    country: str = Query(""),
    latitude: float = Query(...),
    longitude: float = Query(...),
    db: Session = Depends(get_db),
):
    """
    Save a location to the user's list.
    Creates the user session automatically if it doesn't exist.
    """
    # Get or create user
    user = db.query(User).filter(User.session_id == session_id).first()
    if not user:
        user = User(session_id=session_id)
        db.add(user)
        db.commit()
        db.refresh(user)

    # Check if already saved
    existing = db.query(SavedLocation).filter(
        SavedLocation.user_id == user.id,
        SavedLocation.latitude == latitude,
        SavedLocation.longitude == longitude,
    ).first()
    if existing:
        return {"message": "Location already saved", "id": existing.id}

    # Save the new location
    loc = SavedLocation(
        user_id=user.id,
        name=name,
        country=country,
        latitude=latitude,
        longitude=longitude,
    )
    db.add(loc)
    db.commit()
    db.refresh(loc)
    return {"message": "Location saved successfully", "id": loc.id}


@router.delete("/saved-locations/{location_id}")
def delete_saved_location(
    location_id: int,
    session_id: str = Query(...),
    db: Session = Depends(get_db),
):
    """
    Remove a saved location.
    """
    user = db.query(User).filter(User.session_id == session_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    loc = db.query(SavedLocation).filter(
        SavedLocation.id == location_id,
        SavedLocation.user_id == user.id,
    ).first()
    if not loc:
        raise HTTPException(status_code=404, detail="Location not found")

    db.delete(loc)
    db.commit()
    return {"message": "Location removed"}


@router.put("/user/profile")
def update_profile(
    session_id: str = Query(...),
    profile: str = Query(...),
    db: Session = Depends(get_db),
):
    """
    Update the user's active profile (health, fitness, travel, etc.)
    """
    valid_profiles = {"health", "fitness", "travel", "family", "agriculture", "commuter", "beach", "event"}
    if profile not in valid_profiles:
        raise HTTPException(status_code=400, detail=f"Invalid profile '{profile}'")

    user = db.query(User).filter(User.session_id == session_id).first()
    if not user:
        user = User(session_id=session_id, selected_profile=profile)
        db.add(user)
    else:
        user.selected_profile = profile
    db.commit()
    return {"message": "Profile updated", "profile": profile}

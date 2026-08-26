"""
main.py — WeatherWise FastAPI Application Entry Point.

This is the main file that starts the backend server.
Run it with: uvicorn main:app --reload

API Documentation (auto-generated): http://localhost:8000/docs
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Import all route modules
from routes.weather import router as weather_router
from routes.air_quality import router as air_quality_router
from routes.recommendations import router as recommendations_router
from routes.locations import router as locations_router

# Import database setup to create tables on startup
from database.database import engine, Base
from database import models  # noqa: F401 — importing models registers them with Base

# ─────────────────────────────────────────────
# Create database tables (runs once on startup)
# ─────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ─────────────────────────────────────────────
# Create the FastAPI app
# ─────────────────────────────────────────────
app = FastAPI(
    title="WeatherWise API",
    description="Smart Weather & Environment Assistant — Backend API",
    version="1.0.0",
    docs_url="/docs",        # Swagger UI at http://localhost:8000/docs
    redoc_url="/redoc",      # Alternative docs at http://localhost:8000/redoc
)

# ─────────────────────────────────────────────
# CORS Configuration
# Allows requests from local development (ports 5173, 5174)
# and deployed frontend URLs (Vercel, custom domain).
# ─────────────────────────────────────────────
default_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

cors_env = os.getenv("CORS_ORIGINS") or os.getenv("FRONTEND_URL") or ""
custom_origins = [o.strip().rstrip("/") for o in cors_env.split(",") if o.strip()]
allowed_origins = list(set(default_origins + custom_origins))

# If "*" is specified in environment
if "*" in allowed_origins or cors_env.strip() == "*":
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app" if "*" not in allowed_origins else None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────
# Register route modules
# ─────────────────────────────────────────────
app.include_router(weather_router)
app.include_router(air_quality_router)
app.include_router(recommendations_router)
app.include_router(locations_router)


# ─────────────────────────────────────────────
# Health Check Endpoint
# ─────────────────────────────────────────────
@app.get("/api/health", tags=["System"])
async def health_check():
    """
    Simple health check endpoint.
    Returns status 200 if the server is running correctly.
    Use this to verify the backend is alive before testing other endpoints.
    """
    return {
        "status": "healthy",
        "message": "WeatherWise API is running!",
        "version": "1.0.0",
    }


@app.get("/", tags=["System"])
async def root():
    """Root endpoint — redirect users to the API docs."""
    return {
        "message": "Welcome to WeatherWise API!",
        "docs": "http://localhost:8000/docs",
        "health": "http://localhost:8000/api/health",
    }


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)


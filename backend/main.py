"""
main.py — WeatherWise FastAPI Application Entry Point.

This is the main file that starts the backend server.
Run it with: uvicorn main:app --reload

API Documentation (auto-generated): http://localhost:8000/docs
"""

import os
import time
from datetime import datetime, timezone
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

SERVER_START_TIME = time.time()


# ─────────────────────────────────────────────
# Health Check & Keep-Alive Endpoints (For cron-job.org / Render)
# ─────────────────────────────────────────────
@app.get("/api/health", tags=["System"])
@app.get("/health", tags=["System"])
@app.get("/ping", tags=["System"])
@app.get("/livez", tags=["System"])
async def health_check():
    """
    Health check endpoint for Render keep-alive and uptime monitoring.
    Target this endpoint with https://cron-job.org every 5-10 minutes
    to prevent Render from spinning down on free tier.
    """
    uptime_seconds = round(time.time() - SERVER_START_TIME, 1)
    return {
        "status": "healthy",
        "message": "WeatherWise API is running and ready!",
        "version": "1.0.0",
        "uptime_seconds": uptime_seconds,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/", tags=["System"])
async def root():
    """Root endpoint — redirect users to the API docs and health endpoint."""
    return {
        "message": "Welcome to WeatherWise Environmental Intelligence API!",
        "docs": "https://weatherwise-vr0t.onrender.com/docs",
        "health": "https://weatherwise-vr0t.onrender.com/health",
        "api_health": "https://weatherwise-vr0t.onrender.com/api/health",
        "status": "online",
    }


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)

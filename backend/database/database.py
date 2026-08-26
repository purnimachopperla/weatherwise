"""
database.py — SQLAlchemy database connection setup.

We use SQLite for simplicity (perfect for a hackathon prototype).
The architecture is designed to make it easy to switch to PostgreSQL later
by simply changing the DATABASE_URL environment variable.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Read the database URL from .env (defaults to SQLite if not set)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./weatherwise.db")

# SQLAlchemy 2.0 compatibility: Render/Supabase often provide 'postgres://', rewrite to 'postgresql://'
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# SQLite-specific argument: check_same_thread=False allows multiple
# threads to use the same connection (needed for FastAPI).
connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

# Create the database engine (the main connection to the database)
engine = create_engine(DATABASE_URL, connect_args=connect_args)

# SessionLocal is a factory for creating database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base is the parent class for all our database models
Base = declarative_base()


def get_db():
    """
    Dependency function for FastAPI routes.
    Creates a new database session for each request and closes it after.
    Usage in a route: db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

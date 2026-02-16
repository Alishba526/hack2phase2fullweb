import os
import secrets
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables explicitly to ensure they're available
load_dotenv()

class Settings(BaseSettings):
    # Use the determined database URL - this will be set from environment variables
    DATABASE_URL: str = "sqlite:///./todo_app.db"
    SECRET_KEY: str = os.getenv("SECRET_KEY", secrets.token_hex(32))  # Generate a random secret key if not provided
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = {"env_file": ".env", "case_sensitive": True, "extra": "ignore"}


settings = Settings()

# Validate that DATABASE_URL is properly set
if not settings.DATABASE_URL:
    # Fallback to SQLite if DATABASE_URL is empty
    settings.DATABASE_URL = "sqlite:///./todo_app.db"
    print("Warning: DATABASE_URL not set, falling back to SQLite")
else:
    print(f"Using database: {settings.DATABASE_URL[:50]}...")
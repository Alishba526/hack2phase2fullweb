from sqlmodel import create_engine
from sqlalchemy.pool import StaticPool, QueuePool
from ..config import settings
import urllib.parse
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global engine instance to reuse connection
_engine = None

# Function to create the database engine
def get_engine():
    global _engine
    if _engine is not None:
        return _engine

    logger.info(f"Creating database engine for: {settings.DATABASE_URL[:50]}...")

    # For SQLite, use StaticPool and check_same_thread=False
    if settings.DATABASE_URL.lower().startswith("sqlite"):
        _engine = create_engine(
            settings.DATABASE_URL,
            echo=False,  # Set to True for debugging, False for production
            connect_args={
                "check_same_thread": False,  # Required for SQLite in multithreaded environments
                "timeout": 30  # Add timeout for database locks
            },
            poolclass=StaticPool,
            pool_pre_ping=True,  # Verify connections before use
        )
    else:
        # For PostgreSQL (including Neon), handle SSL requirements
        # Parse the database URL to check if it's a Neon URL
        if "neon.tech" in settings.DATABASE_URL.lower():
            # For Neon databases, we need to add SSL parameters
            # Remove channel_binding from the connection string if present as it may cause issues
            db_url = settings.DATABASE_URL
            if "channel_binding" in db_url:
                # Extract the connection string parts and handle them appropriately
                import re
                # Remove channel_binding parameter from URL
                db_url = re.sub(r'&channel_binding=[^&]*', '', db_url)
                db_url = re.sub(r'\?channel_binding=[^&]*&?', '?', db_url)
                # Clean up any double ?? that might result
                db_url = re.sub(r'\?\?', '?', db_url)
                # Remove trailing ? if it's at the end
                db_url = re.sub(r'\?$', '', db_url)
                
            _engine = create_engine(
                db_url,
                echo=False,  # Set to True for debugging, False for production
                pool_size=5,  # Number of connections to maintain in the pool
                max_overflow=10,  # Additional connections beyond pool_size
                pool_pre_ping=True,  # Verify connections before use
                pool_recycle=300,  # Recycle connections after 5 minutes
                connect_args={
                    "sslmode": "require",  # Required for Neon connections
                    "connect_timeout": 10,  # Timeout for establishing connection
                }
            )
        else:
            # Standard PostgreSQL connection with enhanced pooling
            _engine = create_engine(
                settings.DATABASE_URL,
                echo=False,  # Set to True for debugging, False for production
                pool_size=5,  # Number of connections to maintain in the pool
                max_overflow=10,  # Additional connections beyond pool_size
                pool_pre_ping=True,  # Verify connections before use
                pool_recycle=300,  # Recycle connections after 5 minutes
                poolclass=QueuePool,  # Use QueuePool for PostgreSQL
                connect_args={
                    "connect_timeout": 10,  # Timeout for establishing connection
                }
            )

    logger.info("Database engine created successfully")
    return _engine
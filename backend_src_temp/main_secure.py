import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from src.api.auth_router import router as auth_router
from src.api.todo_router import router as todo_router
from src.api.user_router import router as user_router
from src.config import settings
from src.database.database import get_engine
from src.models.user import User
from src.models.todo import Todo

from dotenv import load_dotenv
# Load environment variables at module level to ensure they're available
load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan event handler for FastAPI that manages startup and shutdown events.
    This ensures database initialization happens properly when the app starts.
    """
    print("Starting up...")

    # Startup: Initialize database tables
    try:
        from sqlmodel import SQLModel
        engine = get_engine()
        
        # Verify database connectivity
        with engine.connect() as conn:
            print("Database connection successful")
        
        # Create tables - this is a sync operation but should be quick
        SQLModel.metadata.create_all(engine)
        print("Database tables created/verified successfully")
    except Exception as e:
        print(f"Error initializing database: {e}")
        print("Application will attempt to continue but database features may not work properly")
        # Don't raise the exception to allow the app to start even if DB fails

    yield  # Application runs here

    # Shutdown: Cleanup if needed
    print("Shutting down...")


def create_app():
    app = FastAPI(
        title="Todo Web Application API",
        version="1.0.0",
        lifespan=lifespan  # Use the new lifespan event handler
    )

    # Add TrustedHostMiddleware to handle proxy headers from Hugging Face Spaces
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["*"]  # Allow all hosts since we're behind a proxy
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "https://hack2phase2fullweb-9loz.vercel.app",
            "https://hack2phase2fullweb-9loz-211waadol-alishbarehman-s-projects.vercel.app",
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
            "*"  # Allow all for local development - restrict in production
        ],  # Allow specific origins
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        # Allow credentials to be sent with cross-origin requests
        allow_origin_regex=None,
        # Expose headers to the client
        expose_headers=["Access-Control-Allow-Origin", "Access-Control-Allow-Credentials", "Authorization"]
    )

    # Include routers
    app.include_router(auth_router)
    app.include_router(todo_router)
    app.include_router(user_router)

    @app.get("/")
    def read_root():
        return {"message": "Welcome to the Todo Web Application API", "status": "running"}

    @app.get("/health")
    def health_check():
        try:
            from sqlalchemy import text
            engine = get_engine()
            with engine.connect() as conn:
                # Simple query to test database connectivity
                result = conn.execute(text("SELECT 1")).first()
            
            return {
                "status": "healthy", 
                "database": "connected",
                "timestamp": __import__('datetime').datetime.now().isoformat()
            }
        except Exception as e:
            return {
                "status": "degraded",
                "database": "connection failed",
                "error": str(e),
                "timestamp": __import__('datetime').datetime.now().isoformat()
            }

    return app


app = create_app()
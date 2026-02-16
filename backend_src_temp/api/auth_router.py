from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import Dict
from pydantic import BaseModel
from ..database.database import get_engine
from ..models.user import User, UserCreate, UserPublic
from ..services.auth_service import AuthService
from ..services.user_service import UserService
from datetime import timedelta
import uuid


class LoginRequest(BaseModel):
    email: str
    password: str


router = APIRouter(prefix="/auth", tags=["auth"])

auth_service = AuthService()
user_service = UserService()


@router.post("/register", response_model=UserPublic)
def register(user_create: UserCreate):
    """
    Register a new user.
    """
    db = Session(get_engine())
    try:
        # Check if user already exists
        existing_user = user_service.get_user_by_email(db, user_create.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )

        # Create new user
        db_user = user_service.create_user(db, user_create)
        return db_user
    except ValueError as ve:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during registration: {str(e)}"
        )
    finally:
        db.close()



@router.post("/login")
def login(login_request: LoginRequest):
    """
    Authenticate user and return access and refresh tokens.
    """
    db = Session(get_engine())
    try:
        user = auth_service.authenticate_user(db, login_request.email, login_request.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token_expires = timedelta(minutes=auth_service.access_token_expire_minutes)
        access_token = auth_service.create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )

        # Create refresh token
        refresh_token = auth_service.create_refresh_token(
            data={"sub": user.email}
        )

        # Store refresh token in user record
        auth_service.update_user_refresh_token(db, user.id, refresh_token)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": auth_service.access_token_expire_minutes * 60,  # in seconds
            "user": UserPublic.model_validate(user)
        }
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during login: {str(e)}"
        )
    finally:
        db.close()


class TokenRefreshRequest(BaseModel):
    refresh_token: str


@router.post("/refresh")
def refresh_token(request: TokenRefreshRequest):
    """
    Refresh access token using refresh token.
    """
    db = Session(get_engine())
    try:
        # Verify the refresh token
        payload = auth_service.verify_refresh_token(request.refresh_token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        email = payload.get("sub")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Get user from database
        user = user_service.get_user_by_email(db, email)
        if not user or user.refresh_token != request.refresh_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Generate new access token
        access_token_expires = timedelta(minutes=auth_service.access_token_expire_minutes)
        new_access_token = auth_service.create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )

        return {
            "access_token": new_access_token,
            "token_type": "bearer",
            "expires_in": auth_service.access_token_expire_minutes * 60,  # in seconds
        }
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during token refresh: {str(e)}"
        )
    finally:
        db.close()


@router.post("/logout")
def logout(token: str = Depends(auth_service.oauth2_scheme)):
    """
    Logout the current user by clearing refresh token.
    """
    db = Session(get_engine())
    try:
        # Get current user from token
        user = auth_service.get_current_user(token, db)
        
        # Clear the refresh token from the user record
        if user:
            user.refresh_token = None
            db.add(user)
            db.commit()
        
        return {"message": "Successfully logged out"}
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during logout: {str(e)}"
        )
    finally:
        db.close()


def get_current_user(token: str = Depends(auth_service.oauth2_scheme)):
    """
    Dependency to get the current user from the token.
    """
    db = Session(get_engine())
    try:
        user = auth_service.get_current_user(token, db)
        return user
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred getting current user: {str(e)}"
        )
    finally:
        db.close()


@router.get("/me", response_model=UserPublic)
def read_current_user(current_user: User = Depends(get_current_user)):
    """
    Get current user profile information.
    """
    return current_user
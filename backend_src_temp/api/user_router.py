from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import Optional
from ..database.database import get_engine
from ..models.user import User, UserUpdate, UserPublic
from ..services.user_service import UserService
from ..services.auth_service import AuthService


router = APIRouter(prefix="/users", tags=["users"])

user_service = UserService()
auth_service = AuthService()


def get_current_user_from_token(token: str = Depends(auth_service.oauth2_scheme)):
    """
    Dependency to get the current user from the token.
    """
    db = Session(get_engine())
    try:
        user = auth_service.get_current_user(token, db)
        return user
    finally:
        db.close()


@router.get("/me", response_model=UserPublic)
def get_current_user(current_user: User = Depends(get_current_user_from_token)):
    """
    Get current user profile information.
    """
    return current_user


@router.put("/me", response_model=UserPublic)
def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user_from_token)
):
    """
    Update current user profile information.
    """
    db = Session(get_engine())
    try:
        updated_user = user_service.update_user(db, str(current_user.id), user_update)
        if not updated_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return updated_user
    finally:
        db.close()
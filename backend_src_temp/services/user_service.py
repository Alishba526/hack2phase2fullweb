from sqlmodel import Session, select
from typing import Optional
from ..models.user import User, UserCreate, UserUpdate
from ..utils.security import get_password_hash, validate_password_strength
from datetime import datetime


class UserService:
    def create_user(self, db_session: Session, user_create: UserCreate) -> User:
        """
        Create a new user with a hashed password.
        """
        # Validate password strength
        is_valid, error_msg = validate_password_strength(user_create.password)
        if not is_valid:
            raise ValueError(error_msg)
        
        try:
            hashed_password = get_password_hash(user_create.password)
            db_user = User(
                email=user_create.email,
                first_name=user_create.first_name,
                last_name=user_create.last_name,
                hashed_password=hashed_password
            )
            db_session.add(db_user)
            db_session.commit()
            db_session.refresh(db_user)
            return db_user
        except Exception as e:
            db_session.rollback()
            raise e

    def get_user_by_email(self, db_session: Session, email: str) -> Optional[User]:
        """
        Retrieve a user by email.
        """
        statement = select(User).where(User.email == email)
        return db_session.exec(statement).first()

    def get_user_by_id(self, db_session: Session, user_id: str) -> Optional[User]:
        """
        Retrieve a user by ID.
        """
        from uuid import UUID
        statement = select(User).where(User.id == UUID(user_id))
        return db_session.exec(statement).first()

    def update_user(self, db_session: Session, user_id: str, user_update: UserUpdate) -> Optional[User]:
        """
        Update user information.
        """
        db_user = self.get_user_by_id(db_session, user_id)
        if db_user:
            user_data = user_update.dict(exclude_unset=True)
            for key, value in user_data.items():
                setattr(db_user, key, value)
            db_session.add(db_user)
            db_session.commit()
            db_session.refresh(db_user)
        return db_user

    def delete_user(self, db_session: Session, user_id: str) -> bool:
        """
        Delete a user.
        """
        db_user = self.get_user_by_id(db_session, user_id)
        if db_user:
            db_session.delete(db_user)
            db_session.commit()
            return True
        return False
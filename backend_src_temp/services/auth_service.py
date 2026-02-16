from datetime import datetime, timedelta
from typing import Optional
from sqlmodel import Session
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from ..models.user import User
from ..utils.security import verify_password
from ..config import settings
from jose.constants import ALGORITHMS
import time
import hashlib


class RateLimiter:
    """Simple in-memory rate limiter for authentication endpoints."""
    
    def __init__(self):
        self.requests = {}
        self.limit = 5  # Max attempts per window
        self.window = 300  # Time window in seconds (5 minutes)
    
    def is_allowed(self, identifier: str) -> bool:
        current_time = time.time()
        
        if identifier not in self.requests:
            self.requests[identifier] = []
        
        # Clean old requests outside the window
        self.requests[identifier] = [
            req_time for req_time in self.requests[identifier] 
            if current_time - req_time < self.window
        ]
        
        # Check if limit exceeded
        if len(self.requests[identifier]) >= self.limit:
            return False
        
        # Add current request
        self.requests[identifier].append(current_time)
        return True


class AuthService:
    def __init__(self):
        self.secret_key = settings.SECRET_KEY
        self.algorithm = settings.ALGORITHM
        self.access_token_expire_minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES
        self.refresh_token_expire_days = 30  # Refresh tokens expire after 30 days
        self.oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
        self.rate_limiter = RateLimiter()

    def authenticate_user(self, db_session: Session, email: str, password: str) -> Optional[User]:
        """
        Authenticate a user by email and password with rate limiting.
        """
        # Hash the email to use as identifier for rate limiting
        email_hash = hashlib.sha256(email.encode()).hexdigest()
        
        # Check rate limit
        if not self.rate_limiter.is_allowed(email_hash):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many authentication attempts. Please try again later."
            )
        
        from .user_service import UserService
        user_service = UserService()
        user = user_service.get_user_by_email(db_session, email)
        
        if not user or not verify_password(password, user.hashed_password):
            # Even on failure, we still count this as a request for rate limiting
            # But we'll add a small delay to slow down brute force attempts
            time.sleep(0.5)  # Small delay to slow down brute force
            return None
        return user

    def get_user_by_email(self, db_session: Session, email: str) -> Optional[User]:
        """
        Retrieve a user by email.
        """
        from .user_service import user_service
        return user_service.get_user_by_email(db_session, email)

    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        """
        Create an access token with expiration.
        """
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt

    def verify_token(self, token: str) -> Optional[dict]:
        """
        Verify an access token and return the payload.
        """
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            email: str = payload.get("sub")
            if email is None:
                return None
            return payload
        except JWTError:
            return None

    def get_current_user(self, token: str, db_session: Session) -> Optional[User]:
        """
        Get the current user from the token.
        """
        from fastapi import status
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        payload = self.verify_token(token)
        if payload is None:
            raise credentials_exception

        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception

        from .user_service import UserService
        user_service = UserService()
        user = user_service.get_user_by_email(db_session, email=email)
        if user is None:
            raise credentials_exception
        return user

    def create_refresh_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        """
        Create a refresh token with longer expiration.
        """
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(days=self.refresh_token_expire_days)

        to_encode.update({"exp": expire, "type": "refresh"})
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt

    def verify_refresh_token(self, token: str) -> Optional[dict]:
        """
        Verify a refresh token and return the payload.
        """
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            token_type = payload.get("type")
            if token_type != "refresh":
                return None
            email: str = payload.get("sub")
            if email is None:
                return None
            return payload
        except JWTError:
            return None

    def update_user_refresh_token(self, db_session: Session, user_id: int, refresh_token: str):
        """
        Update the user's refresh token in the database.
        """
        from sqlmodel import select
        statement = select(User).where(User.id == user_id)
        user = db_session.exec(statement).first()
        if user:
            user.refresh_token = refresh_token
            db_session.add(user)
            db_session.commit()
            db_session.refresh(user)
        return user
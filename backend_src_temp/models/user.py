from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
import uuid
from datetime import datetime
from pydantic import BaseModel


class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: bool = Field(default=True)


class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str = Field(sa_column_kwargs={"nullable": False})
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    refresh_token: Optional[str] = Field(default=None)  # Store refresh token


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: Optional[bool] = None


class UserPublic(UserBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


# Define relationships after both models are defined to avoid circular import
User.todos = Relationship(back_populates="owner", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
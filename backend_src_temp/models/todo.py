from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING, Optional
import uuid
from datetime import datetime

if TYPE_CHECKING:
    from .user import User  # Only import for type checking to avoid circular import


class TodoBase(SQLModel):
    title: str
    description: Optional[str] = None
    is_completed: bool = Field(default=False)


class Todo(TodoBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    user_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)

    # Relationship to user - will be defined after both models are loaded to avoid circular import
    pass


class TodoCreate(TodoBase):
    pass


class TodoUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None


class TodoPublic(TodoBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    user_id: uuid.UUID


# Define relationships after both models are defined to avoid circular import
Todo.owner = Relationship(back_populates="todos")
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session
from typing import List, Optional
from ..database.database import get_engine
from ..models.todo import Todo, TodoCreate, TodoUpdate, TodoPublic
from ..services.todo_service import TodoService
from ..services.auth_service import AuthService
from ..models.user import User


router = APIRouter(prefix="/todos", tags=["todos"], include_in_schema=True)

todo_service = TodoService()
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


@router.get("/", response_model=List[TodoPublic])
def get_todos(
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    current_user: User = Depends(get_current_user_from_token)
):
    """
    Retrieve all todos for the authenticated user.
    """
    db = Session(get_engine())
    try:
        todos = todo_service.get_todos_by_user(db, str(current_user.id), completed)
        return todos
    finally:
        db.close()


@router.post("/", response_model=TodoPublic)
def create_todo(
    todo_create: TodoCreate,
    current_user: User = Depends(get_current_user_from_token)
):
    """
    Create a new todo for the authenticated user.
    """
    db = Session(get_engine())
    try:
        todo = todo_service.create_todo(db, todo_create, str(current_user.id))
        return todo
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred creating todo: {str(e)}"
        )
    finally:
        db.close()


@router.get("/{todo_id}", response_model=TodoPublic)
def get_todo(
    todo_id: str,
    current_user: User = Depends(get_current_user_from_token)
):
    """
    Retrieve a specific todo for the authenticated user.
    """
    db = Session(get_engine())
    try:
        todo = todo_service.get_todo_by_id(db, todo_id, str(current_user.id))
        if not todo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Todo not found"
            )
        return todo
    finally:
        db.close()


@router.put("/{todo_id}", response_model=TodoPublic)
def update_todo(
    todo_id: str,
    todo_update: TodoUpdate,
    current_user: User = Depends(get_current_user_from_token)
):
    """
    Update a specific todo for the authenticated user.
    """
    db = Session(get_engine())
    try:
        todo = todo_service.update_todo(db, todo_id, todo_update, str(current_user.id))
        if not todo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Todo not found"
            )
        return todo
    finally:
        db.close()


@router.delete("/{todo_id}")
def delete_todo(
    todo_id: str,
    current_user: User = Depends(get_current_user_from_token)
):
    """
    Delete a specific todo for the authenticated user.
    """
    db = Session(get_engine())
    try:
        success = todo_service.delete_todo(db, todo_id, str(current_user.id))
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Todo not found"
            )
        return {"message": "Todo deleted successfully"}
    finally:
        db.close()
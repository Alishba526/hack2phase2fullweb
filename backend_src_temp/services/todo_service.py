from sqlmodel import Session, select
from typing import List, Optional
from ..models.todo import Todo, TodoCreate, TodoUpdate
from ..models.user import User


class TodoService:
    def create_todo(self, db_session: Session, todo_create: TodoCreate, user_id: str) -> Todo:
        """
        Create a new todo for a user.
        """
        from uuid import UUID
        db_todo = Todo(**todo_create.model_dump())
        # Convert string user_id to UUID to match the foreign key type
        db_todo.user_id = UUID(user_id)
        db_session.add(db_todo)
        db_session.commit()
        db_session.refresh(db_todo)
        return db_todo

    def get_todos_by_user(self, db_session: Session, user_id: str, completed: Optional[bool] = None) -> List[Todo]:
        """
        Retrieve all todos for a user, optionally filtered by completion status.
        """
        from uuid import UUID
        query = select(Todo).where(Todo.user_id == UUID(user_id))
        if completed is not None:
            query = query.where(Todo.is_completed == completed)

        return db_session.exec(query).all()

    def get_todo_by_id(self, db_session: Session, todo_id: str, user_id: str) -> Optional[Todo]:
        """
        Retrieve a specific todo by ID for a user.
        """
        from uuid import UUID
        statement = select(Todo).where(Todo.id == UUID(todo_id), Todo.user_id == UUID(user_id))
        return db_session.exec(statement).first()

    def update_todo(self, db_session: Session, todo_id: str, todo_update: TodoUpdate, user_id: str) -> Optional[Todo]:
        """
        Update a todo if it belongs to the user.
        """
        db_todo = self.get_todo_by_id(db_session, todo_id, user_id)
        if db_todo:
            update_data = todo_update.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_todo, key, value)
            db_session.add(db_todo)
            db_session.commit()
            db_session.refresh(db_todo)
        return db_todo

    def delete_todo(self, db_session: Session, todo_id: str, user_id: str) -> bool:
        """
        Delete a todo if it belongs to the user.
        """
        db_todo = self.get_todo_by_id(db_session, todo_id, user_id)
        if db_todo:
            db_session.delete(db_todo)
            db_session.commit()
            return True
        return False
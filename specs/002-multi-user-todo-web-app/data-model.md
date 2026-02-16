# Data Model: Multi-User Todo Web Application

**Feature**: Multi-User Todo Web Application
**Date**: 2026-02-08
**Status**: Completed

## Overview

This document defines the data models for the Multi-User Todo Web Application, based on the feature specification and technical research. The models are designed using SQLModel to ensure type safety and seamless integration with the FastAPI backend.

## Entity: User

Represents a registered user with authentication details.

### Fields
- `id` (UUID, Primary Key): Unique identifier for the user
- `email` (String, Unique, Indexed): User's email address (used for login)
- `hashed_password` (String): BCrypt hashed password
- `first_name` (String, Optional): User's first name
- `last_name` (String, Optional): User's last name
- `is_active` (Boolean): Whether the account is active (default: True)
- `created_at` (DateTime): Timestamp when the account was created
- `updated_at` (DateTime): Timestamp when the account was last updated

### Relationships
- `todos` (List[Todo]): One-to-many relationship with Todo entities (cascade delete)

### Validation Rules
- Email must be a valid email format
- Email must be unique across all users
- Password must meet minimum security requirements (handled by auth service)

## Entity: Todo

Represents a todo item owned by a specific user.

### Fields
- `id` (UUID, Primary Key): Unique identifier for the todo item
- `title` (String): Title of the todo item (max 255 characters)
- `description` (String, Optional): Detailed description of the todo item
- `is_completed` (Boolean): Whether the todo item is completed (default: False)
- `created_at` (DateTime): Timestamp when the todo was created
- `updated_at` (DateTime): Timestamp when the todo was last updated
- `user_id` (UUID, Foreign Key): Reference to the owning user

### Relationships
- `owner` (User): Many-to-one relationship with User entity

### Validation Rules
- Title must not be empty
- Title must be less than 255 characters
- User must exist when creating a todo
- Only the owner can modify or delete the todo

## State Transitions

### Todo Status
- `is_completed` field can transition from `False` to `True` (marked complete)
- `is_completed` field can transition from `True` to `False` (marked incomplete)

## Indexes

### User Entity
- Index on `email` field for efficient login lookups
- Unique constraint on `email` field

### Todo Entity
- Index on `user_id` field for efficient user-specific queries
- Index on `is_completed` field for filtering completed/incomplete items
- Composite index on `(user_id, is_completed)` for efficient user-specific status queries

## Security Considerations

### Data Isolation
- All queries for todos must be filtered by the authenticated user's ID
- The application layer must enforce that users can only access their own todos
- Foreign key constraints ensure referential integrity

### Privacy
- User email addresses are stored securely
- Personal information is only collected as needed
- Data deletion follows GDPR-like principles (deleting a user removes all their todos)

## API Representation

### User Response Object
```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "is_active": true,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

### Todo Response Object
```json
{
  "id": "uuid-string",
  "title": "Complete project",
  "description": "Finish the todo application project",
  "is_completed": false,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z",
  "user_id": "uuid-string"
}
```

## Database Schema

The SQLModel classes will generate the following database schema:

```sql
CREATE TABLE user (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE todo (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES user(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_email ON user(email);
CREATE INDEX idx_todo_user_id ON todo(user_id);
CREATE INDEX idx_todo_is_completed ON todo(is_completed);
CREATE INDEX idx_todo_user_status ON todo(user_id, is_completed);
```

## Migration Strategy

Initial database setup will use Alembic for migration management, allowing for version-controlled schema changes. Future modifications to the data model will follow the same migration approach.
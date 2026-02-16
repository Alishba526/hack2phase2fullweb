# API Contract: Todo Operations Endpoints

**Feature**: Multi-User Todo Web Application
**Date**: 2026-02-08
**Status**: Draft

## Overview

This document specifies the API contracts for todo operations in the Multi-User Todo Web Application. These endpoints handle creating, reading, updating, and deleting todo items with user-specific data isolation.

## Base URL

`https://api.todo-app.example.com/v1`

## Todo Endpoints

### GET /todos

Retrieve all todos for the authenticated user.

#### Request
```http
GET /todos
Authorization: Bearer {token}
```

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| completed | boolean | No | Filter by completion status (true/false) |
| limit | integer | No | Limit number of results (default: 50, max: 100) |
| offset | integer | No | Offset for pagination (default: 0) |

#### Response

##### 200 OK
Todos retrieved successfully.
```json
{
  "success": true,
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "title": "Complete project",
      "description": "Finish the todo application project",
      "is_completed": false,
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    },
    {
      "id": "b2c3d4e5-f6g7-8901-2345-67890abcdef1",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread, fruits",
      "is_completed": true,
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-02T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 2,
    "limit": 50,
    "offset": 0
  }
}
```

##### 401 Unauthorized
Invalid or expired token.
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

### POST /todos

Create a new todo item for the authenticated user.

#### Request
```http
POST /todos
Authorization: Bearer {token}
Content-Type: application/json
```

##### Body Parameters
```json
{
  "title": "New todo item",
  "description": "Detailed description of the todo item"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Title of the todo item (max 255 characters) |
| description | string | No | Detailed description of the todo item |

#### Response

##### 201 Created
Todo created successfully.
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "title": "New todo item",
    "description": "Detailed description of the todo item",
    "is_completed": false,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z",
    "user_id": "b1c2d3e4-f5g6-7890-1234-567890abcdef"
  }
}
```

##### 400 Bad Request
Invalid input data.
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

##### 401 Unauthorized
Invalid or expired token.
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

### GET /todos/{id}

Retrieve a specific todo item for the authenticated user.

#### Request
```http
GET /todos/a1b2c3d4-e5f6-7890-1234-567890abcdef
Authorization: Bearer {token}
```

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | uuid | Yes | Unique identifier of the todo item |

#### Response

##### 200 OK
Todo retrieved successfully.
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "title": "Complete project",
    "description": "Finish the todo application project",
    "is_completed": false,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  }
}
```

##### 401 Unauthorized
Invalid or expired token.
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

##### 403 Forbidden
User does not have access to this todo item.
```json
{
  "success": false,
  "error": "Access denied"
}
```

##### 404 Not Found
Todo item does not exist.
```json
{
  "success": false,
  "error": "Todo not found"
}
```

### PUT /todos/{id}

Update a specific todo item for the authenticated user.

#### Request
```http
PUT /todos/a1b2c3d4-e5f6-7890-1234-567890abcdef
Authorization: Bearer {token}
Content-Type: application/json
```

##### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | uuid | Yes | Unique identifier of the todo item |

##### Body Parameters
```json
{
  "title": "Updated todo item",
  "description": "Updated description of the todo item",
  "is_completed": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | No | Updated title of the todo item |
| description | string | No | Updated description of the todo item |
| is_completed | boolean | No | Updated completion status |

#### Response

##### 200 OK
Todo updated successfully.
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "title": "Updated todo item",
    "description": "Updated description of the todo item",
    "is_completed": true,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-02T00:00:00Z"
  }
}
```

##### 400 Bad Request
Invalid input data.
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title must not exceed 255 characters"
    }
  ]
}
```

##### 401 Unauthorized
Invalid or expired token.
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

##### 403 Forbidden
User does not have access to this todo item.
```json
{
  "success": false,
  "error": "Access denied"
}
```

##### 404 Not Found
Todo item does not exist.
```json
{
  "success": false,
  "error": "Todo not found"
}
```

### DELETE /todos/{id}

Delete a specific todo item for the authenticated user.

#### Request
```http
DELETE /todos/a1b2c3d4-e5f6-7890-1234-567890abcdef
Authorization: Bearer {token}
```

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | uuid | Yes | Unique identifier of the todo item |

#### Response

##### 200 OK
Todo deleted successfully.
```json
{
  "success": true,
  "message": "Todo deleted successfully"
}
```

##### 401 Unauthorized
Invalid or expired token.
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

##### 403 Forbidden
User does not have access to this todo item.
```json
{
  "success": false,
  "error": "Access denied"
}
```

##### 404 Not Found
Todo item does not exist.
```json
{
  "success": false,
  "error": "Todo not found"
}
```

## Security Considerations

- All endpoints require valid authentication token
- Users can only access their own todo items
- Proper validation is performed on all input data
- Rate limiting should be implemented to prevent abuse
- IDs are validated to prevent injection attacks
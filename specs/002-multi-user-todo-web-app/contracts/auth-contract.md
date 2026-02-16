# API Contract: Authentication Endpoints

**Feature**: Multi-User Todo Web Application
**Date**: 2026-02-08
**Status**: Draft

## Overview

This document specifies the API contracts for user authentication functionality in the Multi-User Todo Web Application. These endpoints handle user registration, login, and session management using Better Auth.

## Base URL

`https://api.todo-app.example.com/v1`

## Authentication Endpoints

### POST /auth/register

Register a new user account.

#### Request
```http
POST /auth/register
Content-Type: application/json
```

##### Body Parameters
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "first_name": "John",
  "last_name": "Doe"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User's email address |
| password | string | Yes | User's password (minimum 8 characters) |
| first_name | string | No | User's first name |
| last_name | string | No | User's last name |

#### Response

##### 201 Created
User successfully registered.
```json
{
  "success": true,
  "user": {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true,
    "created_at": "2023-01-01T00:00:00Z"
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
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

##### 409 Conflict
Email already exists.
```json
{
  "success": false,
  "error": "Email already registered"
}
```

### POST /auth/login

Authenticate user and return session token.

#### Request
```http
POST /auth/login
Content-Type: application/json
```

##### Body Parameters
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User's email address |
| password | string | Yes | User's password |

#### Response

##### 200 OK
Login successful.
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

##### 401 Unauthorized
Invalid credentials.
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

### POST /auth/logout

Logout the current user and invalidate session.

#### Request
```http
POST /auth/logout
Authorization: Bearer {token}
```

#### Response

##### 200 OK
Logout successful.
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

### GET /auth/me

Get current user profile information.

#### Request
```http
GET /auth/me
Authorization: Bearer {token}
```

#### Response

##### 200 OK
Current user information retrieved.
```json
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "is_active": true,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
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

## Security Considerations

- All authentication endpoints require HTTPS
- Passwords are never returned in API responses
- Tokens have expiration times and must be refreshed periodically
- Rate limiting should be implemented to prevent brute force attacks
- Session management follows Better Auth best practices
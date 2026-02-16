# Quickstart Guide: Multi-User Todo Web Application

**Feature**: Multi-User Todo Web Application
**Date**: 2026-02-08
**Status**: Draft

## Overview

This guide provides a quick introduction to getting started with the Multi-User Todo Web Application. It covers the essential steps to set up the development environment, run the application locally, and perform basic operations.

## Prerequisites

Before starting, ensure you have the following installed:

- Python 3.11 or higher
- Node.js 18 or higher
- npm or yarn package manager
- Git version control system
- PostgreSQL client (for local development)

## Setting Up the Backend

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/todo-web-app.git
cd todo-web-app/backend
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Set Up Environment Variables

Create a `.env` file in the backend root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/todo_app_dev
SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
NEON_DATABASE_URL=your-neon-db-url
```

### 5. Run Database Migrations

```bash
alembic upgrade head
```

### 6. Start the Backend Server

```bash
uvicorn main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`.

## Setting Up the Frontend

### 1. Navigate to Frontend Directory

```bash
cd ../frontend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the frontend root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_AUTH_COOKIE_NAME=todo_app_auth
```

### 4. Start the Frontend Development Server

```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`.

## Basic Operations

### Register a New User

1. Visit the registration page at `http://localhost:3000/register`
2. Fill in the registration form with your details
3. Submit the form to create your account

Alternatively, you can register via the API:

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### Log In

1. Visit the login page at `http://localhost:3000/login`
2. Enter your email and password
3. Click "Log In" to access your account

Or via the API:

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

### Create a Todo

Once logged in, you can create a new todo:

Via the API:

```bash
# Replace YOUR_TOKEN with the token received from login
curl -X POST http://localhost:8000/todos \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My first todo",
    "description": "This is my first todo item"
  }'
```

### View Todos

To retrieve your todos:

```bash
# Replace YOUR_TOKEN with your authentication token
curl -X GET http://localhost:8000/todos \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update a Todo

To update a todo (replace `{todo_id}` with the actual ID):

```bash
# Replace YOUR_TOKEN and {todo_id} with appropriate values
curl -X PUT http://localhost:8000/todos/{todo_id} \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated todo title",
    "is_completed": true
  }'
```

### Delete a Todo

To delete a todo (replace `{todo_id}` with the actual ID):

```bash
# Replace YOUR_TOKEN and {todo_id} with appropriate values
curl -X DELETE http://localhost:8000/todos/{todo_id} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Running Tests

### Backend Tests

From the backend directory:

```bash
pytest
```

### Frontend Tests

From the frontend directory:

```bash
npm test
# or
yarn test
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**: Ensure your PostgreSQL server is running and the connection string in `.env` is correct.

2. **Authentication Issues**: Verify that the SECRET_KEY in your environment variables matches between frontend and backend.

3. **CORS Issues**: Check that the allowed origins in the backend configuration include your frontend URL.

4. **Dependency Conflicts**: If experiencing dependency issues, try clearing the virtual environment and reinstalling dependencies.

### Getting Help

- Check the API documentation at `http://localhost:8000/docs`
- Review the project specifications in the `specs/` directory
- Consult the team members or project maintainers

## Next Steps

1. Explore the API documentation at `http://localhost:8000/docs`
2. Review the data models in the `specs/data-model.md` file
3. Examine the API contracts in the `specs/contracts/` directory
4. Look at the task breakdown in `specs/tasks.md` for implementation details
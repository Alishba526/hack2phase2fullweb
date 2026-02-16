---
name: backend-core
description: Generate backend routes, handle HTTP requests and responses, and connect to databases. Use for building scalable server-side applications.
---

# Backend Core Skill

## Instructions

1. **Route generation**
   - Create RESTful API routes
   - Support CRUD operations
   - Follow clean URL patterns

2. **Request & response handling**
   - Parse request body, params, and headers
   - Validate input data
   - Send structured JSON responses
   - Handle errors with proper status codes

3. **Database integration**
   - Connect to SQL or NoSQL databases
   - Perform create, read, update, delete operations
   - Use environment variables for credentials
   - Ensure secure and optimized queries

## Best Practices
- Follow MVC or service-based architecture
- Use async/await for database operations
- Centralize error handling
- Validate and sanitize user input
- Keep controllers thin and logic reusable
- Write scalable, readable code

## Example Structure
```js
// routes/user.routes.js
import express from "express";
import { createUser, getUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/users", createUser);
router.get("/users", getUsers);

export default router;

---
name: database-schema-design skill
description: Design scalable databases with clean schemas, migrations, and relational integrity. Use for backend systems and production-ready applications.
---

# Database Skill – Tables, Migrations & Schema Design

## Instructions

1. **Schema Planning**
   - Identify entities and relationships
   - Normalize data (avoid duplication)
   - Choose appropriate data types
   - Define primary & foreign keys

2. **Table Creation**
   - Create tables with clear naming conventions
   - Add constraints (NOT NULL, UNIQUE)
   - Use indexes for performance
   - Maintain referential integrity

3. **Migrations**
   - Create version-controlled migrations
   - Support up & down rollback
   - Avoid destructive changes in production
   - Keep migrations atomic and readable

4. **Relationships**
   - One-to-One
   - One-to-Many
   - Many-to-Many (pivot tables)
   - Cascade rules (ON DELETE / ON UPDATE)

5. **Optimization**
   - Index frequently queried columns
   - Avoid over-indexing
   - Use timestamps wisely
   - Plan for scalability

## Best Practices
- Use snake_case for table & column names
- Always include `id`, `created_at`, `updated_at`
- Never edit old migrations directly
- Keep schemas database-agnostic when possible
- Test migrations before deploying

## Example Structure
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  title VARCHAR(255),
  body TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

---
id: "1"
title: "Update-project-constitution"
stage: "constitution"
date_iso: "2026-02-08"
surface: "agent"
model: "default"
feature: "none"
branch: "main"
user: "user"
command: "/sp.constitution"
labels: ["constitution", "setup", "governance"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - ".specify/memory/constitution.md"
  - ".specify/templates/plan-template.md"
  - ".specify/templates/spec-template.md"
  - ".specify/templates/tasks-template.md"
  - "README.md"
tests_yaml: []
---

# Update Project Constitution

## PROMPT_TEXT

```
Project: Todo Full-Stack Web Application (Phase II – Hackathon)

Objective:
Transform an existing console-based Todo application into a modern, multi-user, full-stack web application using a strictly spec-driven, agentic development workflow. No manual coding is allowed; all implementation must be driven through specifications, plans, and AI-assisted execution.

Core principles:
- Spec-driven development (spec → plan → tasks → implementation)
- Clear separation of concerns across backend and frontend
- Backend-first architecture
- Security-first authentication and data access
- Reproducibility of the development process (all prompts, plans, and iterations traceable)
- Hackathon judge readability and verification

Key standards:
- All functionality must be derived directly from written specifications
- Each spec must have a clearly defined scope and boundaries
- RESTful API design must follow standard HTTP semantics
- Authentication must be enforced on all protected resources
- Multi-user data isolation is mandatory
- All backend logic must be testable via API documentation (Swagger/OpenAPI)

Technology constraints:
- Frontend: Next.js 16+ (App Router)
- Backend: Python FastAPI
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth
- Spec-driven workflow: Spec-Kit Plus
- Development approach: Agentic Dev Stack (no manual coding)

Architectural constraints:
- Backend and frontend must be logically separated
- Authentication and user management must exist before domain features
- All database interactions must use ORM models
- Persistent storage is required; no in-memory state
- APIs must be stateless and secure

Spec structure requirements:
- Spec 1: Backend Authentication & User Management
- Spec 2: Backend Todo System (CRUD + REST APIs)
- Spec 3: Frontend Web Application & Integration
- Each spec must be independently understandable and verifiable
- Each spec must produce a plan before any implementation

Quality standards:
- Clear, unambiguous specifications
- No hidden assumptions
- Explicit error handling and edge cases
- Consistent naming across API routes, models, and data structures

Success criteria:
- All 5 Basic Level features implemented as a web application
- Users can securely sign up and sign in
- Each user can only access their own todos
- Data persists across sessions using Neon PostgreSQL
- Frontend successfully integrates with backend APIs
- Entire development process is traceable through specs, plans, and prompts
- Project is fully reviewable and verifiable by hackathon judges
```

## RESPONSE_TEXT

Updated the project constitution and aligned all relevant templates with the new principles for the Todo Full-Stack Web Application project. Created a comprehensive constitution document that reflects the spec-driven development approach, technology stack, and governance procedures. Updated plan-template.md, spec-template.md, and tasks-template.md to incorporate constitution compliance sections. Also created a README.md file to provide project overview and reference the constitution.

## OUTCOME

The project constitution has been successfully created and all related templates have been updated to align with the new principles. The constitution establishes the foundation for spec-driven development, technology standards, and workflow governance for the Todo Full-Stack Web Application project. All templates now include constitution compliance sections to ensure adherence to the established principles throughout the development process.
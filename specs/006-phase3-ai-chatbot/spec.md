# Phase 3: Todo AI Chatbot with MCP Server

## Overview
AI-powered chatbot interface for managing todos through natural language using MCP (Model Context Protocol) server architecture.

## Live Links
- **Frontend**: https://frontend-l8jbfdhh0-alishbarehman-s-projects.vercel.app
- **Backend API**: https://alishbarehman-fullbackend.hf.space
- **GitHub**: https://github.com/Alishba526/hack2phase2fullweb

## Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | OpenAI ChatKit |
| Backend | Python FastAPI |
| AI Framework | OpenAI Agents SDK |
| MCP Server | Official MCP SDK |
| ORM | SQLModel |
| Database | Neon Serverless PostgreSQL |
| Authentication | Better Auth |

## Architecture

```
┌─────────────────┐     ┌──────────────────────────────────────────────┐     ┌─────────────────┐
│                 │     │              FastAPI Server                   │     │                 │
│                 │     │  ┌────────────────────────────────────────┐  │     │                 │
│  ChatKit UI     │────▶│  │         Chat Endpoint                  │  │     │    Neon DB      │
│  (Frontend)     │     │  │  POST /api/{user_id}/chat              │  │     │  (PostgreSQL)   │
│                 │     │  └───────────────┬────────────────────────┘  │     │                 │
│                 │     │                  │                           │     │  - tasks        │
│                 │     │                  ▼                           │     │  - conversations│
│                 │◀────│  │      OpenAI Agents SDK                 │  │     │  - messages     │
│                 │     │  │      (Agent + Runner)                  │  │     │                 │
│                 │     │  └───────────────┬────────────────────────┘  │     │                 │
│                 │     │                  │                           │     │                 │
│                 │     │                  ▼                           │     │                 │
│                 │     │  ┌────────────────────────────────────────┐  │────▶│                 │
│                 │     │  │         MCP Server                     │  │     │                 │
│                 │     │  │  (MCP Tools for Task Operations)       │  │◀────│                 │
│                 │     │  └────────────────────────────────────────┘  │     │                 │
└─────────────────┘     └──────────────────────────────────────────────┘     └─────────────────┘
```

## Database Models

### Conversation Model
```python
class Conversation(SQLModel, table=True):
    __tablename__ = "conversation"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    messages: List["Message"] = Relationship(back_populates="conversation")
```

### Message Model
```python
class Message(SQLModel, table=True):
    __tablename__ = "message"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    conversation_id: int = Field(foreign_key="conversation.id", index=True)
    role: str  # "user" or "assistant"
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    conversation: Conversation = Relationship(back_populates="messages")
```

## API Endpoints

### POST /api/{user_id}/chat
Send message and get AI response.

**Request:**
```json
{
  "conversation_id": 1,  // Optional - creates new if not provided
  "message": "Add a task to buy groceries"
}
```

**Response:**
```json
{
  "conversation_id": 1,
  "response": "I've added 'Buy groceries' to your task list!",
  "tool_calls": [
    {
      "tool": "add_task",
      "input": {"user_id": "user123", "title": "Buy groceries"},
      "output": {"task_id": 5, "status": "created", "title": "Buy groceries"}
    }
  ]
}
```

## MCP Tools Specification

### Tool: add_task
**Purpose:** Create a new task

**Parameters:**
- `user_id` (string, required)
- `title` (string, required)
- `description` (string, optional)

**Example:**
```json
Input: {"user_id": "user123", "title": "Buy groceries", "description": "Milk, eggs, bread"}
Output: {"task_id": 5, "status": "created", "title": "Buy groceries"}
```

### Tool: list_tasks
**Purpose:** Retrieve tasks from the list

**Parameters:**
- `user_id` (string, required)
- `status` (string, optional: "all", "pending", "completed")

**Example:**
```json
Input: {"user_id": "user123", "status": "pending"}
Output: [{"id": 1, "title": "Buy groceries", "completed": false}, ...]
```

### Tool: complete_task
**Purpose:** Mark a task as complete

**Parameters:**
- `user_id` (string, required)
- `task_id` (integer, required)

**Example:**
```json
Input: {"user_id": "user123", "task_id": 3}
Output: {"task_id": 3, "status": "completed", "title": "Call mom"}
```

### Tool: delete_task
**Purpose:** Remove a task from the list

**Parameters:**
- `user_id` (string, required)
- `task_id` (integer, required)

**Example:**
```json
Input: {"user_id": "user123", "task_id": 2}
Output: {"task_id": 2, "status": "deleted", "title": "Old task"}
```

### Tool: update_task
**Purpose:** Modify task title or description

**Parameters:**
- `user_id` (string, required)
- `task_id` (integer, required)
- `title` (string, optional)
- `description` (string, optional)

**Example:**
```json
Input: {"user_id": "user123", "task_id": 1, "title": "Buy groceries and fruits"}
Output: {"task_id": 1, "status": "updated", "title": "Buy groceries and fruits"}
```

## Agent Behavior

| User Says | Agent Should |
|-----------|--------------|
| "Add a task to buy groceries" | Call `add_task` with title "Buy groceries" |
| "Show me all my tasks" | Call `list_tasks` with status "all" |
| "What's pending?" | Call `list_tasks` with status "pending" |
| "Mark task 3 as complete" | Call `complete_task` with task_id 3 |
| "Delete the meeting task" | Call `list_tasks` first, then `delete_task` |
| "Change task 1 to 'Call mom tonight'" | Call `update_task` with new title |
| "I need to remember to pay bills" | Call `add_task` with title "Pay bills" |
| "What have I completed?" | Call `list_tasks` with status "completed" |

## Conversation Flow (Stateless)

1. Receive user message
2. Fetch conversation history from database
3. Build message array for agent (history + new message)
4. Store user message in database
5. Run agent with MCP tools
6. Agent invokes appropriate MCP tool(s)
7. Store assistant response in database
8. Return response to client
9. Server holds NO state (ready for next request)

## Implementation Tasks

### Task 1: Database Models
- [ ] Create Conversation model
- [ ] Create Message model
- [ ] Add database migrations
- [ ] Update existing Todo model if needed

### Task 2: MCP Server
- [ ] Set up MCP SDK
- [ ] Implement `add_task` tool
- [ ] Implement `list_tasks` tool
- [ ] Implement `complete_task` tool
- [ ] Implement `delete_task` tool
- [ ] Implement `update_task` tool
- [ ] Test MCP tools independently

### Task 3: OpenAI Agents SDK Integration
- [ ] Set up OpenAI Agents SDK
- [ ] Configure agent with MCP tools
- [ ] Implement agent behavior for natural language understanding
- [ ] Add error handling and confirmation messages

### Task 4: Chat API Endpoint
- [ ] Create POST /api/{user_id}/chat endpoint
- [ ] Implement conversation history management
- [ ] Store messages in database
- [ ] Return structured response with tool calls

### Task 5: Frontend ChatKit UI
- [ ] Set up OpenAI ChatKit
- [ ] Configure domain allowlist
- [ ] Create chat interface component
- [ ] Integrate with chat API endpoint
- [ ] Add loading states and error handling

### Task 6: Testing & Documentation
- [ ] Test end-to-end conversation flow
- [ ] Test all MCP tools
- [ ] Add API documentation
- [ ] Update README with setup instructions
- [ ] Add environment variables documentation

## Environment Variables

```bash
# OpenAI
OPENAI_API_KEY=sk-...

# Database (Neon)
DATABASE_URL=postgresql://...

# ChatKit
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=your-domain-key-here
```

## Success Criteria

- [ ] Working chatbot that manages tasks through natural language
- [ ] MCP server exposes all task operations as tools
- [ ] Agent correctly interprets and executes natural language commands
- [ ] Conversation state persisted to database (stateless server)
- [ ] ChatKit UI integrated and working
- [ ] All tests passing
- [ ] Documentation complete

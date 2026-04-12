# MzansiBuilds: Developer Project Tracker

MzansiBuilds is a full-stack web application designed for developers to track, update, and celebrate their public project builds. 

Built as part of the Derivco Code Skills Challenge, it focuses on Secure By Design principles, Test-Driven Development, and a clean, responsive user experience.

## System Architecture

The platform utilises a modern, decoupled architecture:
* **Frontend:** React (Vite) with Tailwind CSS for styling.
* **Backend:** FastAPI (Python) providing RESTful endpoints.
* **Database:** PostgreSQL managed via SQLAlchemy ORM.
* **Security:** JWT (JSON Web Tokens) and bcrypt password hashing.

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as React Frontend
    participant A as FastAPI (Auth Router)
    participant P as FastAPI (Projects Router)
    participant DB as PostgreSQL Database

    Note over U,DB: 1. Authentication Flow
    U->>F: Enters credentials
    F->>A: POST /api/auth/login (URL Encoded)
    A->>DB: Query User & Verify bcrypt hash
    DB-->>A: User valid
    A-->>F: Returns JWT Access Token
    F->>U: Saves token & redirects to Dashboard

    Note over U,DB: 2. Core Programme Flow (Projects & Milestones)
    U->>F: Clicks "+ New Project"
    F->>P: POST /api/projects (Bearer Token)
    P->>P: Validate JWT & Extract User ID
    P->>DB: Insert new Project linked to User
    DB-->>P: Confirm insertion
    P-->>F: Return created Project JSON
    F->>U: Optimistically update UI Feed
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
```

## Getting Started (Local Development)

To run MzansiBuilds locally, you will need **Python 3.10+**, **Node.js**, and **PostgreSQL** installed on your machine.

### 1. Database Setup
Ensure your local PostgreSQL server is running. Open your PostgreSQL terminal (`psql -U postgres`) and create the required database:
```sql
CREATE DATABASE mzansidb;


### 2. Backend Setup (FastAPI)
The backend requires a virtual environment and a `.env` file to securely connect to your local database.

Navigate to the backend directory:
```bash
cd src/backend
```

Create and activate a virtual environment:
```bash
# On Linux/macOS
python -m venv .backvenv
source .backvenv/bin/activate

# On Windows
python -m venv .backvenv
.backvenv\Scripts\activate
```

Install the required dependencies:
```bash
pip install -r requirements.txt
```

**Environment Variables:**
Create a `.env` file in the `src/backend` directory and add your local PostgreSQL connection string. Replace `YOUR_PASSWORD` with your actual Postgres password:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/mzansidb"
```

Start the FastAPI server:
```bash
uvicorn main:app --reload
```
*The API will be available at `http://127.0.0.1:8000` and will automatically generate the database tables on its first run.*

### 3. Frontend Setup (React/Vite)
Open a new terminal tab and navigate to the frontend directory:

```bash
cd src/frontend
```

Install the Node dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*The frontend will be available at `http://localhost:5173`. CORS is fully configured to allow communication with the backend.*

### 4. Running the Test Suite
The backend includes a robust Test-Driven Development (TDD) suite built with Pytest. To run the tests locally, ensure your virtual environment is active and run:

```bash
cd src/backend
python -m pytest
```

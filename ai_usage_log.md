# AI Usage Log: MzansiBuilds

**Candidate:** Darshan Singh\
**Project:** Derivco Code Skills Challenge\
**Date:** April 2026

## 1. AI Tools Utilised
* **Primary Assistant:** Google Gemini (v3.1 Pro)
* **Purpose:** Boilerplate scaffolding, syntax generation, debugging assistance, and Tailwind CSS configuration.

## 2. Development Workflow & AI Collaboration

The development of the MzansiBuilds platform was driven by a "Vertical Slice" methodology. I acted as the system architect, defining the requirements, data flow, and security protocols, while utilising AI to accelerate the writing of boilerplate code and configuration files.

### 2.1 System Architecture & Database Design
* **My Role:** I determined the relational structure between Users, Projects, and Milestones, ensuring the database could support a secure community feed and a dedicated Celebration Wall. I also mandated the use of PostgreSQL and SQLAlchemy.
* **AI Assistance:** I prompted the AI to generate the specific SQLAlchemy models and Pydantic V2 schemas based on my structural requirements, ensuring strict typing and validation.

### 2.2 Security Implementation (Secure By Design)
* **My Role:** I identified the need for a robust, stateless authentication system using JWTs and bcrypt hashing to meet the assessment's security criteria. I also strictly enforced the use of `.env` files to prevent credential leakage in version control.
* **AI Assistance:** The AI provided the specific `python-jose` implementation for signing the JWTs and the FastAPI `OAuth2PasswordBearer` dependency logic. 

### 2.3 Debugging & Problem Solving
During development, the AI served as an effective sounding board for troubleshooting:
* **CORS Configuration:** When connecting the Vite frontend to the FastAPI backend, the browser blocked preflight requests. I used the AI to quickly generate the precise `CORSMiddleware` configuration required for FastAPI to accept traffic from `localhost:5173`.
* **OAuth2 Form Data:** When integrating the Swagger UI testing suite, a `422 Unprocessable Entity` error occurred due to a mismatch between JSON and URL-encoded form data. We collaborated to refactor the React API service to use `URLSearchParams` to satisfy the strict OAuth2 standard.

### 2.4 UI/UX Development
* **My Role:** I established the design language (Mzansi black, white, and green) and the user flow, deciding on the use of modal overlays for project creation to maintain a seamless experience on the community feed.
* **AI Assistance:** I leveraged the AI to rapidly generate the Tailwind CSS class strings for the React components, including the conditional rendering logic for the owner-specific "+ Add Milestone" buttons and the Celebration Wall masonry layout.

## 3. Reflection
Utilising AI significantly accelerated the development timeline, allowing me to focus on high-level architectural decisions, test-driven development, and ensuring the application met Derivco's strict core competencies. All generated code was manually reviewed, tested via Pytest, and integrated by me to ensure platform stability and security.
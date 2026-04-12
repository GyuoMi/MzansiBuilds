from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import auth, projects

# Generate the database tables based on our SQLAlchemy models
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MzansiBuilds API",
    description="Backend for the MzansiBuilds public build viewer",
    version="1.0.0"
)

# Configure CORS (Cross-Origin Resource Sharing)
# Vite usually runs on port 5173. We allow both localhost and 127.0.0.1 to be safe.
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"], # Allows all headers
)

# Include our authentication endpoints
app.include_router(auth.router)
app.include_router(projects.router)

@app.get("/")
def read_root():
    return {"message": "MzansiBuilds API is running securely"}
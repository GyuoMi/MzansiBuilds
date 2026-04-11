from fastapi import FastAPI
from database import engine
import models
from routers import auth

# Generate the database tables based on our SQLAlchemy models
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MzansiBuilds API",
    description="Backend for the MzansiBuilds public build viewer",
    version="1.0.0"
)

# Include our authentication endpoints
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "MzansiBuilds API is running securely"}
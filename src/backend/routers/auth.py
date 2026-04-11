from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import models, schemas, security
from database import get_db

# create a router instance
router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(
        (models.User.email == user.email) | (models.User.username == user.username)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email or username already registered"
        )

    # hash plaintext 
    hashed_pw = security.get_password_hash(user.password)

    # create db model by passing hash + ...
    new_user = models.User(
        email=user.email, 
        username=user.username, 
        hashed_password=hashed_pw
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user) # Retrieves the newly generated ID and created_at timestamp

    # 5. Return the user (FastAPI automatically filters this through schemas.UserResponse)
    return new_user
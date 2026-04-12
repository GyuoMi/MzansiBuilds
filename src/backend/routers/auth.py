from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
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

    # return the user (FastAPI automatically filters this through schemas.UserResponse)
    return new_user

@router.post("/login", response_model=schemas.Token)
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
    # query via email but the OAuth2 standard names the form as 'username'
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    
    # check if user exists AND password is correct
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # gen JWT to embed user ID inside token payload
    access_token = security.create_access_token(data={"user_id": user.id})

    return {"access_token": access_token, "token_type": "bearer"}
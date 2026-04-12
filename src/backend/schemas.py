from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import List, Optional

# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    username: str

# Properties to receive via API on creation (includes plain text password from the React form)
class UserCreate(UserBase):
    password: str

# Properties to return via API (excludes the password)
class UserResponse(UserBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# --- MILESTONE SCHEMAS ---
class MilestoneBase(BaseModel):
    title: str
    description: Optional[str] = None

class MilestoneCreate(MilestoneBase):
    pass

class MilestoneResponse(MilestoneBase):
    id: int
    project_id: int
    achieved_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# --- PROJECT SCHEMAS ---
class ProjectBase(BaseModel):
    title: str
    description: str
    stage: str
    support_required: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int
    owner_id: int
    is_completed: bool
    created_at: datetime
    # upon fetch, view milestones nested inside it
    milestones: List[MilestoneResponse] = []
    
    model_config = ConfigDict(from_attributes=True)
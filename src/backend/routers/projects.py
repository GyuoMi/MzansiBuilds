from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db
from dependencies import get_current_user

router = APIRouter(
    prefix="/api/projects",
    tags=["Projects"]
)

@router.post("/", response_model=schemas.ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project: schemas.ProjectCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user) # Injects the logged-in user!
):
    # Unpack the Pydantic model and assign the owner ID automatically
    new_project = models.Project(**project.model_dump(), owner_id=current_user.id)
    
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

@router.get("/", response_model=List[schemas.ProjectResponse])
def get_all_projects(db: Session = Depends(get_db)):
    # Fetch all projects for the community feed, newest first
    projects = db.query(models.Project).order_by(models.Project.created_at.desc()).all()
    return projects

@router.post("/{project_id}/milestones", response_model=schemas.MilestoneResponse, status_code=status.HTTP_201_CREATED)
def add_milestone(
    project_id: int, 
    milestone: schemas.MilestoneCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    # 1. Verify the project actually exists
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    # 2. Security Check: Ensure the user owns this project before they can update it
    if project.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Not authorised to add milestones to this project"
        )
        
    # 3. Save the milestone
    new_milestone = models.Milestone(**milestone.model_dump(), project_id=project_id)
    db.add(new_milestone)
    db.commit()
    db.refresh(new_milestone)
    return new_milestone

@router.patch("/{project_id}/complete", response_model=schemas.ProjectResponse)
def complete_project(
    project_id: int, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    # 1. Find the project
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    # 2. Security Check: Only the owner can mark it complete
    if project.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Not authorised to update this project"
        )
        
    # 3. Update the flags
    project.is_completed = True
    project.stage = "Completed" # Automatically sync the stage text for the UI
    
    db.commit()
    db.refresh(project)
    
    return project
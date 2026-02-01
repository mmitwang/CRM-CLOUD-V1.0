from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.crud.user import get_users, get_user, create_user, update_user, delete_user
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("", response_model=List[UserResponse])
def get_users_list(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    users = get_users(db, company_id=current_user.company_id, skip=skip, limit=limit)
    return users

@router.get("/{user_id}", response_model=UserResponse)
def get_user_detail(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = get_user(db, user_id=user_id, company_id=current_user.company_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user_endpoint(
    user: UserCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_user(db=db, user=user, company_id=current_user.company_id)

@router.put("/{user_id}", response_model=UserResponse)
def update_user_endpoint(
    user_id: int, 
    user: UserUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_user = get_user(db, user_id=user_id, company_id=current_user.company_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return update_user(db=db, user_id=user_id, user=user, company_id=current_user.company_id)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_endpoint(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_user = get_user(db, user_id=user_id, company_id=current_user.company_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    delete_user(db=db, user_id=user_id, company_id=current_user.company_id)
    return None

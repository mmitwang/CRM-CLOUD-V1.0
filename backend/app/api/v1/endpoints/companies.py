from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.company import CompanyCreate, CompanyUpdate, CompanyResponse, CompanyList
from app.crud.user import get_companies, get_company, create_company, update_company, delete_company
from app.auth.dependencies import get_current_admin_user
from app.models.user import User

router = APIRouter()

@router.get("", response_model=List[CompanyList])
def get_companies_list(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    companies = get_companies(db, skip=skip, limit=limit)
    return companies

@router.get("/{company_id}", response_model=CompanyResponse)
def get_company_detail(
    company_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    company = get_company(db, company_id=company_id)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    return company

@router.post("", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
def create_company_endpoint(
    company: CompanyCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    return create_company(db=db, company=company)

@router.put("/{company_id}", response_model=CompanyResponse)
def update_company_endpoint(
    company_id: int, 
    company: CompanyUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    db_company = get_company(db, company_id=company_id)
    if not db_company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    return update_company(db=db, company_id=company_id, company=company)

@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_company_endpoint(
    company_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    db_company = get_company(db, company_id=company_id)
    if not db_company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    delete_company(db=db, company_id=company_id)
    return None
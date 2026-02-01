from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerResponse
from app.crud.customer import get_customers, get_customer, create_customer, update_customer, delete_customer
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("", response_model=List[CustomerResponse])
def get_customers_list(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    customers = get_customers(db, company_id=current_user.company_id, skip=skip, limit=limit)
    return customers

@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer_detail(
    customer_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    customer = get_customer(db, customer_id=customer_id, company_id=current_user.company_id)
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    return customer

@router.post("", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer_endpoint(
    customer: CustomerCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_customer(db=db, customer=customer, company_id=current_user.company_id)

@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer_endpoint(
    customer_id: int, 
    customer: CustomerUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_customer = get_customer(db, customer_id=customer_id, company_id=current_user.company_id)
    if not db_customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    return update_customer(db=db, customer_id=customer_id, customer=customer, company_id=current_user.company_id)

@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer_endpoint(
    customer_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_customer = get_customer(db, customer_id=customer_id, company_id=current_user.company_id)
    if not db_customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    delete_customer(db=db, customer_id=customer_id, company_id=current_user.company_id)
    return None

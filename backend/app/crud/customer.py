from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate

def get_customer(db: Session, customer_id: int, company_id: int) -> Optional[Customer]:
    return db.query(Customer).filter(Customer.id == customer_id, Customer.company_id == company_id).first()

def get_customers(db: Session, company_id: int, skip: int = 0, limit: int = 100) -> List[Customer]:
    return db.query(Customer).filter(Customer.company_id == company_id).offset(skip).limit(limit).all()

def create_customer(db: Session, customer: CustomerCreate, company_id: int) -> Customer:
    db_customer = Customer(**customer.model_dump(), company_id=company_id)
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def update_customer(db: Session, customer_id: int, customer: CustomerUpdate, company_id: int) -> Customer:
    db_customer = get_customer(db, customer_id=customer_id, company_id=company_id)
    if not db_customer:
        return None
    
    update_data = customer.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_customer, field, value)
    
    db.commit()
    db.refresh(db_customer)
    return db_customer

def delete_customer(db: Session, customer_id: int, company_id: int) -> bool:
    db_customer = get_customer(db, customer_id=customer_id, company_id=company_id)
    if not db_customer:
        return False
    
    db.delete(db_customer)
    db.commit()
    return True

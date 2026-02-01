from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.user import User, Company
from app.schemas.user import UserCreate, UserUpdate
from app.schemas.company import CompanyCreate, CompanyUpdate
from app.utils.security import get_password_hash

# 公司相关操作
def get_company(db: Session, company_id: int) -> Optional[Company]:
    return db.query(Company).filter(Company.id == company_id).first()

def get_company_by_code(db: Session, code: str) -> Optional[Company]:
    return db.query(Company).filter(Company.code == code).first()

def get_companies(db: Session, skip: int = 0, limit: int = 100) -> List[Company]:
    return db.query(Company).offset(skip).limit(limit).all()

def create_company(db: Session, company: CompanyCreate) -> Company:
    db_company = Company(**company.model_dump())
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company

def update_company(db: Session, company_id: int, company: CompanyUpdate) -> Company:
    db_company = get_company(db, company_id=company_id)
    if not db_company:
        return None
    
    update_data = company.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_company, field, value)
    
    db.commit()
    db.refresh(db_company)
    return db_company

def delete_company(db: Session, company_id: int) -> bool:
    db_company = get_company(db, company_id=company_id)
    if not db_company:
        return False
    
    db.delete(db_company)
    db.commit()
    return True

# 用户相关操作（多租户支持）
def get_user(db: Session, user_id: int, company_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id, User.company_id == company_id).first()

def get_user_by_email(db: Session, email: str, company_id: int) -> Optional[User]:
    return db.query(User).filter(User.email == email, User.company_id == company_id).first()

def get_users(db: Session, company_id: int, skip: int = 0, limit: int = 100) -> List[User]:
    return db.query(User).filter(User.company_id == company_id).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate, company_id: int) -> User:
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        password=hashed_password,
        name=user.name,
        role=user.role,
        company_id=company_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user: UserUpdate, company_id: int) -> User:
    db_user = get_user(db, user_id=user_id, company_id=company_id)
    if not db_user:
        return None
    
    update_data = user.model_dump(exclude_unset=True)
    if "password" in update_data:
        update_data["password"] = get_password_hash(update_data["password"])
    
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int, company_id: int) -> bool:
    db_user = get_user(db, user_id=user_id, company_id=company_id)
    if not db_user:
        return False
    
    db.delete(db_user)
    db.commit()
    return True

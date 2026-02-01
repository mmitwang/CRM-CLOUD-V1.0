from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import settings
from app.schemas.auth import Token, TokenData, UserLogin, UserRegister, UserResponse
from app.crud.user import get_user_by_email, create_user
from app.utils.security import verify_password, create_access_token
from app.auth.dependencies import get_current_active_user
from app.models.user import User
from datetime import timedelta

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # 从表单数据中提取公司代码和邮箱
    # 格式: email@company_code
    username_parts = form_data.username.split('@')
    if len(username_parts) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username format: email@company_code"
        )
    
    email = '@'.join(username_parts[:-1])
    company_code = username_parts[-1]
    
    # 先查找公司
    from app.crud.user import get_company_by_code
    company = get_company_by_code(db, company_code)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Company not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 查找用户
    user = get_user_by_email(db, email, company.id)
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 创建包含公司ID的token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "company_id": user.company_id},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=UserResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    # 从邮箱中提取公司代码
    email_parts = user_data.email.split('@')
    if len(email_parts) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email format: user@company_code"
        )
    
    company_code = email_parts[-1]
    
    # 查找公司
    from app.crud.user import get_company_by_code
    company = get_company_by_code(db, company_code)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Company not found"
        )
    
    # 检查用户是否已存在
    db_user = get_user_by_email(db, user_data.email, company.id)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # 创建用户
    new_user = create_user(db=db, user=user_data, company_id=company.id)
    return new_user

@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    return current_user

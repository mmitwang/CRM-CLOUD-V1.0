from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class CompanyBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    code: str = Field(..., min_length=1, max_length=50, description="公司代码，必须唯一")
    contact_person: Optional[str] = Field(None, max_length=50)
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[EmailStr] = None
    address: Optional[str] = Field(None, max_length=200)
    status: Optional[str] = Field("active", description="公司状态：active/inactive")

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    code: Optional[str] = Field(None, min_length=1, max_length=50)
    contact_person: Optional[str] = Field(None, max_length=50)
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[EmailStr] = None
    address: Optional[str] = Field(None, max_length=200)
    status: Optional[str] = Field(None, description="公司状态：active/inactive")

class CompanyResponse(CompanyBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class CompanyList(BaseModel):
    id: int
    name: str
    code: str
    contact_person: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True
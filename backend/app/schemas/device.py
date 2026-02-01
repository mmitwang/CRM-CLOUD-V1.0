from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DeviceBase(BaseModel):
    device_id: str
    name: str
    model: Optional[str] = None
    serial_number: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = "offline"
    type: Optional[str] = "meter"
    customer_id: int

class DeviceCreate(DeviceBase):
    pass

class DeviceUpdate(BaseModel):
    name: Optional[str] = None
    model: Optional[str] = None
    serial_number: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None
    customer_id: Optional[int] = None

class DeviceResponse(DeviceBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

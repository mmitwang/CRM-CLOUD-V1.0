from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.device import Device
from app.schemas.device import DeviceCreate, DeviceUpdate

def get_device(db: Session, device_id: int, company_id: int) -> Optional[Device]:
    return db.query(Device).filter(Device.id == device_id, Device.company_id == company_id).first()

def get_devices(db: Session, company_id: int, skip: int = 0, limit: int = 100) -> List[Device]:
    return db.query(Device).filter(Device.company_id == company_id).offset(skip).limit(limit).all()

def create_device(db: Session, device: DeviceCreate, company_id: int) -> Device:
    db_device = Device(**device.model_dump(), company_id=company_id)
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device

def update_device(db: Session, device_id: int, device: DeviceUpdate, company_id: int) -> Device:
    db_device = get_device(db, device_id=device_id, company_id=company_id)
    if not db_device:
        return None
    
    update_data = device.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_device, field, value)
    
    db.commit()
    db.refresh(db_device)
    return db_device

def delete_device(db: Session, device_id: int, company_id: int) -> bool:
    db_device = get_device(db, device_id=device_id, company_id=company_id)
    if not db_device:
        return False
    
    db.delete(db_device)
    db.commit()
    return True

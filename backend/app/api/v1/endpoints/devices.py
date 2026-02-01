from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.device import DeviceCreate, DeviceUpdate, DeviceResponse
from app.crud.device import get_devices, get_device, create_device, update_device, delete_device
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("", response_model=List[DeviceResponse])
def get_devices_list(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    devices = get_devices(db, company_id=current_user.company_id, skip=skip, limit=limit)
    return devices

@router.get("/{device_id}", response_model=DeviceResponse)
def get_device_detail(
    device_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    device = get_device(db, device_id=device_id, company_id=current_user.company_id)
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found"
        )
    return device

@router.post("", response_model=DeviceResponse, status_code=status.HTTP_201_CREATED)
def create_device_endpoint(
    device: DeviceCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_device(db=db, device=device, company_id=current_user.company_id)

@router.put("/{device_id}", response_model=DeviceResponse)
def update_device_endpoint(
    device_id: int, 
    device: DeviceUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_device = get_device(db, device_id=device_id, company_id=current_user.company_id)
    if not db_device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found"
        )
    return update_device(db=db, device_id=device_id, device=device, company_id=current_user.company_id)

@router.delete("/{device_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_device_endpoint(
    device_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_device = get_device(db, device_id=device_id, company_id=current_user.company_id)
    if not db_device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found"
        )
    delete_device(db=db, device_id=device_id, company_id=current_user.company_id)
    return None

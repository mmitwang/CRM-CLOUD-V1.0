from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.device import Device
from app.schemas.device import Device as DeviceSchema, DeviceCreate, DeviceUpdate
from app.auth.dependencies import get_current_user

router = APIRouter()


@router.get("/", response_model=List[DeviceSchema])
def read_devices(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    device_type: Optional[str] = Query(None, description="按设备类型过滤"),
    status: Optional[str] = Query(None, description="按状态过滤"),
    customer_id: Optional[int] = Query(None, description="按客户ID过滤"),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取设备列表"""
    query = db.query(Device)
    
    # 应用过滤条件
    if device_type:
        query = query.filter(Device.device_type == device_type)
    if status:
        query = query.filter(Device.status == status)
    if customer_id:
        query = query.filter(Device.customer_id == customer_id)
    
    devices = query.offset(skip).limit(limit).all()
    return devices


@router.post("/", response_model=DeviceSchema, status_code=status.HTTP_201_CREATED)
def create_device(
    device: DeviceCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """创建新设备"""
    # 检查序列号是否已存在
    existing_device = db.query(Device).filter(
        Device.serial_number == device.serial_number
    ).first()
    if existing_device:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Serial number already exists"
        )
    
    db_device = Device(**device.model_dump())
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device


@router.get("/{device_id}", response_model=DeviceSchema)
def read_device(
    device_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取设备详情"""
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found"
        )
    return device


@router.put("/{device_id}", response_model=DeviceSchema)
def update_device(
    device_id: int,
    device_update: DeviceUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新设备信息"""
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found"
        )
    
    # 如果更新序列号，检查是否已存在
    if device_update.serial_number and device_update.serial_number != device.serial_number:
        existing_device = db.query(Device).filter(
            Device.serial_number == device_update.serial_number
        ).first()
        if existing_device:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Serial number already exists"
            )
    
    # 更新设备信息
    update_data = device_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(device, field, value)
    
    db.commit()
    db.refresh(device)
    return device


@router.delete("/{device_id}", response_model=dict)
def delete_device(
    device_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """删除设备"""
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found"
        )
    
    db.delete(device)
    db.commit()
    return {"message": "Device deleted successfully"}

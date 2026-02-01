from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Device(Base):
    __tablename__ = "devices"
    
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    model = Column(String)
    serial_number = Column(String, index=True)
    location = Column(String)
    status = Column(String, default="offline")
    type = Column(String, default="meter")
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # 关系
    customer = relationship("Customer", back_populates="devices")
    company = relationship("Company")

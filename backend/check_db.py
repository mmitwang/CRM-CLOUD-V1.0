from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
import sys
import os

# Add the project root to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import models
from app.models.user import User, Company
from app.models.customer import Customer
from app.models.device import Device
from app.core.config import settings

# Create database engine
engine = create_engine(settings.SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def check_database():
    print('=== 检查数据库结构 ===')
    
    # Inspect database structure
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f'数据库表: {tables}')
    
    # Check each table structure
    for table in tables:
        print(f'\n=== 表: {table} ===')
        columns = inspector.get_columns(table)
        for column in columns:
            print(f'  {column["name"]} ({column["type"]})')
    
    print('\n=== 检查现有数据 ===')
    db = SessionLocal()
    
    try:
        # Check companies
        companies = db.query(Company).all()
        print(f'公司数量: {len(companies)}')
        for company in companies:
            print(f'  公司: {company.name} (code: {company.code}, id: {company.id})')
        
        # Check users
        users = db.query(User).all()
        print(f'\n用户数量: {len(users)}')
        for user in users:
            company_name = db.query(Company).filter(Company.id == user.company_id).first().name if user.company_id else '无'
            print(f'  用户: {user.name} (email: {user.email}, company: {company_name}, role: {user.role})')
        
        # Check customers
        customers = db.query(Customer).all()
        print(f'\n客户数量: {len(customers)}')
        for customer in customers[:5]:  # Show first 5 customers
            company_name = db.query(Company).filter(Company.id == customer.company_id).first().name if customer.company_id else '无'
            print(f'  客户: {customer.name} (company: {company_name}, id: {customer.id})')
        if len(customers) > 5:
            print(f'  ... 还有 {len(customers) - 5} 个客户')
        
        # Check devices
        devices = db.query(Device).all()
        print(f'\n设备数量: {len(devices)}')
        for device in devices[:5]:  # Show first 5 devices
            company_name = db.query(Company).filter(Company.id == device.company_id).first().name if device.company_id else '无'
            print(f'  设备: {device.name} (company: {company_name}, id: {device.id})')
        if len(devices) > 5:
            print(f'  ... 还有 {len(devices) - 5} 个设备')
    finally:
        db.close()

if __name__ == '__main__':
    check_database()

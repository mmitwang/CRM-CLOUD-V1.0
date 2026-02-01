from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
import os
from datetime import datetime

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

def add_test_data():
    print('=== 添加测试数据 ===')
    db = SessionLocal()
    
    try:
        # Get all companies
        companies = db.query(Company).all()
        print(f'找到 {len(companies)} 个公司')
        
        # 为每个公司添加客户和设备
        for company in companies:
            print(f'\n为公司: {company.name} (code: {company.code}) 添加测试数据')
            
            # 检查现有客户数量
            existing_customers = db.query(Customer).filter(Customer.company_id == company.id).count()
            print(f'现有客户数量: {existing_customers}')
            
            # 检查现有设备数量
            existing_devices = db.query(Device).filter(Device.company_id == company.id).count()
            print(f'现有设备数量: {existing_devices}')
            
            # 为每个公司添加5个客户
            customer_data = [
                {
                    'name': f'{company.name} 客户1',
                    'industry': '电力设备制造',
                    'contact_person': '张三',
                    'phone': '13800138001',
                    'email': f'customer1@{company.code.lower()}.com',
                    'address': '上海市浦东新区张江高科技园区',
                    'status': 'active'
                },
                {
                    'name': f'{company.name} 客户2',
                    'industry': '电气安装',
                    'contact_person': '李四',
                    'phone': '13800138002',
                    'email': f'customer2@{company.code.lower()}.com',
                    'address': '北京市海淀区中关村科技园区',
                    'status': 'active'
                },
                {
                    'name': f'{company.name} 客户3',
                    'industry': '电力供应',
                    'contact_person': '王五',
                    'phone': '13800138003',
                    'email': f'customer3@{company.code.lower()}.com',
                    'address': '广州市天河区珠江新城',
                    'status': 'active'
                },
                {
                    'name': f'{company.name} 客户4',
                    'industry': '新能源',
                    'contact_person': '赵六',
                    'phone': '13800138004',
                    'email': f'customer4@{company.code.lower()}.com',
                    'address': '深圳市南山区科技园',
                    'status': 'inactive'
                },
                {
                    'name': f'{company.name} 客户5',
                    'industry': '工业自动化',
                    'contact_person': '钱七',
                    'phone': '13800138005',
                    'email': f'customer5@{company.code.lower()}.com',
                    'address': '杭州市西湖区滨江科技园区',
                    'status': 'active'
                }
            ]
            
            # 添加客户
            new_customers = 0
            for customer_info in customer_data:
                # 检查客户是否已存在
                existing_customer = db.query(Customer).filter(
                    Customer.company_id == company.id,
                    Customer.email == customer_info['email']
                ).first()
                
                if not existing_customer:
                    customer = Customer(
                        name=customer_info['name'],
                        industry=customer_info['industry'],
                        contact_person=customer_info['contact_person'],
                        phone=customer_info['phone'],
                        email=customer_info['email'],
                        address=customer_info['address'],
                        status=customer_info['status'],
                        company_id=company.id,
                        created_at=datetime.utcnow(),
                        updated_at=datetime.utcnow()
                    )
                    db.add(customer)
                    new_customers += 1
            
            db.commit()
            print(f'新增客户数量: {new_customers}')
            
            # 获取刚添加的客户
            company_customers = db.query(Customer).filter(Customer.company_id == company.id).all()
            print(f'现在客户数量: {len(company_customers)}')
            
            # 为每个客户添加3个设备
            device_models = ['配电柜', '电表', '变压器', '开关', '电缆']
            new_devices = 0
            
            for customer in company_customers:
                for i in range(3):
                    device_model = device_models[i % len(device_models)]
                    device_name = f'{device_model} {customer.name} {i+1}'
                    serial_number = f'{company.code}{customer.id}{i+1:03d}'
                    
                    # 检查设备是否已存在
                    existing_device = db.query(Device).filter(
                        Device.company_id == company.id,
                        Device.serial_number == serial_number
                    ).first()
                    
                    if not existing_device:
                        device = Device(
                            name=device_name,
                            model=device_model,
                            serial_number=serial_number,
                            location=f'{customer.address} 车间{i+1}',
                            status='active' if i % 2 == 0 else 'maintenance',
                            customer_id=customer.id,
                            company_id=company.id,
                            created_at=datetime.utcnow(),
                            updated_at=datetime.utcnow()
                        )
                        db.add(device)
                        new_devices += 1
            
            db.commit()
            print(f'新增设备数量: {new_devices}')
            
            # 检查最终设备数量
            final_devices = db.query(Device).filter(Device.company_id == company.id).count()
            print(f'现在设备数量: {final_devices}')
        
        print('\n=== 测试数据添加完成 ===')
        
        # 检查总数据量
        total_companies = db.query(Company).count()
        total_customers = db.query(Customer).count()
        total_devices = db.query(Device).count()
        total_users = db.query(User).count()
        
        print(f'\n总数据量:')
        print(f'公司: {total_companies}')
        print(f'用户: {total_users}')
        print(f'客户: {total_customers}')
        print(f'设备: {total_devices}')
        
    except Exception as e:
        print(f'添加测试数据时出错: {e}')
        db.rollback()
    finally:
        db.close()

if __name__ == '__main__':
    add_test_data()

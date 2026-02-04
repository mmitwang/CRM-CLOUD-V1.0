from app.core.database import engine, Base, SessionLocal
from app.models.user import User, Company
from app.models.customer import Customer
from app.models.device import Device
from app.utils.security import get_password_hash
from datetime import datetime

# 创建所有表
Base.metadata.create_all(bind=engine)

# 创建测试数据
db = SessionLocal()
try:
    # 确保数据库表存在
    print("确保数据库表存在...")
    Base.metadata.create_all(bind=engine)
    print("数据库表检查完成")
    
    # 检查并创建默认公司
    default_company = db.query(Company).filter(Company.code == "DEFAULT").first()
    if not default_company:
        # 创建默认公司
        default_company = Company(
            name="默认公司",
            code="DEFAULT",
            contact_person="管理员",
            phone="13800138000",
            email="admin@default.com",
            address="北京市朝阳区"
        )
        db.add(default_company)
        print("创建默认公司：默认公司 (DEFAULT)")
    
    # 检查并创建测试公司1
    test1_company = db.query(Company).filter(Company.code == "TEST1").first()
    if not test1_company:
        # 创建测试公司1
        test1_company = Company(
            name="测试公司1",
            code="TEST1",
            contact_person="测试管理员1",
            phone="13800138001",
            email="admin@test1.com",
            address="上海市浦东新区"
        )
        db.add(test1_company)
        print("创建测试公司1：测试公司1 (TEST1)")
    
    # 检查并创建测试公司2
    test2_company = db.query(Company).filter(Company.code == "TEST2").first()
    if not test2_company:
        # 创建测试公司2
        test2_company = Company(
            name="测试公司2",
            code="TEST2",
            contact_person="测试管理员2",
            phone="13800138002",
            email="admin@test2.com",
            address="广州市天河区"
        )
        db.add(test2_company)
        print("创建测试公司2：测试公司2 (TEST2)")
    
    # 提交公司创建，获取公司ID
    db.commit()
    db.refresh(default_company)
    if test1_company:
        db.refresh(test1_company)
    if test2_company:
        db.refresh(test2_company)
    
    # 检查并创建默认公司的管理员用户
    admin_default = db.query(User).filter(User.email == "admin@default.com").first()
    if not admin_default:
        # 创建默认公司的管理员用户
        admin_default = User(
            email="admin@default.com",
            password=get_password_hash("123456"),
            name="默认管理员",
            role="admin",
            company_id=default_company.id
        )
        db.add(admin_default)
        print("创建默认公司管理员：admin@default.com / 123456")
    
    # 检查并创建默认公司的普通用户
    user_default = db.query(User).filter(User.email == "user@default.com").first()
    if not user_default:
        # 创建默认公司的普通用户
        user_default = User(
            email="user@default.com",
            password=get_password_hash("123456"),
            name="默认普通用户",
            role="user",
            company_id=default_company.id
        )
        db.add(user_default)
        print("创建默认公司普通用户：user@default.com / 123456")
    
    # 检查并创建默认登录用户
    test_default = db.query(User).filter(User.email == "test@default.com").first()
    if not test_default:
        # 创建默认登录用户
        test_default = User(
            email="test@default.com",
            password=get_password_hash("123456"),
            name="默认测试用户",
            role="user",
            company_id=default_company.id
        )
        db.add(test_default)
        print("创建默认登录用户：test@default.com / 123456")
    
    # 检查并创建测试公司1的管理员用户
    if test1_company:
        admin_test1 = db.query(User).filter(User.email == "admin@test1.com").first()
        if not admin_test1:
            # 创建测试公司1的管理员用户
            admin_test1 = User(
                email="admin@test1.com",
                password=get_password_hash("123456"),
                name="测试管理员1",
                role="admin",
                company_id=test1_company.id
            )
            db.add(admin_test1)
            print("创建测试公司1管理员：admin@test1.com / 123456")
        
        # 检查并创建测试公司1的普通用户
        user_test1 = db.query(User).filter(User.email == "user@test1.com").first()
        if not user_test1:
            # 创建测试公司1的普通用户
            user_test1 = User(
                email="user@test1.com",
                password=get_password_hash("123456"),
                name="测试普通用户1",
                role="user",
                company_id=test1_company.id
            )
            db.add(user_test1)
            print("创建测试公司1普通用户：user@test1.com / 123456")
    
    # 检查并创建测试公司2的管理员用户
    if test2_company:
        admin_test2 = db.query(User).filter(User.email == "admin@test2.com").first()
        if not admin_test2:
            # 创建测试公司2的管理员用户
            admin_test2 = User(
                email="admin@test2.com",
                password=get_password_hash("123456"),
                name="测试管理员2",
                role="admin",
                company_id=test2_company.id
            )
            db.add(admin_test2)
            print("创建测试公司2管理员：admin@test2.com / 123456")
        
        # 检查并创建测试公司2的普通用户
        user_test2 = db.query(User).filter(User.email == "user@test2.com").first()
        if not user_test2:
            # 创建测试公司2的普通用户
            user_test2 = User(
                email="user@test2.com",
                password=get_password_hash("123456"),
                name="测试普通用户2",
                role="user",
                company_id=test2_company.id
            )
            db.add(user_test2)
            print("创建测试公司2普通用户：user@test2.com / 123456")
    
    # 为默认公司添加测试客户
    if default_company:
        # 检查是否已有客户数据
        customer_count = db.query(Customer).filter(Customer.company_id == default_company.id).count()
        if customer_count == 0:
            # 创建测试客户
            test_customers = [
                Customer(
                    name="北京电力设备有限公司",
                    contact_person="张三",
                    phone="13900139001",
                    email="zhangsan@beijing-power.com",
                    address="北京市海淀区",
                    company_id=default_company.id
                ),
                Customer(
                    name="上海电气集团有限公司",
                    contact_person="李四",
                    phone="13900139002",
                    email="lisi@shanghai-electric.com",
                    address="上海市徐汇区",
                    company_id=default_company.id
                ),
                Customer(
                    name="广州供电局",
                    contact_person="王五",
                    phone="13900139003",
                    email="wangwu@guangzhou-power.com",
                    address="广州市越秀区",
                    company_id=default_company.id
                )
            ]
            db.add_all(test_customers)
            print(f"为默认公司添加{len(test_customers)}个测试客户")
    
    # 为默认公司添加测试设备
    if default_company:
        # 先获取默认公司的客户
        customers = db.query(Customer).filter(Customer.company_id == default_company.id).all()
        if customers:
            # 检查是否已有设备数据
            device_count = db.query(Device).filter(Device.company_id == default_company.id).count()
            if device_count == 0:
                # 创建测试设备
                test_devices = [
                    Device(
                        device_id="DEV-001",
                        serial_number="DEV-001",
                        name="配电柜 A-001",
                        model="配电柜",
                        status="online",
                        customer_id=customers[0].id,
                        location="北京市海淀区工厂车间",
                        company_id=default_company.id
                    ),
                    Device(
                        device_id="DEV-002",
                        serial_number="DEV-002",
                        name="变压器 B-001",
                        model="变压器",
                        status="online",
                        customer_id=customers[0].id,
                        location="北京市海淀区变电站",
                        company_id=default_company.id
                    ),
                    Device(
                        device_id="DEV-003",
                        serial_number="DEV-003",
                        name="电表 C-001",
                        model="电表",
                        status="offline",
                        customer_id=customers[1].id,
                        location="上海市徐汇区办公楼",
                        company_id=default_company.id
                    ),
                    Device(
                        device_id="DEV-004",
                        serial_number="DEV-004",
                        name="配电柜 A-002",
                        model="配电柜",
                        status="online",
                        customer_id=customers[2].id,
                        location="广州市越秀区商业区",
                        company_id=default_company.id
                    )
                ]
                db.add_all(test_devices)
                print(f"为默认公司添加{len(test_devices)}个测试设备")
    
    # 为测试公司1添加测试客户
    if test1_company:
        # 检查是否已有客户数据
        customer_count = db.query(Customer).filter(Customer.company_id == test1_company.id).count()
        if customer_count == 0:
            # 创建测试客户
            test_customers = [
                Customer(
                    name="上海电力设备厂",
                    contact_person="赵六",
                    phone="13900139004",
                    email="zhaoliu@shanghai-power.com",
                    address="上海市浦东新区",
                    company_id=test1_company.id
                ),
                Customer(
                    name="江苏电气有限公司",
                    contact_person="钱七",
                    phone="13900139005",
                    email="qianqi@jiangsu-electric.com",
                    address="江苏省南京市",
                    company_id=test1_company.id
                )
            ]
            db.add_all(test_customers)
            print(f"为测试公司1添加{len(test_customers)}个测试客户")
    
    # 为测试公司1添加测试设备
    if test1_company:
        # 先获取测试公司1的客户
        customers = db.query(Customer).filter(Customer.company_id == test1_company.id).all()
        if customers:
            # 检查是否已有设备数据
            device_count = db.query(Device).filter(Device.company_id == test1_company.id).count()
            if device_count == 0:
                # 创建测试设备
                test_devices = [
                    Device(
                        device_id="TEST1-DEV-001",
                        serial_number="TEST1-DEV-001",
                        name="配电柜 T1-A-001",
                        model="配电柜",
                        status="online",
                        customer_id=customers[0].id,
                        location="上海市浦东新区工厂",
                        company_id=test1_company.id
                    ),
                    Device(
                        device_id="TEST1-DEV-002",
                        serial_number="TEST1-DEV-002",
                        name="电表 T1-C-001",
                        model="电表",
                        status="online",
                        customer_id=customers[1].id,
                        location="江苏省南京市办公楼",
                        company_id=test1_company.id
                    )
                ]
                db.add_all(test_devices)
                print(f"为测试公司1添加{len(test_devices)}个测试设备")
    
    # 为测试公司2添加测试客户
    if test2_company:
        # 检查是否已有客户数据
        customer_count = db.query(Customer).filter(Customer.company_id == test2_company.id).count()
        if customer_count == 0:
            # 创建测试客户
            test_customers = [
                Customer(
                    name="广东电力集团",
                    contact_person="孙八",
                    phone="13900139006",
                    email="sunba@guangdong-power.com",
                    address="广东省深圳市",
                    company_id=test2_company.id
                ),
                Customer(
                    name="广西供电局",
                    contact_person="周九",
                    phone="13900139007",
                    email="zhoujiu@guangxi-power.com",
                    address="广西壮族自治区南宁市",
                    company_id=test2_company.id
                )
            ]
            db.add_all(test_customers)
            print(f"为测试公司2添加{len(test_customers)}个测试客户")
    
    # 为测试公司2添加测试设备
    if test2_company:
        # 先获取测试公司2的客户
        customers = db.query(Customer).filter(Customer.company_id == test2_company.id).all()
        if customers:
            # 检查是否已有设备数据
            device_count = db.query(Device).filter(Device.company_id == test2_company.id).count()
            if device_count == 0:
                # 创建测试设备
                test_devices = [
                    Device(
                        device_id="TEST2-DEV-001",
                        serial_number="TEST2-DEV-001",
                        name="变压器 T2-B-001",
                        model="变压器",
                        status="online",
                        customer_id=customers[0].id,
                        location="广东省深圳市变电站",
                        company_id=test2_company.id
                    ),
                    Device(
                        device_id="TEST2-DEV-002",
                        serial_number="TEST2-DEV-002",
                        name="配电柜 T2-A-001",
                        model="配电柜",
                        status="offline",
                        customer_id=customers[1].id,
                        location="广西壮族自治区南宁市商业区",
                        company_id=test2_company.id
                    )
                ]
                db.add_all(test_devices)
                print(f"为测试公司2添加{len(test_devices)}个测试设备")
    
    db.commit()
    print("数据库初始化成功，所有测试数据已创建：")
    print("默认公司 (DEFAULT):")
    print("  管理员: admin@default.com@DEFAULT / 123456")
    print("  普通用户: user@default.com@DEFAULT / 123456")
    print("  测试用户: test@default.com@DEFAULT / 123456")
    if test1_company:
        print("测试公司1 (TEST1):")
        print("  管理员: admin@test1.com@TEST1 / 123456")
        print("  普通用户: user@test1.com@TEST1 / 123456")
    if test2_company:
        print("测试公司2 (TEST2):")
        print("  管理员: admin@test2.com@TEST2 / 123456")
        print("  普通用户: user@test2.com@TEST2 / 123456")
    
    # 打印客户和设备数据统计
    if default_company:
        customer_count = db.query(Customer).filter(Customer.company_id == default_company.id).count()
        device_count = db.query(Device).filter(Device.company_id == default_company.id).count()
        print(f"默认公司客户数量: {customer_count}")
        print(f"默认公司设备数量: {device_count}")
    
    if test1_company:
        customer_count = db.query(Customer).filter(Customer.company_id == test1_company.id).count()
        device_count = db.query(Device).filter(Device.company_id == test1_company.id).count()
        print(f"测试公司1客户数量: {customer_count}")
        print(f"测试公司1设备数量: {device_count}")
    
    if test2_company:
        customer_count = db.query(Customer).filter(Customer.company_id == test2_company.id).count()
        device_count = db.query(Device).filter(Device.company_id == test2_company.id).count()
        print(f"测试公司2客户数量: {customer_count}")
        print(f"测试公司2设备数量: {device_count}")
    
except Exception as e:
    print(f"数据库初始化失败：{e}")
    import traceback
    traceback.print_exc()
    db.rollback()
finally:
    db.close()

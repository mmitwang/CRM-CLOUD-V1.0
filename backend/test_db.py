from app.core.database import SessionLocal
from app.models.user import User, Company

# 检查数据库中的用户数据
db = SessionLocal()
try:
    print("检查数据库中的公司数据...")
    # 查询所有公司
    companies = db.query(Company).all()
    for company in companies:
        print(f"公司: {company.name} (ID: {company.id}, Code: {company.code})")
    
    print("\n检查数据库中的用户数据...")
    # 查询所有用户
    users = db.query(User).all()
    for user in users:
        company = db.query(Company).filter(Company.id == user.company_id).first()
        company_name = company.name if company else "未知公司"
        company_code = company.code if company else "未知代码"
        print(f"用户: {user.email} (ID: {user.id}, 公司: {company_name}, 角色: {user.role})")
        print(f"  密码哈希: {user.password}")
        print(f"  登录格式: {user.email}@{company_code}")
    
    print("\n数据库检查完成")
except Exception as e:
    print(f"数据库检查失败：{e}")
finally:
    db.close()

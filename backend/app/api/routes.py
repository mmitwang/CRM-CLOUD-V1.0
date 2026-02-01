from fastapi import APIRouter
from app.api.v1.endpoints import auth, customers, devices, users, companies

# 创建API路由
api_router = APIRouter()

# 注册V1版本的路由
api_router.include_router(auth.router, prefix="/auth", tags=["认证"])
api_router.include_router(customers.router, prefix="/customers", tags=["客户管理"])
api_router.include_router(devices.router, prefix="/devices", tags=["设备管理"])
api_router.include_router(users.router, prefix="/users", tags=["用户管理"])
api_router.include_router(companies.router, prefix="/companies", tags=["公司管理"])

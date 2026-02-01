from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, customers, devices, companies

api_router = APIRouter()

# 认证相关路由
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])

# 用户管理路由
api_router.include_router(users.router, prefix="/users", tags=["users"])

# 客户管理路由
api_router.include_router(customers.router, prefix="/customers", tags=["customers"])

# 设备管理路由
api_router.include_router(devices.router, prefix="/devices", tags=["devices"])

# 公司管理路由
api_router.include_router(companies.router, prefix="/companies", tags=["companies"])
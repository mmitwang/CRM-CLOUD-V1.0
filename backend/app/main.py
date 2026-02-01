from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import api_router

# 创建FastAPI应用实例
app = FastAPI(
    title="Smart Electric CRM API",
    description="智能电气CRM系统后端API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册API路由
app.include_router(api_router, prefix=settings.API_V1_STR)

# 健康检查端点
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "smart-electric-crm-backend"}

# 根路径
@app.get("/")
def root():
    return {
        "message": "Welcome to Smart Electric CRM API",
        "docs": "/docs",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
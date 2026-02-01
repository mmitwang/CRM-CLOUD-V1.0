from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    # 项目配置
    PROJECT_NAME: str = Field(default="Smart Electric CRM")
    API_V1_STR: str = Field(default="/api/v1")
    
    # 数据库配置
    # 使用SQLite数据库，无需额外的数据库服务器
    SQLALCHEMY_DATABASE_URL: str = Field(default="sqlite:///./smart_electric_crm.db")
    
    # JWT配置
    SECRET_KEY: str = Field(default="your-secret-key-here")
    ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30)
    
    # CORS配置
    CORS_ORIGINS: List[str] = Field(default=["http://localhost:3000", "http://localhost:8080"])
    
    # 应用配置
    DEBUG: bool = Field(default=True)
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

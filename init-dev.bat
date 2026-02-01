@echo off
chcp 65001 > nul

echo ==============================
echo 智能电气CRM系统初始化脚本
echo ==============================

REM 检查Docker是否安装
echo 检查Docker安装状态...
docker --version > nul 2>&1
if %errorlevel% neq 0 (
    echo 错误：未安装Docker或Docker未在PATH中
    echo 请先安装Docker Desktop并重启电脑
    pause
    exit /b 1
) else (
    echo Docker已安装
)

REM 检查git是否安装
echo 检查Git安装状态...
git --version > nul 2>&1
if %errorlevel% neq 0 (
    echo 错误：未安装Git或Git未在PATH中
    echo 请先安装Git
    pause
    exit /b 1
) else (
    echo Git已安装
)

REM 检查环境变量文件
echo 检查环境变量文件...
if not exist ".env.example" (
    echo 错误：.env.example文件不存在
    pause
    exit /b 1
)

if not exist ".env" (
    echo 复制环境变量文件...
    copy ".env.example" ".env" > nul
    if %errorlevel% neq 0 (
        echo 错误：复制环境变量文件失败
        pause
        exit /b 1
    ) else (
        echo 环境变量文件已复制
    )
) else (
    echo 环境变量文件已存在
)

REM 构建并启动容器
echo 构建并启动Docker容器...
docker-compose up -d --build
if %errorlevel% neq 0 (
    echo 错误：构建或启动容器失败
    pause
    exit /b 1
) else (
    echo Docker容器已启动
)

REM 等待容器启动完成
echo 等待容器启动完成...
timeout /t 10 /nobreak > nul

REM 检查容器状态
echo 检查容器运行状态...
docker-compose ps

REM 显示访问地址
echo ==============================
echo 服务访问地址：
echo ==============================
echo 前端服务：http://localhost:8080
echo 后端API：http://localhost:8000
echo API文档：http://localhost:8000/docs
echo PostgreSQL：localhost:5432
echo ==============================
echo 初始化完成！
echo ==============================

pause

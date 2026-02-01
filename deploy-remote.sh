#!/bin/bash

set -e

# 配置信息
SERVER_IP="36.140.30.209"
SERVER_USER="root"
SERVER_PASSWORD="13579@Yidong"

# 域名配置
FRONTEND_DOMAIN="crm.yourdomain.com"
BACKEND_DOMAIN="api.yourdomain.com"
MOBILE_DOMAIN="m.yourdomain.com"

# 项目路径
PROJECT_DIR="/opt/smart-electric-crm"
NGINX_CONF_DIR="/etc/nginx/conf.d"

# 颜色输出
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${GREEN}====================================="
echo -e "智能电气CRM系统远程部署脚本"
echo -e "=====================================${NC}"

# 1. 检查本地环境
echo -e "${YELLOW}检查本地环境...${NC}"

# 检查sshpass是否安装
if ! command -v sshpass &> /dev/null; then
    echo -e "${RED}错误：sshpass未安装${NC}"
    echo -e "${YELLOW}安装sshpass...${NC}"
    if [[ "$(uname)" == "Darwin" ]]; then
        brew install sshpass
    elif [[ "$(uname)" == "Linux" ]]; then
        sudo apt-get install -y sshpass
    else
        echo -e "${RED}请手动安装sshpass${NC}"
        exit 1
    fi
fi

# 检查scp是否安装
if ! command -v scp &> /dev/null; then
    echo -e "${RED}错误：scp未安装${NC}"
    exit 1
fi

# 2. 连接服务器并验证
echo -e "${YELLOW}连接服务器并验证...${NC}"

# 测试SSH连接
sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "echo 'SSH连接成功'"
if [ $? -ne 0 ]; then
    echo -e "${RED}SSH连接失败，请检查服务器信息${NC}"
    exit 1
fi

echo -e "${GREEN}SSH连接成功${NC}"

# 3. 环境检查和安装
echo -e "${YELLOW}环境检查和安装...${NC}"

# 安装必要的系统包
sshpass -p "$SERVER_PASSWORD" ssh $SERVER_USER@$SERVER_IP << 'EOF'
    set -e
    
    # 更新系统
    apt-get update && apt-get upgrade -y
    
    # 安装必要的包
    apt-get install -y --no-install-recommends \
        curl \
        wget \
        git \
        ufw \
        certbot \
        python3-certbot-nginx \
        cron \
        logrotate \
        unzip
    
    # 检查Docker是否安装
    if ! command -v docker &> /dev/null; then
        echo "安装Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        rm get-docker.sh
        
        # 添加用户到docker组
        usermod -aG docker $USER
    fi
    
    # 检查Docker Compose是否安装
    if ! command -v docker-compose &> /dev/null; then
        echo "安装Docker Compose..."
        curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    fi
    
    # 启动Docker服务
    systemctl enable docker
    systemctl start docker
    
    echo "环境检查完成"
EOF

# 4. 创建项目目录
echo -e "${YELLOW}创建项目目录...${NC}"
sshpass -p "$SERVER_PASSWORD" ssh $SERVER_USER@$SERVER_IP "mkdir -p $PROJECT_DIR"

# 5. 传输项目文件
echo -e "${YELLOW}传输项目文件...${NC}"

# 创建压缩包
tar -czf smart-electric-crm.tar.gz --exclude=".git" --exclude="node_modules" --exclude="venv" --exclude=".env" .

# 传输文件
sshpass -p "$SERVER_PASSWORD" scp smart-electric-crm.tar.gz $SERVER_USER@$SERVER_IP:$PROJECT_DIR/

# 解压文件
sshpass -p "$SERVER_PASSWORD" ssh $SERVER_USER@$SERVER_IP "cd $PROJECT_DIR && tar -xzf smart-electric-crm.tar.gz && rm smart-electric-crm.tar.gz"

# 清理本地压缩包
rm smart-electric-crm.tar.gz

# 6. 安全配置
echo -e "${YELLOW}安全配置...${NC}"

# 配置防火墙
sshpass -p "$SERVER_PASSWORD" ssh $SERVER_USER@$SERVER_IP << 'EOF'
    # 启用防火墙
    ufw --force enable
    
    # 允许必要的端口
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 8000/tcp
    
    # 查看防火墙状态
    ufw status
EOF

# 7. SSL证书配置
echo -e "${YELLOW}SSL证书配置...${NC}"

# 生成SSL证书
sshpass -p "$SERVER_PASSWORD" ssh $SERVER_USER@$SERVER_IP << EOF
    # 创建证书目录
    mkdir -p /etc/letsencrypt/live/$FRONTEND_DOMAIN
    
    # 使用certbot生成证书
    certbot certonly --standalone --preferred-challenges http \
        --email admin@yourdomain.com \
        --agree-tos \
        --no-eff-email \
        -d $FRONTEND_DOMAIN \
        -d $BACKEND_DOMAIN \
        -d $MOBILE_DOMAIN
    
    # 配置证书自动续期
    echo "0 0 * * 0 certbot renew --quiet --nginx" > /etc/cron.d/certbot-renew
EOF

# 8. Nginx配置
echo -e "${YELLOW}Nginx配置...${NC}"

# 创建Nginx配置文件
cat > nginx-crm.conf << 'EOF'
# 前端配置
server {
    listen 80;
    server_name crm.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name crm.yourdomain.com;
    
    # SSL配置
    ssl_certificate /etc/letsencrypt/live/crm.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/crm.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 健康检查
    location /health {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}

# 后端API配置
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;
    
    # SSL配置
    ssl_certificate /etc/letsencrypt/live/crm.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/crm.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 健康检查
    location /health {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}

# 移动端H5配置
server {
    listen 80;
    server_name m.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name m.yourdomain.com;
    
    # SSL配置
    ssl_certificate /etc/letsencrypt/live/crm.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/crm.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    
    location / {
        proxy_pass http://localhost:8081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 健康检查
    location /health {
        proxy_pass http://localhost:8081;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
EOF

# 传输Nginx配置文件
sshpass -p "$SERVER_PASSWORD" scp nginx-crm.conf $SERVER_USER@$SERVER_IP:$NGINX_CONF_DIR/

# 清理本地配置文件
rm nginx-crm.conf

# 重启Nginx
sshpass -p "$SERVER_PASSWORD" ssh $SERVER_USER@$SERVER_IP << 'EOF'
    # 检查Nginx配置
    nginx -t
    
    # 重启Nginx
    systemctl restart nginx
    systemctl enable nginx
EOF

# 9. 配置环境变量
echo -e "${YELLOW}配置环境变量...${NC}"

# 创建.env文件
cat > .env << 'EOF'
# 数据库配置
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=password
POSTGRES_DB=example_db

# JWT配置
SECRET_KEY=your-secret-key-here-please-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# 应用配置
DEBUG=False

# CORS配置
CORS_ORIGINS=https://crm.yourdomain.com,https://m.yourdomain.com

# API配置
API_V1_STR=/api/v1

# 项目名称
PROJECT_NAME=Smart Electric CRM
EOF

# 传输.env文件
sshpass -p "$SERVER_PASSWORD" scp .env $SERVER_USER@$SERVER_IP:$PROJECT_DIR/

# 清理本地.env文件
rm .env

# 10. 构建和启动服务
echo -e "${YELLOW}构建和启动服务...${NC}"

# 构建和启动Docker容器
sshpass -p "$SERVER_PASSWORD" ssh $SERVER_USER@$SERVER_IP << 'EOF'
    set -e
    
    cd /opt/smart-electric-crm
    
    # 构建和启动容器
    docker-compose up -d --build
    
    # 等待服务启动
    sleep 30
    
    # 检查服务状态
    docker-compose ps
    
    # 查看日志
    docker-compose logs --tail=50
EOF

# 11. 配置监控和日志
echo -e "${YELLOW}配置监控和日志...${NC}"

# 配置日志轮转
cat > logrotate-nginx.conf << 'EOF'
/var/log/nginx/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 `cat /var/run/nginx.pid`
        fi
    endscript
}
EOF

# 传输日志轮转配置
sshpass -p "$SERVER_PASSWORD" scp logrotate-nginx.conf $SERVER_USER@$SERVER_IP:/etc/logrotate.d/nginx

# 清理本地配置文件
rm logrotate-nginx.conf

# 12. 创建备份脚本
echo -e "${YELLOW}创建备份脚本...${NC}"

# 创建备份脚本
cat > backup.sh << 'EOF'
#!/bin/bash

set -e

# 配置信息
BACKUP_DIR="/opt/backups"
PROJECT_DIR="/opt/smart-electric-crm"
DATE=$(date +"%Y%m%d_%H%M%S")
RETENTION_DAYS=7

# 创建备份目录
mkdir -p $BACKUP_DIR

# 颜色输出
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m"

echo -e "${GREEN}====================================="
echo -e "智能电气CRM系统备份脚本"
echo -e "=====================================${NC}"

# 1. 数据库备份
echo -e "${YELLOW}数据库备份...${NC}"

# 执行数据库备份
docker exec -t smart-electric-crm-postgres pg_dump -U admin example_db > $BACKUP_DIR/db_backup_$DATE.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}数据库备份成功${NC}"
else
    echo -e "${RED}数据库备份失败${NC}"
    exit 1
fi

# 压缩数据库备份
gzip $BACKUP_DIR/db_backup_$DATE.sql

# 2. 配置文件备份
echo -e "${YELLOW}配置文件备份...${NC}"

# 备份.env文件
cp $PROJECT_DIR/.env $BACKUP_DIR/env_backup_$DATE

# 备份Nginx配置
cp /etc/nginx/conf.d/nginx-crm.conf $BACKUP_DIR/nginx_backup_$DATE.conf

# 3. 清理旧备份
echo -e "${YELLOW}清理旧备份...${NC}"

find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "env_backup_*" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "nginx_backup_*" -mtime +$RETENTION_DAYS -delete

echo -e "${GREEN}备份完成！${NC}"
echo -e "${YELLOW}备份文件位置：$BACKUP_DIR${NC}"
EOF

# 传输备份脚本
sshpass -p "$SERVER_PASSWORD" scp backup.sh $SERVER_USER@$SERVER_IP:/opt/

# 设置执行权限
sshpass -p "$SERVER_PASSWORD" ssh $SERVER_USER@$SERVER_IP "chmod +x /opt/backup.sh"

# 清理本地备份脚本
rm backup.sh

# 添加到crontab
sshpass -p "$SERVER_PASSWORD" ssh $SERVER_USER@$SERVER_IP << 'EOF'
    # 添加到crontab，每天凌晨2点执行备份
    (crontab -l 2>/dev/null | grep -v "backup.sh"; echo "0 2 * * * /opt/backup.sh >> /var/log/backup.log 2>&1") | crontab -
    
    # 查看crontab
    crontab -l
EOF

# 13. 配置持续集成
echo -e "${YELLOW}配置持续集成...${NC}"

# 创建GitHub Actions配置目录
mkdir -p .github/workflows

# 创建CI配置文件
cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to Production

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      
      - name: Run tests
        run: |
          cd backend
          python -m pytest tests/

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker images
        run: |
          docker-compose build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to server
        run: |
          chmod +x deploy-remote.sh
          ./deploy-remote.sh
        env:
          SERVER_PASSWORD: ${{ secrets.SERVER_PASSWORD }}
EOF

# 14. 完成部署
echo -e "${GREEN}====================================="
echo -e "部署完成！${NC}"
echo -e "=====================================${NC}"
echo -e "${YELLOW}访问地址：${NC}"
echo -e "${GREEN}前端：https://crm.yourdomain.com${NC}"
echo -e "${GREEN}后端API：https://api.yourdomain.com${NC}"
echo -e "${GREEN}移动端H5：https://m.yourdomain.com${NC}"
echo -e "${YELLOW}健康检查：${NC}"
echo -e "${GREEN}前端：https://crm.yourdomain.com/health${NC}"
echo -e "${GREEN}后端：https://api.yourdomain.com/health${NC}"
echo -e "${GREEN}移动端：https://m.yourdomain.com/health${NC}"
echo -e "${YELLOW}备份信息：${NC}"
echo -e "${GREEN}备份目录：/opt/backups${NC}"
echo -e "${GREEN}备份时间：每天凌晨2点${NC}"
echo -e "${YELLOW}监控信息：${NC}"
echo -e "${GREEN}日志路径：/var/log/nginx/${NC}"
echo -e "${GREEN}Docker日志：docker-compose logs${NC}"
echo -e "=====================================${NC}"

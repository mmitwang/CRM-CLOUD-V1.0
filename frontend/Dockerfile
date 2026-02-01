# 第一阶段：构建
FROM node:18-alpine AS builder

# 设置中国镜像源
RUN npm config set registry https://registry.npmmirror.com

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package.json package-lock.json* ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 修改API配置
RUN sed -i "s|baseURL: import.meta.env.VITE_API_BASE_URL \|\| 'http://localhost:8000'|baseURL: import.meta.env.VITE_API_BASE_URL \|\| 'http://localhost:8000'|" src/api/index.ts
RUN sed -i "s|return apiClient.post('/api/v1/auth/login', data);|return apiClient.post('/api/v1/auth/login', data);|" src/api/auth.ts
RUN sed -i "s|return apiClient.post('/api/v1/auth/register', data);|return apiClient.post('/api/v1/auth/register', data);|" src/api/auth.ts
RUN sed -i "s|return apiClient.post('/api/v1/auth/refresh');|return apiClient.post('/api/v1/auth/refresh');|" src/api/auth.ts
RUN sed -i "s|return apiClient.post('/api/v1/auth/logout');|return apiClient.post('/api/v1/auth/logout');|" src/api/auth.ts
RUN sed -i "s|return apiClient.get('/api/v1/auth/me');|return apiClient.get('/api/v1/auth/me');|" src/api/auth.ts

# 构建项目
RUN npm run build

# 第二阶段：运行时
FROM nginx:alpine AS runtime

# 设置中国镜像源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:80 || exit 1

# 启动命令
CMD ["nginx", "-g", "daemon off;"]
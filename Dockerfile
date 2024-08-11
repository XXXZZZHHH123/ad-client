FROM ubuntu:latest
LABEL authors="stewart"

# 使用官方 Node.js 镜像作为构建环境
FROM node:18 AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json (或者 yarn.lock)
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制应用源代码
COPY . .

# 构建应用
RUN npm run build

# 使用 nginx 镜像作为运行环境
FROM nginx:alpine

# 移除默认的 Nginx 配置文件
RUN rm /etc/nginx/conf.d/default.conf

# 创建自定义 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建好的文件到 nginx 的默认目录
COPY --from=build /app/build /usr/share/nginx/html

# 暴露 nginx 端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
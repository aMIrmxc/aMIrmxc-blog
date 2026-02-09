---
title: "برسی خلاصه و سریع  Docker"
description: "یاد بگیرید چگونه با Docker اپلیکیشن‌های خود را در قالب کانتینر بسته‌بندی کرده و در هر محیطی بدون نگرانی اجرا کنید"
post_id: "learn-docker-fast"
publishDate: "1 Feb 2024"
updatedDate: "23 Jan 2025"
tags: ["Docker", "Container", "DevOps"]
---


# برسی  جامع و سریع Docker: خلاصه هر چیزی که نیاز هست بدانید

![alt text](img.png)


Docker یکی از مهم‌ترین ابزارهای توسعه نرم‌افزار مدرن است که شیوه توسعه، تست و استقرار اپلیکیشن‌ها را کاملاً متحول کرده است. در این مقاله جامع، تمام مفاهیم اساسی Docker را از صفر برسی خواهیم کرد.
## 1. مفاهیم پایه

### چرا Docker؟ تفاوت با VM چیست؟

یکی از بزرگ‌ترین مشکلات توسعه‌دهندگان این جمله است: "روی سیستم من کار می‌کنه!" Docker این مشکل را حل می‌کند.

#### Virtual Machine vs Docker

**Virtual Machine (ماشین مجازی):**
- یک سیستم عامل کامل اجرا می‌کند
- منابع زیادی (CPU، RAM، دیسک) مصرف می‌کند
- زمان راه‌اندازی طولانی
- ایزوله کامل اما سنگین

**Docker Container:**
- فقط اپلیکیشن و وابستگی‌هایش را شامل می‌شود
- از kernel میزبان استفاده می‌کند
- سبک‌وزن و سریع
- راه‌اندازی در چند ثانیه

```bash
# مقایسه منابع مصرفی
# VM: ~2GB RAM برای یک Ubuntu ساده
# Container: ~20MB RAM برای همان اپلیکیشن
```

### Image و Container دقیقاً چه هستند؟

#### Docker Image (تصویر)
Image مانند یک "نقشه" یا "قالب" است که شامل:
- کد اپلیکیشن
- کتابخانه‌ها و وابستگی‌ها
- متغیرهای محیطی
- فایل‌های پیکربندی

```bash
# مشاهده لیست Image های موجود
docker images

# دانلود یک Image
docker pull ubuntu:20.04
```

#### Docker Container (کانتینر)
Container یک نمونه در حال اجرا از Image است. هر Container:
- از Image ساخته می‌شود
- دارای فضای فایل جداگانه است
- قابلیت start، stop، restart دارد

```bash
# اجرای یک Container از Image
docker run ubuntu:20.04

# مشاهده Container های در حال اجرا
docker ps

# مشاهده تمام Container ها (حتی متوقف شده‌ها)
docker ps -a
```

### Registry (مثل Docker Hub)

Registry مکانی است برای ذخیره و اشتراک Image ها. Docker Hub محبوب‌ترین Registry عمومی است.

```bash
# جستجوی Image در Docker Hub
docker search nginx

# آپلود Image به Registry (پس از login)
docker login
docker push username/my-app:latest
```

## 2. کار با دستورات پایه

### دستورات اساسی Docker

#### docker run - اجرای Container

```bash
# اجرای ساده
docker run hello-world

# اجرای تعاملی
docker run -it ubuntu:20.04 /bin/bash

# اجرای در پس‌زمینه
docker run -d nginx

# اجرای با نام مشخص
docker run --name my-nginx -d nginx

# اجرای با port mapping
docker run -p 8080:80 -d nginx
```

#### docker ps - مشاهده Container ها

```bash
# Container های در حال اجرا
docker ps

# تمام Container ها
docker ps -a

# فقط ID ها
docker ps -q

# با فرمت سفارشی
docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Status}}"
```

#### docker stop - متوقف کردن Container

```bash
# توقف با نام
docker stop my-nginx

# توقف با ID
docker stop abc123

# توقف چند Container همزمان
docker stop $(docker ps -q)
```

#### docker rm - حذف Container

```bash
# حذف Container متوقف شده
docker rm my-nginx

# حذف اجباری (حتی در حال اجرا)
docker rm -f my-nginx

# حذف تمام Container های متوقف شده
docker container prune
```

### ساخت Image از Dockerfile

یک Dockerfile ساده برای اپلیکیشن Node.js:

```dockerfile
# Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# ساخت Image
docker build -t my-node-app .

# اجرای Container از Image ساخته شده
docker run -p 3000:3000 my-node-app
```

### docker exec - دسترسی به Container در حال اجرا

```bash
# ورود به shell در Container
docker exec -it my-nginx /bin/bash

# اجرای دستور مشخص
docker exec my-nginx ls -la /var/log

# مشاهده فرآیندهای در حال اجرا
docker exec my-nginx ps aux
```

## 3. Dockerfile - ساخت Image سفارشی

### ساختار اصلی Dockerfile

```dockerfile
# نسخه پایه
FROM ubuntu:20.04

# اطلاعات سازنده
LABEL maintainer="your-email@example.com"

# نصب پکیج‌ها
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# تنظیم دایرکتوری کار
WORKDIR /app

# کپی فایل‌ها
COPY requirements.txt .
COPY . .

# نصب وابستگی‌های Python
RUN pip3 install -r requirements.txt

# تعریف port
EXPOSE 5000

# تعریف متغیر محیطی
ENV FLASK_APP=app.py

# دستور پیش‌فرض اجرا
CMD ["python3", "app.py"]
```

### دستورات کلیدی Dockerfile

#### FROM - تصویر پایه
```dockerfile
# استفاده از تصویر رسمی
FROM python:3.9

# استفاده از تصویر سبک
FROM python:3.9-alpine

# استفاده از نسخه مشخص
FROM node:16.15.0
```

#### RUN - اجرای دستورات در زمان build
```dockerfile
# نصب پکیج‌ها
RUN apt-get update && apt-get install -y curl

# اجرای چند دستور
RUN mkdir -p /app/data \
    && chown -R www-data:www-data /app
```

#### COPY و ADD - کپی فایل‌ها
```dockerfile
# کپی ساده
COPY app.py /app/

# کپی دایرکتوری
COPY ./src /app/src

# ADD (قابلیت استخراج فایل فشرده)
ADD https://example.com/file.tar.gz /app/
```

#### CMD و ENTRYPOINT - دستور اجرا
```dockerfile
# CMD (قابل تغییر در زمان اجرا)
CMD ["python", "app.py"]

# ENTRYPOINT (غیرقابل تغییر)
ENTRYPOINT ["python"]
CMD ["app.py"]
```

### نمونه پیاده‌سازی برای Flask

```python
# app.py
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return 'سلام از Docker!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

```txt
# requirements.txt
Flask==2.0.1
```

```dockerfile
# Dockerfile
FROM python:3.9-alpine

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
```

```bash
# ساخت و اجرا
docker build -t flask-app .
docker run -p 5000:5000 flask-app
```

## 4. Docker Compose - مدیریت چند سرویس

Docker Compose ابزاری است برای تعریف و اجرای اپلیکیشن‌های چند کانتینری.

### فایل docker-compose.yml پایه

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/myapp

  db:
    image: postgres:13
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### مثال کامل: وب اپلیکیشن + دیتابیس

```yaml
# docker-compose.yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app

  app:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_NAME=myapp
      - DB_USER=postgres
      - DB_PASS=secretpassword
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:13-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secretpassword
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:6-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:

networks:
  default:
    driver: bridge
```

### دستورات Docker Compose

```bash
# اجرای تمام سرویس‌ها
docker-compose up

# اجرای در پس‌زمینه
docker-compose up -d

# ساخت مجدد Image ها
docker-compose build

# توقف سرویس‌ها
docker-compose down

# مشاهده وضعیت
docker-compose ps

# مشاهده لاگ‌ها
docker-compose logs

# اجرای دستور در سرویس مشخص
docker-compose exec app bash
```

## 5. Volumes & Networks

### Volumes - مدیریت داده‌ها

Volume ها راهی برای ذخیره داده‌ها خارج از Container هستند.

#### انواع Volume

```bash
# Named Volume
docker volume create my-data
docker run -v my-data:/data ubuntu

# Host Mount (Bind Mount)
docker run -v /host/path:/container/path ubuntu

# Anonymous Volume
docker run -v /data ubuntu
```

#### مثال عملی با MySQL

```yaml
# docker-compose.yml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: myapp
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"

volumes:
  mysql_data:
```

```bash
# مدیریت Volume ها
docker volume ls
docker volume inspect mysql_data
docker volume rm mysql_data
```

### Networks - شبکه‌سازی کانتینرها

#### انواع Network

```bash
# Bridge Network (پیش‌فرض)
docker network create my-bridge

# Host Network
docker run --network=host nginx

# None Network (بدون شبکه)
docker run --network=none alpine
```

#### تعریف Network سفارشی

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    image: nginx
    networks:
      - frontend-network

  backend:
    image: node:16
    networks:
      - frontend-network
      - backend-network

  database:
    image: postgres:13
    networks:
      - backend-network

networks:
  frontend-network:
    driver: bridge
  backend-network:
    driver: bridge
    internal: true
```

```bash
# مدیریت Network ها
docker network ls
docker network inspect bridge
docker network connect my-network my-container
```

## پروژه عملی: ساخت اپلیکیشن کامل

### ساختار پروژه
```
my-app/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── nginx/
│   └── nginx.conf
└── docker-compose.yml
```

### Backend (Node.js + Express)

```javascript
// backend/server.js
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
  host: 'postgres',
  port: 5432,
  database: 'myapp',
  user: 'postgres',
  password: 'password',
});

app.use(express.json());

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
```

```dockerfile
# backend/Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

### Frontend (React)

```dockerfile
# frontend/Dockerfile
FROM node:16-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose نهایی

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    environment:
      - NODE_ENV=production
    depends_on:
      - postgres
    volumes:
      - ./backend:/app
      - /app/node_modules

  postgres:
    image: postgres:13-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:6-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## نکات مهم

### 1. بهینه‌سازی Image ها

```dockerfile
# استفاده از Multi-stage Build
FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD ["npm", "start"]
```

### 2. امنیت

```dockerfile
# اجرا با کاربر غیر root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# استفاده از .dockerignore
# .dockerignore
node_modules
npm-debug.log
.git
.DS_Store
```

### 3. مدیریت Secrets

```yaml
# استفاده از Docker Secrets
version: '3.8'

services:
  app:
    image: myapp
    secrets:
      - db_password
    environment:
      - DB_PASSWORD_FILE=/run/secrets/db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt
```

## نتیجه‌گیری

Docker ابزاری قدرتمند است که توسعه و استقرار اپلیکیشن‌ها را بسیار ساده‌تر می‌کند. با یادگیری مفاهیم پایه، دستورات اساسی، Dockerfile، Docker Compose و مدیریت Volume ها و Network ها، شما قادر خواهید بود اپلیکیشن‌های پیچیده‌ای بسازید که به راحتی در هر محیطی قابل اجرا باشند.


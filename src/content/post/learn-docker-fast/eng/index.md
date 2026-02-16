---
title: "A Quick Docker Overview"
description: "Learn how to package your applications into containers with Docker and run them anywhere without worries"
post_id: "learn-docker-fast"
publishDate: "1 Feb 2024"
updatedDate: "23 Jan 2025"
tags: ["Docker", "Container", "DevOps"]
eng: true
---

# Comprehensive and Quick Docker Review: Summary of Everything You Need to Know

![alt text](img.png)

Docker is one of the most important tools in modern software development that has completely revolutionized the way we develop, test, and deploy applications. In this comprehensive article, we'll review all the fundamental Docker concepts from scratch.

## 1. Basic Concepts

### Why Docker? How is it Different from VMs?

One of the biggest problems developers face is the phrase: "It works on my machine!" Docker solves this problem by ensuring consistent environments across development, testing, and production.

#### Virtual Machine vs Docker

**Virtual Machine:**

- Runs a complete operating system
- Consumes significant resources (CPU, RAM, disk)
- Long startup time
- Complete isolation but heavy
- Each VM includes a full OS kernel, taking gigabytes of space

**Docker Container:**

- Contains only the application and its dependencies
- Uses the host's kernel (shares the OS kernel)
- Lightweight and fast
- Starts up in seconds
- Multiple containers share the same OS kernel, making them much more efficient

```bash
# Resource consumption comparison
# VM: ~2GB RAM for a simple Ubuntu instance
# Container: ~20MB RAM for the same application
```

The key difference is that VMs virtualize the hardware layer (each VM has its own OS), while Docker virtualizes the OS layer (all containers share the host OS kernel). This makes containers much lighter, faster to start, and more portable.

### What Exactly are Images and Containers?

#### Docker Image

An Image is like a "blueprint" or "template" that contains:

- Application code
- Libraries and dependencies
- Environment variables
- Configuration files
- Everything needed to run the application

Think of an image as a read-only template or snapshot. It's immutable - once created, it doesn't change.

```bash
# View list of available Images
docker images

# Download an Image from Docker Hub
docker pull ubuntu:20.04
```

#### Docker Container

A Container is a running instance of an Image. Each Container:

- Is created from an Image
- Has its own separate filesystem
- Can be started, stopped, and restarted
- Is an isolated, runnable instance

The relationship is like a class and object in programming. The Image is the class (template), and the Container is the object (instance). You can create multiple containers from the same image, each running independently.

```bash
# Run a Container from an Image
docker run ubuntu:20.04

# View running Containers
docker ps

# View all Containers (including stopped ones)
docker ps -a
```

### Registry (like Docker Hub)

A Registry is a location for storing and sharing Images. Docker Hub is the most popular public Registry, similar to GitHub for code.

Other registries include Google Container Registry (GCR), Amazon Elastic Container Registry (ECR), and Azure Container Registry (ACR). You can also host private registries for your organization.

```bash
# Search for Images in Docker Hub
docker search nginx

# Upload Image to Registry (after login)
docker login
docker push username/my-app:latest
```

## 2. Working with Basic Commands

### Essential Docker Commands

#### docker run - Run a Container

```bash
# Simple execution
docker run hello-world

# Interactive execution (with terminal access)
docker run -it ubuntu:20.04 /bin/bash

# Run in background (detached mode)
docker run -d nginx

# Run with a specific name
docker run --name my-nginx -d nginx

# Run with port mapping (host:container)
docker run -p 8080:80 -d nginx
# This maps port 8080 on host to port 80 in container
```

- `-it` combines `-i` (interactive) and `-t` (pseudo-TTY) for terminal interaction
- `-d` runs in detached mode (background)
- `-p` publishes container ports to the host
- `--name` assigns a human-readable name instead of random name

#### docker ps - View Containers

```bash
# Running Containers only
docker ps

# All Containers (including stopped)
docker ps -a

# Only Container IDs
docker ps -q

# Custom format
docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Status}}"
```

#### docker stop - Stop a Container

```bash
# Stop by name
docker stop my-nginx

# Stop by ID
docker stop abc123

# Stop multiple Containers simultaneously
docker stop $(docker ps -q)
```

`docker stop` sends a SIGTERM signal and waits for graceful shutdown. Use `docker kill` for immediate termination (SIGKILL).

#### docker rm - Delete a Container

```bash
# Remove a stopped Container
docker rm my-nginx

# Force removal (even if running)
docker rm -f my-nginx

# Remove all stopped Containers
docker container prune
```

### Building an Image from Dockerfile

A simple Dockerfile for a Node.js application:

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
# Build the Image
docker build -t my-node-app .

# Run Container from the built Image
docker run -p 3000:3000 my-node-app
```

The build process creates layers for each instruction. Docker caches these layers, so rebuilding is fast if nothing changed. The `.` at the end specifies the build context (current directory).

### docker exec - Access a Running Container

```bash
# Enter shell in Container
docker exec -it my-nginx /bin/bash

# Execute a specific command
docker exec my-nginx ls -la /var/log

# View running processes
docker exec my-nginx ps aux
```

Unlike `docker run` which creates a new container, `docker exec` runs commands in an existing running container. This is useful for debugging and maintenance.

## 3. Dockerfile - Building Custom Images

### Basic Dockerfile Structure

```dockerfile
# Base version/image
FROM ubuntu:20.04

# Maintainer information
LABEL maintainer="your-email@example.com"

# Install packages
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy files
COPY requirements.txt .
COPY . .

# Install Python dependencies
RUN pip3 install -r requirements.txt

# Define port
EXPOSE 5000

# Define environment variable
ENV FLASK_APP=app.py

# Default execution command
CMD ["python3", "app.py"]
```

### Key Dockerfile Instructions

#### FROM - Base Image

```dockerfile
# Use official image
FROM python:3.9

# Use lightweight image
FROM python:3.9-alpine

# Use specific version
FROM node:16.15.0
```

Alpine images are minimal Linux distributions (~5MB) that significantly reduce image size. However, they use musl libc instead of glibc, which can occasionally cause compatibility issues.

#### RUN - Execute Commands During Build

```dockerfile
# Install packages
RUN apt-get update && apt-get install -y curl

# Execute multiple commands
RUN mkdir -p /app/data \
    && chown -R www-data:www-data /app
```

Each RUN command creates a new layer. Combining commands with `&&` reduces layers and image size. Clean up temporary files in the same RUN command to keep layers small.

#### COPY and ADD - Copy Files

```dockerfile
# Simple copy
COPY app.py /app/

# Copy directory
COPY ./src /app/src

# ADD (can extract compressed files and download URLs)
ADD https://example.com/file.tar.gz /app/
```

Prefer COPY over ADD unless you need ADD's special features (automatic tar extraction, URL downloads). COPY is more explicit and predictable.

#### CMD and ENTRYPOINT - Execution Commands

```dockerfile
# CMD (can be overridden at runtime)
CMD ["python", "app.py"]

# ENTRYPOINT (cannot be overridden, more fixed)
ENTRYPOINT ["python"]
CMD ["app.py"]
```

- CMD provides defaults that can be overridden when starting the container
- ENTRYPOINT defines the main command; CMD then provides default arguments
- Combining both gives flexibility: ENTRYPOINT for the executable, CMD for default args

### Flask Implementation Example

```python
# app.py
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello from Docker!'

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
# Build and run
docker build -t flask-app .
docker run -p 5000:5000 flask-app
```

Notice we copy requirements.txt first, then install dependencies, then copy the rest. This leverages layer caching - if code changes but dependencies don't, Docker reuses the cached dependency layer.

## 4. Docker Compose - Managing Multiple Services

Docker Compose is a tool for defining and running multi-container applications. Instead of running multiple `docker run` commands, you define everything in a YAML file.

### Basic docker-compose.yml File

```yaml
version: "3.8"

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

`depends_on` ensures the database starts before the app, but doesn't wait for the database to be ready. For production, you should add health checks or retry logic in your application.

### Complete Example: Web Application + Database

```yaml
# docker-compose.yml
version: "3.8"

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

This creates a complete stack with a reverse proxy (nginx), application server, database (PostgreSQL), and cache (Redis). All services can communicate using service names as hostnames (e.g., app can connect to `postgres:5432`).

### Docker Compose Commands

```bash
# Run all services
docker-compose up

# Run in background
docker-compose up -d

# Rebuild Images
docker-compose build

# Stop services
docker-compose down

# View status
docker-compose ps

# View logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# Execute command in specific service
docker-compose exec app bash
```

`docker-compose down` stops and removes containers, but preserves volumes. Use `docker-compose down -v` to also remove volumes (data loss!).

## 5. Volumes & Networks

### Volumes - Data Management

Volumes are a way to persist data outside of Containers. When a container is deleted, data in volumes persists.

#### Types of Volumes

```bash
# Named Volume (managed by Docker)
docker volume create my-data
docker run -v my-data:/data ubuntu

# Host Mount (Bind Mount) - directly mount host directory
docker run -v /host/path:/container/path ubuntu

# Anonymous Volume (Docker manages, no name)
docker run -v /data ubuntu
```

- **Named volumes:** Docker manages the location, best for production
- **Bind mounts:** Direct host path, good for development (hot reloading)
- **Anonymous volumes:** Cleaned up when container is removed

#### Practical Example with MySQL

```yaml
# docker-compose.yml
version: "3.8"

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
# Volume management
docker volume ls
docker volume inspect mysql_data
docker volume rm mysql_data
docker volume prune  # Remove all unused volumes
```

### Networks - Container Networking

Docker networks enable communication between containers and isolation of services.

#### Network Types

```bash
# Bridge Network (default) - containers on same bridge can communicate
docker network create my-bridge

# Host Network - container uses host's network directly (no isolation)
docker run --network=host nginx

# None Network - no networking
docker run --network=none alpine
```

- **Bridge:** Default, provides DNS resolution between containers
- **Host:** Best performance but no isolation
- **None:** For maximum security when no network is needed
- **Overlay:** For multi-host networking (Docker Swarm)

#### Custom Network Definition

```yaml
# docker-compose.yml
version: "3.8"

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
    internal: true # No external access
```

This creates network segmentation - frontend can't directly access the database, only through backend. The `internal: true` flag prevents external internet access from that network.

```bash
# Network management
docker network ls
docker network inspect bridge
docker network connect my-network my-container
docker network disconnect my-network my-container
```

## Practical Project: Building a Complete Application

### Project Structure

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
const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 3000;

const pool = new Pool({
	host: "postgres", // Service name from docker-compose
	port: 5432,
	database: "myapp",
	user: "postgres",
	password: "password",
});

app.use(express.json());

app.get("/api/users", async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM users");
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.listen(port, "0.0.0.0", () => {
	console.log(`Server running on port ${port}`);
});
```

```dockerfile
# backend/Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production  # npm ci is faster and more reliable than npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

### Frontend (React)

```dockerfile
# frontend/Dockerfile
# Multi-stage build for optimized production image
FROM node:16-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build  # Creates optimized production build

# Production stage - only serve built files
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Multi-stage build keeps the final image small by discarding build dependencies. The builder stage has all development tools, but the final image only has the built static files and nginx.

### Final Docker Compose

```yaml
# docker-compose.yml
version: "3.8"

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
      - /app/node_modules # Prevent host node_modules from overwriting

  postgres:
    image: postgres:13-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql # Auto-run on first start

  redis:
    image: redis:6-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## Important Tips and Best Practices

### 1. Image Optimization

```dockerfile
# Use Multi-stage Build to reduce final image size
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

**Additional best practices:**

- Use specific version tags, not `latest`
- Minimize layers by combining RUN commands
- Order instructions from least to most frequently changing
- Clean up in the same layer where files are created

### 2. Security

```dockerfile
# Run as non-root user for better security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Use .dockerignore to exclude unnecessary files
```

```
# .dockerignore
node_modules
npm-debug.log
.git
.DS_Store
*.md
.env
.vscode
coverage
```

**Additional security tips:**

- Scan images for vulnerabilities: `docker scan myimage`
- Use minimal base images (alpine)
- Don't store secrets in images
- Keep base images updated
- Limit container capabilities

### 3. Managing Secrets

```yaml
# Using Docker Secrets (Swarm mode)
version: "3.8"

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

For development, use `.env` files (never commit them!). For production, use orchestration secrets (Docker Swarm, Kubernetes Secrets) or secret management services (AWS Secrets Manager, HashiCorp Vault).

### 4. Health Checks

```dockerfile
# Add health check to Dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

```yaml
# Or in docker-compose
services:
  app:
    image: myapp
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s
```

### 5. Resource Limits

```yaml
services:
  app:
    image: myapp
    deploy:
      resources:
        limits:
          cpus: "0.5" # Max 50% of one CPU core
          memory: 512M
        reservations:
          cpus: "0.25"
          memory: 256M
```

## Conclusion

Docker is a powerful tool that greatly simplifies application development and deployment. By learning the basic concepts, essential commands, Dockerfile creation, Docker Compose, and Volume and Network management, you'll be able to build complex applications that can easily run in any environment.

**Key Takeaways:**

1. **Containers vs VMs:** Containers are lighter and faster by sharing the host OS kernel
2. **Images are templates, Containers are running instances**
3. **Dockerfile defines how to build an image**
4. **Docker Compose orchestrates multi-container applications**
5. **Volumes persist data, Networks enable communication**
6. **Always follow security best practices and optimize image sizes**

The "it works on my machine" problem is solved - with Docker, if it works in a container on your machine, it will work the same way in production. This consistency across environments is Docker's greatest strength and why it has become an essential tool in modern software development.

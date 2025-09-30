# 🚀 Deployment Guide - Riders Moto Shop Admin Dashboard

## 📋 Prerequisites

- Node.js 18+ installed
- Docker installed (for containerized deployment)
- CapRover access for production deployment

## 🏗️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build:prod
```

## 🐳 Docker Deployment

### Build Docker Image
```bash
# Build the image
npm run docker:build

# Run locally
npm run docker:run
```

### Manual Docker Commands
```bash
# Build
docker build -t riders-moto-admin:latest .

# Run
docker run -p 8080:80 riders-moto-admin:latest
```

## 🌐 CapRover Production Deployment

### 1. Prepare for Deployment
```bash
# Install dependencies and build
npm install
npm run build:prod
```

### 2. Deploy to CapRover
1. **Zip the project** (including all deployment files)
2. **Upload to CapRover** via the web interface
3. **Deploy** - CapRover will automatically:
   - Build the Docker image
   - Run the container
   - Serve the application on port 80

### 3. Required Files for Deployment
- ✅ `captain-definition` - CapRover configuration
- ✅ `Dockerfile` - Multi-stage build with Nginx
- ✅ `nginx.conf` - Nginx configuration
- ✅ `env.production` - Production environment variables
- ✅ `.dockerignore` - Docker ignore file

## 🔧 Configuration

### Environment Variables
The application uses these environment variables:

```env
VITE_API_BASE_URL=https://rmsadminbackend.llp.trizenventures.com/api/v1
VITE_APP_NAME=Riders Moto Shop Admin
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
```

### API Configuration
- **Backend URL**: `https://rmsadminbackend.llp.trizenventures.com/api/v1`
- **Admin Credentials**: 
  - Email: `admin@ridersmotoshop.com`
  - Password: `admin123`

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (18+ required)
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

2. **Docker Build Fails**
   - Check Docker is running
   - Verify all files are present

3. **CapRover Deployment Fails**
   - Ensure `captain-definition` file exists
   - Check all required files are included in the zip
   - Verify Dockerfile syntax

4. **API Connection Issues**
   - Verify backend is running and accessible
   - Check environment variables
   - Ensure admin user exists in database

## 📝 Deployment Checklist

- [ ] All deployment files created
- [ ] Environment variables configured
- [ ] Backend API is running and accessible
- [ ] Admin user exists in database
- [ ] Build completes successfully
- [ ] Docker image builds successfully
- [ ] CapRover deployment successful
- [ ] Application accessible via browser
- [ ] Login functionality works

## 🎯 Quick Deploy Commands

```bash
# Full deployment preparation
npm install && npm run build:prod

# Docker deployment
npm run docker:build && npm run docker:run

# Windows deployment
deploy.bat

# Linux/Mac deployment
./deploy.sh
```

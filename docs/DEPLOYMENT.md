# 🚀 Deployment Guide

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CDN (CloudFlare)                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
├──────────────────────┬──────────────────────┬──────────────┤
│   Vercel (Web)      │  Mobile (Expo)       │  Admin Panel │
│   Next.js 16        │  React Native        │  Next.js     │
└──────────────────────┴──────────────────────┴──────────────┘
          ↓                      ↓                      ↓
┌─────────────────────────────────────────────────────────────┐
│  API Gateway (Render / Railway / AWS)                       │
├─────────────────────────────────────────────────────────────┤
│                 Express.js Backend API                      │
│          (Node.js with TypeScript)                         │
└─────────────────────────────────────────────────────────────┘
          ↓                      ↓                      ↓
    ┌───────────┐         ┌─────────────┐        ┌──────────┐
    │ PostgreSQL│         │   Redis     │        │ Firebase │
    │ Database  │         │   Cache     │        │ Storage  │
    └───────────┘         └─────────────┘        └──────────┘
```

## 1. Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- GitHub account with repository

### Steps

1. **Connect GitHub Repository**
   ```bash
   # Push code to GitHub
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Deploy on Vercel Dashboard**
   - Go to https://vercel.com/new
   - Import project from GitHub
   - Select `frontend` as root directory
   - Set environment variables

3. **Environment Variables (Vercel)**
   ```
   NEXT_PUBLIC_API_URL=https://api.ecofarm.app/api
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=ecofarm-prod
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   ```

4. **Custom Domain**
   - Add domain in Project Settings
   - Configure DNS records

5. **Deploy Command**
   ```
   Build: npm run build
   Output Directory: .next
   ```

### Deployment Preview
```bash
# After merge to main
# Vercel automatically deploys to production
# Preview deployments on PRs automatically generated
```

---

## 2. Backend Deployment (Render / Railway)

### Option A: Deploy on Render

1. **Create account at https://render.com**

2. **Connect GitHub**
   - Link GitHub account
   - Select repository

3. **Create New Service**
   - Service type: Web Service
   - Runtime: Node
   - Build command: `npm install && npm run build`
   - Start command: `npm run start`

4. **Environment Variables**
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://...
   JWT_SECRET=...
   (Add all from .env.example)
   ```

5. **Database**
   - Use Render Postgres add-on OR
   - Connect external PostgreSQL

6. **Auto-Deploy**
   - Enable auto-deploy on push to main

### Option B: Deploy on Railway

1. **Create account at https://railway.app**

2. **Create New Project**
   - Import from GitHub
   - Select backend folder

3. **Add Dockerfile** (included in repo)

4. **Database Setup**
   - Add PostgreSQL plugin
   - Configure connection

5. **Environment Variables**
   - Import from `.env.example`

### Option C: Deploy on AWS

1. **Setup AWS Account**
   - EC2 instance (t3.medium)
   - RDS PostgreSQL database
   - S3 bucket for uploads

2. **Deploy with Docker**
   ```bash
   # Build Docker image
   docker build -t ecofarm-api .
   
   # Push to ECR
   aws ecr get-login-password | docker login --username AWS --password-stdin {account}.dkr.ecr.{region}.amazonaws.com
   docker tag ecofarm-api:latest {account}.dkr.ecr.{region}.amazonaws.com/ecofarm-api:latest
   docker push {account}.dkr.ecr.{region}.amazonaws.com/ecofarm-api:latest
   ```

3. **Deploy on ECS**
   - Create ECS cluster
   - Register task definition
   - Create service

---

## 3. Database Deployment

### PostgreSQL on Cloud

#### Option A: AWS RDS
```bash
# Create RDS instance via AWS Console
# Instance class: db.t3.small
# Storage: 100 GB
# Multi-AZ: Yes
# Backup: 30 days
```

#### Option B: Render Postgres
- Included with Render deployment
- Automatic backups
- Replication available

#### Option C: Managed Services
- Digital Ocean Managed Postgres
- Azure Database for PostgreSQL
- Google Cloud SQL

### Database Migration

```bash
# Connect to production database
DATABASE_URL=postgresql://user:password@prod-db:5432/ecofarm

# Run migrations
npx prisma migrate deploy

# Seed data
npx prisma db seed
```

---

## 4. Docker Deployment

### Build Docker Image

```bash
# Backend
cd backend
docker build -t ecofarm-api:latest .
docker tag ecofarm-api:latest ghcr.io/yourorg/ecofarm-api:latest
docker push ghcr.io/yourorg/ecofarm-api:latest

# Frontend
cd frontend
docker build -t ecofarm-web:latest .
docker tag ecofarm-web:latest ghcr.io/yourorg/ecofarm-web:latest
docker push ghcr.io/yourorg/ecofarm-web:latest
```

### Docker Compose Deployment

```bash
# Production setup
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f api

# Scale services
docker-compose up -d --scale api=3
```

---

## 5. Mobile App Deployment (Expo)

### Build Production APK

```bash
cd mobile

# Configure EAS (Expo Application Services)
eas build --platform android --auto-submit

# Build iOS
eas build --platform ios --auto-submit
```

### Submit to App Stores

```bash
# Android Play Store
eas submit --platform android

# iOS App Store
eas submit --platform ios
```

---

## 6. SSL/TLS Certificate

### Using Let's Encrypt

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d api.ecofarm.app -d ecofarm.app

# Auto-renewal
sudo systemctl enable certbot.timer
```

### Using AWS ACM
- Automatic renewal
- Free tier available
- Integrated with CloudFront

---

## 7. CDN Configuration

### CloudFlare Setup

1. **Add Domain**
   - Point nameservers to CloudFlare

2. **Create DNS Records**
   ```
   CNAME: api -> api.render.com
   CNAME: www -> ecofarm.vercel.app
   A: @ -> Vercel IP
   ```

3. **Enable SSL**
   - SSL/TLS: Full (strict)
   - Automatic HTTPS

4. **Performance**
   - Enable Gzip
   - Cache static assets
   - Minify CSS/JS

---

## 8. Monitoring & Logging

### Application Monitoring

```bash
# Sentry for error tracking
SENTRY_DSN=https://...

# DataDog for infrastructure
DATADOG_API_KEY=...

# Application Performance Monitoring (APM)
```

### Log Aggregation

```bash
# ELK Stack
# Elasticsearch
# Logstash
# Kibana

# Or use CloudWatch/Stackdriver
```

### Uptime Monitoring

```bash
# UptimeRobot
# PagerDuty for alerts
# Statuspage for status page
```

---

## 9. Backup Strategy

### Database Backups

```bash
# Automated daily backups
# Retention: 30 days
# Replication: Multi-region
```

### File Storage Backups

```bash
# S3 versioning enabled
# Cross-region replication
# Lifecycle policies: Archive after 90 days
```

---

## 10. Production Checklist

- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] CDN configured
- [ ] Monitoring enabled
- [ ] Backups verified
- [ ] Secrets stored in Vault
- [ ] Rate limiting enabled
- [ ] API documentation deployed
- [ ] CI/CD pipeline working
- [ ] Health checks configured
- [ ] Error handling tested
- [ ] Performance optimized
- [ ] Security audit completed
- [ ] Load testing done

---

## 11. Rollback Procedure

```bash
# Render
render-cli deployments rollback {deployment-id}

# Vercel
vercel rollback

# Docker
docker-compose down
git checkout previous-version
docker-compose up -d
```

---

## 12. Post-Deployment

1. **Verify endpoints**
   ```bash
   curl https://api.ecofarm.app/api/health
   ```

2. **Test critical flows**
   - OTP login
   - Pest detection
   - Advisory generation

3. **Monitor metrics**
   - Response times
   - Error rates
   - User activity

4. **Set up alerts**
   - High error rate
   - Database connection issues
   - Disk space low

---

**Last Updated:** May 27, 2026

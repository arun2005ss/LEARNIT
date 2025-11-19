# LEARNIT Deployment Guide

This guide will help you deploy your LEARNIT online learning system to production.

## 🚀 Quick Deployment Options

### Option 1: Docker Deployment (Recommended)
**Best for:** Self-hosting, VPS, cloud servers

### Option 2: Platform-as-a-Service (PaaS)
**Best for:** Easy deployment, managed infrastructure
- Vercel (Frontend) + Railway/Render (Backend)
- Netlify (Frontend) + Heroku (Backend)
- AWS Amplify (Frontend) + AWS Elastic Beanstalk (Backend)

### Option 3: Cloud Provider Setup
**Best for:** Full control, enterprise features
- AWS, Google Cloud, Azure
- DigitalOcean, Linode, Vultr

---

## 📋 Prerequisites

1. **Domain Name** (e.g., learnit.yourdomain.com)
2. **SSL Certificate** (Let's Encrypt recommended)
3. **MongoDB Database** (Atlas or self-hosted)
4. **Google OAuth Production Credentials**

---

## 🐳 Docker Deployment (Step-by-Step)

### Step 1: Update Production Environment

1. **Edit `.env.production`:**
```bash
# Update these values
CLIENT_URL=https://your-domain.com
JWT_SECRET=your-super-secure-production-jwt-secret
SESSION_SECRET=your-super-secure-production-session-secret
```

2. **Update Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Add production redirect URI: `https://your-domain.com/api/auth/google/callback`

### Step 2: Configure Nginx

1. **Update `nginx.conf`:**
```nginx
server_name your-domain.com www.your-domain.com;
```

2. **Setup SSL Certificate:**
```bash
# Using Let's Encrypt
sudo certbot certonly --standalone -d your-domain.com
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/key.pem
```

### Step 3: Deploy

1. **Make deploy script executable:**
```bash
chmod +x deploy.sh
```

2. **Run deployment:**
```bash
./deploy.sh
```

---

## ☁️ Vercel + Railway Deployment

### Frontend (Vercel)

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy frontend:**
```bash
cd client
vercel --prod
```

3. **Update `vercel.json`:**
```json
{
  "builds": [
    { "src": "package.json", "use": "@vercel/static-build", "config": { "distDir": "build" } }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "https://your-backend-url.vercel.app/api/$1" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### Backend (Railway)

1. **Install Railway CLI:**
```bash
npm i -g @railway/cli
```

2. **Deploy backend:**
```bash
railway login
railway init
railway up
```

3. **Set environment variables in Railway dashboard:**
   - `NODE_ENV=production`
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `SESSION_SECRET`
   - `CLIENT_URL=https://your-vercel-domain.vercel.app`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

---

## 🔧 Environment Variables

### Required Variables:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-super-secure-secret
SESSION_SECRET=your-super-secure-secret
CLIENT_URL=https://your-domain.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
COOKIE_SECURE=true
TRUST_PROXY=true
```

---

## 🔒 Security Checklist

- [ ] Change default JWT secrets
- [ ] Enable HTTPS/SSL
- [ ] Set secure cookie flags
- [ ] Configure CORS properly
- [ ] Update OAuth redirect URLs
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up rate limiting

---

## 📊 Monitoring & Maintenance

### Health Check Endpoint:
```
GET /api/health
```

### Log Monitoring:
```bash
# Docker logs
docker-compose logs -f

# Application logs
docker-compose logs backend
```

### Database Backup:
```bash
# MongoDB backup
mongodump --uri="your-mongodb-uri" --out=/backup/$(date +%Y%m%d)
```

---

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Example:
```yaml
name: Deploy LEARNIT
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: |
          # Your deployment commands here
          ./deploy.sh
```

---

## 🆘 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Check `CLIENT_URL` environment variable
   - Verify CORS configuration in server

2. **OAuth Redirect Mismatch:**
   - Update Google Cloud Console with correct redirect URI
   - Check `CLIENT_URL` matches exactly

3. **Database Connection:**
   - Verify MongoDB URI is accessible
   - Check network/firewall settings

4. **File Upload Issues:**
   - Ensure uploads directory has proper permissions
   - Check file size limits

### Debug Commands:
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs backend

# Restart services
docker-compose restart

# Access container shell
docker-compose exec backend sh
```

---

## 📞 Support

For deployment issues:
1. Check logs for error messages
2. Verify all environment variables
3. Ensure all prerequisites are met
4. Consult troubleshooting section

---

## 🎉 Post-Deployment

After successful deployment:

1. **Test all features:**
   - User registration/login
   - Google OAuth
   - File uploads
   - All user roles

2. **Set up monitoring:**
   - Uptime monitoring
   - Error tracking
   - Performance metrics

3. **Configure backups:**
   - Database backups
   - File storage backups
   - Configuration backups

4. **Update DNS:**
   - Point domain to your server
   - Configure SSL certificates
   - Set up email (optional)

Congratulations! Your LEARNIT application is now live! 🎓✨

# Render + Vercel PaaS Deployment Guide

## ✅ Yes, Render + Vercel works perfectly!

This is a **highly recommended** and **widely used** combination for MERN stack applications.

---

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Render        │
│   (Frontend)    │    │   (Backend)     │
│                 │    │                 │
│ React App       │◄──►│ Node.js API     │
│ Static Files    │    │ MongoDB         │
│ CDN             │    │ File Uploads    │
└─────────────────┘    └─────────────────┘
     https://your-app.vercel.app
     https://your-api.onrender.com
```

---

## 🚀 Why This Combination Works

### Vercel (Frontend) Benefits:
- **Zero-config deployment** for React apps
- **Global CDN** for fast loading
- **Automatic HTTPS** and SSL certificates
- **Custom domains** supported
- **Preview deployments** for testing
- **Edge functions** support

### Render (Backend) Benefits:
- **Free tier available** for small projects
- **Supports Node.js** and MongoDB
- **Persistent storage** for file uploads
- **Environment variables** management
- **Auto-deploy from Git**
- **Custom domains** supported

---

## 📋 Step-by-Step Setup

### Step 1: Deploy Backend to Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub/GitLab

2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select "Node" runtime
   - Set build command: `npm install`
   - Set start command: `npm start`

3. **Configure Environment Variables**
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://arunrealm2005_db_user:Gopal1947s@cluster0.paohzjl.mongodb.net/learning-system
   JWT_SECRET=your-super-secure-jwt-secret
   SESSION_SECRET=your-super-secure-session-secret
   CLIENT_URL=https://your-app-name.vercel.app
   GOOGLE_CLIENT_ID=988609377136-0gdsj3fv4ano3lo3q9j4phmi7k8m6jbl.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=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
   ```

### Step 2: Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Import your GitHub repository
   - Select the `client` folder as root directory

3. **Configure Vercel Settings**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

4. **Add Environment Variables**
   ```env
   REACT_APP_API_URL=https://your-render-app-name.onrender.com
   ```

### Step 3: Update API Configuration

1. **Update React App to use API URL**
   ```javascript
   // In your API calls, use:
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
   ```

2. **Update Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Add authorized redirect URI: `https://your-render-app-name.onrender.com/api/auth/google/callback`
   - Update authorized JavaScript origins: `https://your-app-name.vercel.app`

---

## 🔧 Configuration Files

### Vercel Configuration (client/vercel.json)
```json
{
  "version": 2,
  "name": "learnit-frontend",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-render-app-name.onrender.com/api/$1",
      "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    },
    {
      "src": "/uploads/(.*)",
      "dest": "https://your-render-app-name.onrender.com/uploads/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://your-render-app-name.onrender.com"
  }
}
```

### Render Configuration (render.yaml)
```yaml
services:
  - type: web
    name: learnit-backend
    env: node
    repo: https://github.com/yourusername/LEARNIT
    rootDir: server
    buildCommand: "npm install"
    startCommand: "npm start"
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: SESSION_SECRET
        sync: false
      - key: CLIENT_URL
        value: https://your-app-name.vercel.app
      - key: GOOGLE_CLIENT_ID
        sync: false
      - key: GOOGLE_CLIENT_SECRET
        sync: false
```

---

## 🌐 CORS Configuration

Update your server CORS settings:

```javascript
// In server/index.js
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app-name.vercel.app'
  ],
  credentials: true
}));
```

---

## 💰 Cost Breakdown

### Free Tier Limits:
- **Vercel**: 100GB bandwidth/month, free SSL, custom domains
- **Render**: 750 hours/month (enough for 24/7), 512MB RAM, 10GB storage

### When to Upgrade:
- High traffic (>100GB/month)
- Large file storage needs
- Performance requirements
- Custom domain with advanced features

---

## 🔄 Deployment Workflow

### Automatic Deployment:
1. Push to GitHub
2. Render auto-deploys backend
3. Vercel auto-deploys frontend
4. Both services update automatically

### Manual Deployment:
```bash
# Backend (Render)
git push origin main

# Frontend (Vercel)
vercel --prod
```

---

## 🧪 Testing the Setup

1. **Backend Health Check:**
   ```
   https://your-render-app-name.onrender.com/api/health
   ```

2. **Frontend Access:**
   ```
   https://your-app-name.vercel.app
   ```

3. **Test Features:**
   - User registration/login
   - Google OAuth
   - File uploads
   - All user roles

---

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Check CLIENT_URL environment variable
   - Verify CORS origin configuration

2. **OAuth Redirect Mismatch:**
   - Update Google Cloud Console with correct redirect URI
   - Ensure CLIENT_URL matches exactly

3. **File Upload Issues:**
   - Render provides persistent storage
   - Check file size limits (10MB default)

4. **Database Connection:**
   - Verify MongoDB URI is accessible
   - Check network/firewall settings

---

## 🎯 Best Practices

1. **Environment Variables:**
   - Never commit secrets to Git
   - Use Render/Vercel environment variable management

2. **Performance:**
   - Enable Vercel Edge Functions for API calls
   - Use CDN for static assets

3. **Security:**
   - Enable HTTPS (automatic on both platforms)
   - Use secure cookies
   - Implement rate limiting

4. **Monitoring:**
   - Set up Vercel Analytics
   - Use Render logs for debugging

---

## ✅ Advantages of This Setup

- **Zero infrastructure management**
- **Automatic scaling**
- **Global CDN**
- **Free tiers available**
- **Easy deployment**
- **Professional URL**
- **SSL certificates included**
- **Custom domain support**

This combination is **production-ready** and used by thousands of applications worldwide! 🚀

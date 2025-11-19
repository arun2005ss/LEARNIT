# LEARNIT - Deployment Guide

## 🚀 Quick Deploy (Recommended)

### Prerequisites
- Node.js 16+ installed
- Vercel account (free)
- MongoDB Atlas account (free)

### One-Click Deployment
1. **Run the deployment script:**
   ```bash
   # On Windows
   deploy.bat
   
   # On Mac/Linux
   chmod +x deploy.sh
   ./deploy.sh
   ```

2. **Follow Vercel prompts:**
   - Login to Vercel
   - Link to your Git repository (optional)
   - Confirm project settings

3. **Set environment variables in Vercel dashboard:**
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Generate a secure random string
   - `SESSION_SECRET` - Generate another secure random string
   - `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET` - Your Google OAuth client secret

## 📋 Manual Deployment Steps

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Install Dependencies
```bash
npm install
cd client && npm install && cd ..
```

### 3. Build Client
```bash
cd client && npm run build && cd ..
```

### 4. Deploy
```bash
vercel --prod
```

## 🔧 Environment Variables

### Required for Production
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-super-secret-jwt-key-here
SESSION_SECRET=your-session-secret-here
CLIENT_URL=https://your-app.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Security Notes
- **Never commit `.env` files to Git**
- **Use strong, unique secrets for production**
- **Generate new secrets for each deployment**

## 🌐 After Deployment

1. **Update Google OAuth redirect URI:**
   - Go to Google Cloud Console
   - Add `https://your-app.vercel.app/auth/callback` to authorized redirect URIs

2. **Test your application:**
   - Visit your Vercel URL
   - Test user registration/login
   - Test Google OAuth
   - Verify all features work

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CLIENT_URL` matches your Vercel domain
   - Check Vercel environment variables

2. **Database Connection**
   - Verify MongoDB URI is correct
   - Check IP whitelist in MongoDB Atlas

3. **Google OAuth Issues**
   - Verify redirect URI in Google Console
   - Check client ID/secret in Vercel env

4. **Build Failures**
   - Check for missing dependencies
   - Verify all API routes use the centralized API instance

### Getting Help
- Check Vercel deployment logs
- Review browser console errors
- Verify all environment variables are set

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Vercel deployment logs
3. Verify MongoDB Atlas connection
4. Test locally with production env variables

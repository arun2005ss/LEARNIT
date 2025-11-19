@echo off
echo 🚀 Setting up Render deployment for LEARNIT...
echo.
echo 📋 Follow these steps:
echo.
echo 1️⃣ Go to: https://dashboard.render.com/
echo 2️⃣ Select your 'learnit' service  
echo 3️⃣ Go to 'Environment' tab
echo 4️⃣ Add these environment variables:
echo.
echo 🔧 Environment Variables:
echo PORT=10000
echo NODE_ENV=production
echo MONGODB_URI=mongodb+srv://arunrealm2005_db_user:Gopal1947s@cluster0.paohzjl.mongodb.net/learning-system?retryWrites=true&w=majority
echo JWT_SECRET=render-super-secret-jwt-key-2024
echo SESSION_SECRET=render-session-secret-2024
echo CLIENT_URL=https://learnit-awe9.onrender.com
echo GOOGLE_CLIENT_ID=988609377136-0gdsj3fv4ano3lo3q9j4phmi7k8m6jbl.apps.googleusercontent.com
echo GOOGLE_CLIENT_SECRET=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
echo.
echo 5️⃣ Click 'Save Changes'
echo 6️⃣ Render will automatically redeploy
echo.
echo ✅ After setup, your app will be available at:
echo https://learnit-awe9.onrender.com
echo.
echo 🔍 Check logs at: https://dashboard.render.com/web/learnit-awe9/logs
pause

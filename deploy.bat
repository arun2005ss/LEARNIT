@echo off
echo 🚀 Starting deployment process...

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install
cd client
npm install
cd ..

REM Build the client
echo 🔨 Building client...
cd client
npm run build
cd ..

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
vercel --prod

echo ✅ Deployment complete!
pause

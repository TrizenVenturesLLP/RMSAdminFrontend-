@echo off
echo 🚀 Deploying Riders Moto Shop Admin Dashboard...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    exit /b 1
)

echo 📋 Current directory: %CD%
echo 🌍 Environment: Production

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Build the application
echo 🔨 Building application...
npm run build

REM Check if build was successful
if %ERRORLEVEL% EQU 0 (
    echo ✅ Build completed successfully
) else (
    echo ❌ Build failed
    exit /b 1
)

echo 🎉 Deployment preparation completed!
echo 📝 Ready for CapRover deployment

#!/bin/bash

echo "🚀 Deploying Riders Moto Shop Admin Dashboard..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "📋 Current directory: $(pwd)"
echo "🌍 Environment: Production"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully"
else
    echo "❌ Build failed"
    exit 1
fi

echo "🎉 Deployment preparation completed!"
echo "📝 Ready for CapRover deployment"

#!/bin/bash

# Deployment Script for VPS
# Usage: bash scripts/deploy-to-vps.sh user@vps-ip /path/on/vps

VPS_USER_HOST=$1
VPS_PATH=${2:-/var/www/amer-shop}

if [ -z "$VPS_USER_HOST" ]; then
    echo "Usage: bash scripts/deploy-to-vps.sh user@vps-ip [path]"
    echo "Example: bash scripts/deploy-to-vps.sh root@192.168.1.100 /var/www/amer-shop"
    exit 1
fi

echo "🚀 Deploying AMER SHOP to VPS..."
echo "VPS: $VPS_USER_HOST"
echo "Path: $VPS_PATH"
echo ""

# Create directory on VPS
echo "📁 Creating directory on VPS..."
ssh $VPS_USER_HOST "mkdir -p $VPS_PATH"

# Upload files (excluding node_modules, .next, .env.local)
echo "📤 Uploading files..."
rsync -avz \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.env.local' \
  --exclude '.git' \
  --exclude '*.log' \
  ./ $VPS_USER_HOST:$VPS_PATH/

# Install dependencies on VPS
echo "📦 Installing dependencies on VPS..."
ssh $VPS_USER_HOST "cd $VPS_PATH && npm install --production"

# Build on VPS
echo "🔨 Building application..."
ssh $VPS_USER_HOST "cd $VPS_PATH && npm run build"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps on VPS:"
echo "   1. Create .env.local with database credentials"
echo "   2. Run: node scripts/create-admin-vps.js"
echo "   3. Start: npm start (or use PM2)"
echo ""


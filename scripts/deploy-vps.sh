#!/bin/bash
# Auto-deploy script for VPS
# This script is called by GitHub Actions or webhook

set -e

echo "=== Starting Deployment ==="

cd /var/www/amer-shop

echo "Pulling latest changes..."
git pull origin main || git pull origin master

echo "Installing dependencies..."
npm install --production

echo "Building project..."
npm run build

echo "Restarting PM2..."
pm2 restart amer-shop || npx pm2 restart amer-shop || /root/.nvm/versions/node/v24.11.1/bin/pm2 restart amer-shop

echo "=== Deployment Complete ==="


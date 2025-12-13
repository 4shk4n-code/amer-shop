#!/bin/bash

# VPS Database Setup Script
# Run this on your VPS: bash scripts/setup-vps-database.sh

echo "🚀 AMER SHOP VPS Database Setup"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}❌ MySQL is not installed!${NC}"
    echo "Install MySQL: sudo apt-get install mysql-server"
    exit 1
fi

# Check if MySQL is running
if ! systemctl is-active --quiet mysql && ! systemctl is-active --quiet mariadb; then
    echo -e "${YELLOW}⚠️  MySQL is not running. Starting...${NC}"
    sudo systemctl start mysql || sudo systemctl start mariadb
    sleep 2
fi

echo -e "${GREEN}✅ MySQL is running${NC}"
echo ""

# Get database credentials
read -p "MySQL root user (default: root): " DB_ROOT_USER
DB_ROOT_USER=${DB_ROOT_USER:-root}

read -sp "MySQL root password: " DB_ROOT_PASS
echo ""

read -p "Database name (default: amer_shop): " DB_NAME
DB_NAME=${DB_NAME:-amer_shop}

read -p "Database user (default: amer_shop_user): " DB_USER
DB_USER=${DB_USER:-amer_shop_user}

read -sp "Database user password: " DB_PASS
echo ""

# Create database
echo ""
echo "📦 Creating database..."
mysql -u "$DB_ROOT_USER" -p"$DB_ROOT_PASS" <<EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database created${NC}"
else
    echo -e "${RED}❌ Failed to create database${NC}"
    exit 1
fi

# Import schema
echo "📝 Importing database schema..."
if [ -f "database/schema.sql" ]; then
    mysql -u "$DB_ROOT_USER" -p"$DB_ROOT_PASS" "$DB_NAME" < database/schema.sql
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Schema imported${NC}"
    else
        echo -e "${RED}❌ Failed to import schema${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  schema.sql not found. Skipping...${NC}"
fi

# Create admin user
echo "👤 Creating admin user..."
if command -v node &> /dev/null && [ -f "scripts/create-admin.js" ]; then
    # Create temporary .env for script
    cat > .env.temp <<EOF
DB_HOST=localhost
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASS
DB_NAME=$DB_NAME
JWT_SECRET=temp-secret-change-me
EOF
    
    node scripts/create-admin.js
    rm .env.temp
    
    echo -e "${GREEN}✅ Admin user created${NC}"
else
    echo -e "${YELLOW}⚠️  Node.js not found. Create admin manually.${NC}"
fi

# Create .env.local
echo "📝 Creating .env.local file..."
cat > .env.local <<EOF
# Database Configuration
DB_HOST=localhost
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASS
DB_NAME=$DB_NAME

# JWT Secret (CHANGE THIS!)
JWT_SECRET=$(openssl rand -hex 32)

# Next.js
NEXT_PUBLIC_SITE_URL=https://your-domain.com
EOF

echo -e "${GREEN}✅ .env.local created${NC}"

echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "📧 Admin Login Credentials:"
echo "   Email: admin@amershop.com"
echo "   Password: admin123"
echo ""
echo "⚠️  IMPORTANT:"
echo "   1. Change admin password after first login"
echo "   2. Update NEXT_PUBLIC_SITE_URL in .env.local"
echo "   3. Change JWT_SECRET in .env.local"
echo ""
echo "🚀 Next steps:"
echo "   1. npm install"
echo "   2. npm run build"
echo "   3. npm start (or use PM2)"
echo ""


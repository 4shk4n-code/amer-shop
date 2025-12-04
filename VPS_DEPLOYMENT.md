# VPS Deployment Guide - AMER SHOP

## Prerequisites
- VPS with existing site and mail server
- SSH access to VPS
- MySQL/MariaDB installed on VPS
- Node.js 18+ installed on VPS

## Step-by-Step VPS Setup

### STEP 1: Connect to Your VPS
```bash
ssh your-user@your-vps-ip
```

### STEP 2: Check MySQL Status
```bash
# Check if MySQL is running
sudo systemctl status mysql
# or
sudo systemctl status mariadb

# If not running, start it
sudo systemctl start mysql
# or
sudo systemctl start mariadb
```

### STEP 3: Create Database on VPS

Login to MySQL:
```bash
mysql -u root -p
```

Then run these commands:
```sql
CREATE DATABASE IF NOT EXISTS amer_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'amer_shop_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON amer_shop.* TO 'amer_shop_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Remember the password you set!**

### STEP 4: Upload Database Schema

On your local machine, upload the schema file:
```bash
scp database/schema.sql your-user@your-vps-ip:/tmp/
```

Then on VPS, import it:
```bash
mysql -u amer_shop_user -p amer_shop < /tmp/schema.sql
```

### STEP 5: Upload Project Files

On your local machine:
```bash
# Create a deployment package (excluding node_modules)
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.env.local' \
  ./ your-user@your-vps-ip:/path/to/your/site/amer-shop/
```

Or use git:
```bash
# On VPS
cd /path/to/your/site
git clone your-repo-url amer-shop
cd amer-shop
npm install
```

### STEP 6: Create Production Environment File

On VPS, create `.env.production` or `.env.local`:
```bash
cd /path/to/your/site/amer-shop
nano .env.local
```

Add this content:
```env
DB_HOST=localhost
DB_USER=amer_shop_user
DB_PASSWORD=STRONG_PASSWORD_HERE
DB_NAME=amer_shop
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### STEP 7: Create Admin User

On VPS:
```bash
cd /path/to/your/site/amer-shop
node scripts/create-admin.js
```

This will create:
- Email: `admin@amershop.com`
- Password: `admin123`

### STEP 8: Build and Start Application

```bash
# Build the application
npm run build

# Start in production mode
npm start
```

Or use PM2 (recommended):
```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start npm --name "amer-shop" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### STEP 9: Configure Nginx/Apache (if needed)

If you need to add a subdomain or path:

**Nginx example:**
```nginx
server {
    listen 80;
    server_name shop.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### STEP 10: Access Admin Panel

Go to: `https://your-domain.com/admin`

Login with:
- Email: `admin@amershop.com`
- Password: `admin123`

## Security Checklist

- [ ] Change admin password after first login
- [ ] Use strong database password
- [ ] Change JWT_SECRET to random string
- [ ] Enable HTTPS/SSL
- [ ] Set up firewall rules
- [ ] Regular database backups
- [ ] Keep Node.js and dependencies updated

## Troubleshooting

### Database Connection Error
- Check MySQL is running: `sudo systemctl status mysql`
- Verify credentials in `.env.local`
- Test connection: `mysql -u amer_shop_user -p amer_shop`

### Port Already in Use
- Check what's using port 3000: `sudo lsof -i :3000`
- Change port in `.env.local`: `PORT=3001`
- Update proxy configuration

### Permission Errors
- Check file permissions: `chmod -R 755 /path/to/amer-shop`
- Check MySQL user permissions

## Backup Database

```bash
# Create backup
mysqldump -u amer_shop_user -p amer_shop > backup_$(date +%Y%m%d).sql

# Restore backup
mysql -u amer_shop_user -p amer_shop < backup_20240101.sql
```


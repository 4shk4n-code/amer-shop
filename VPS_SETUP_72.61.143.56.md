# VPS Setup Guide - 72.61.143.56

## Step-by-Step Setup for Your VPS

### Prerequisites
- SSH access to 72.61.143.56
- MySQL/MariaDB installed on VPS
- Node.js 18+ installed on VPS

---

## STEP 1: Connect to VPS

```bash
ssh root@72.61.143.56
# or
ssh your-username@72.61.143.56
```

**If you don't know the username, try:**
- `root`
- `admin`
- `ubuntu` (if Ubuntu)
- `centos` (if CentOS)

---

## STEP 2: Check MySQL Status

Once connected to VPS, run:
```bash
sudo systemctl status mysql
# or
sudo systemctl status mariadb
```

**If MySQL is not running:**
```bash
sudo systemctl start mysql
# or
sudo systemctl start mariadb
```

**If MySQL is not installed:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# CentOS/RHEL
sudo yum install mysql-server
sudo systemctl start mysqld
```

---

## STEP 3: Check Node.js

```bash
node --version
npm --version
```

**If Node.js is not installed:**
```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or use nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
```

---

## STEP 4: Upload Project Files

### Option A: Using SCP (from your local machine)

```bash
# From your local machine (Windows PowerShell)
scp -r . root@72.61.143.56:/var/www/amer-shop
```

### Option B: Using Git (if you have a repo)

On VPS:
```bash
cd /var/www
git clone your-repo-url amer-shop
cd amer-shop
```

### Option C: Manual Upload

1. Create directory on VPS:
```bash
mkdir -p /var/www/amer-shop
cd /var/www/amer-shop
```

2. Upload files using FTP/SFTP client or use the deployment script

---

## STEP 5: Set Up Database

On VPS, navigate to project:
```bash
cd /var/www/amer-shop
```

Run the setup script:
```bash
bash scripts/setup-vps-database.sh
```

**Or manually:**

1. Login to MySQL:
```bash
mysql -u root -p
```

2. Create database and user:
```sql
CREATE DATABASE IF NOT EXISTS amer_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'amer_shop_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON amer_shop.* TO 'amer_shop_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

3. Import schema:
```bash
mysql -u amer_shop_user -p amer_shop < database/schema.sql
```

---

## STEP 6: Create Environment File

```bash
cd /var/www/amer-shop
nano .env.local
```

Add:
```env
DB_HOST=localhost
DB_USER=amer_shop_user
DB_PASSWORD=YOUR_PASSWORD_HERE
DB_NAME=amer_shop
JWT_SECRET=change-this-to-random-string-$(openssl rand -hex 32)
NEXT_PUBLIC_SITE_URL=http://72.61.143.56:3000
```

Save: `Ctrl+X`, then `Y`, then `Enter`

---

## STEP 7: Create Admin User

```bash
node scripts/create-admin-vps.js
```

This creates:
- Email: `admin@amershop.com`
- Password: `admin123`

---

## STEP 8: Install Dependencies and Build

```bash
cd /var/www/amer-shop
npm install
npm run build
```

---

## STEP 9: Start Application

### Option A: Direct Start (for testing)
```bash
npm start
```

### Option B: Using PM2 (recommended for production)
```bash
npm install -g pm2
pm2 start npm --name "amer-shop" -- start
pm2 save
pm2 startup
```

---

## STEP 10: Access Admin Panel

Open in browser:
```
http://72.61.143.56:3000/admin
```

Login:
- Email: `admin@amershop.com`
- Password: `admin123`

---

## Configure Firewall (if needed)

```bash
# Allow port 3000
sudo ufw allow 3000/tcp
# or
sudo firewall-cmd --add-port=3000/tcp --permanent
sudo firewall-cmd --reload
```

---

## Troubleshooting

### Can't connect via SSH
- Check if SSH is enabled: `sudo systemctl status ssh`
- Check firewall: `sudo ufw status`

### MySQL connection error
- Check MySQL is running: `sudo systemctl status mysql`
- Test connection: `mysql -u root -p`

### Port 3000 not accessible
- Check firewall rules
- Check if app is running: `pm2 list` or `netstat -tulpn | grep 3000`

---

## Admin Credentials Summary

- **Admin Email:** admin@amershop.com
- **Admin Password:** admin123
- **Admin URL:** http://72.61.143.56:3000/admin

⚠️ **Change password after first login!**


# Quick VPS Setup - 72.61.143.56

## 🚀 Quick Start Commands

### STEP 1: Connect to VPS
```bash
ssh root@72.61.143.56
```
(Replace `root` with your username if different)

---

### STEP 2: Once Connected, Run These Commands One by One:

```bash
# 1. Check MySQL
sudo systemctl status mysql

# 2. If MySQL not running, start it
sudo systemctl start mysql

# 3. Check Node.js
node --version

# 4. If Node.js not installed:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 5. Create project directory
sudo mkdir -p /var/www/amer-shop
sudo chown -R $USER:$USER /var/www/amer-shop
cd /var/www/amer-shop
```

---

### STEP 3: Upload Files from Your Local Machine

**Open a NEW terminal window on your local machine** (keep VPS SSH session open):

```bash
# Navigate to your project folder
cd E:\amertrading.shop

# Upload files to VPS
scp -r . root@72.61.143.56:/var/www/amer-shop
```

**OR use the deployment script:**
```bash
bash scripts/deploy-to-vps.sh root@72.61.143.56 /var/www/amer-shop
```

---

### STEP 4: Back on VPS, Set Up Database

```bash
# Go to project directory
cd /var/www/amer-shop

# Run database setup script
bash scripts/setup-vps-database.sh
```

**The script will ask you:**
- MySQL root password
- Database name (default: amer_shop)
- Database user (default: amer_shop_user)
- Database user password

---

### STEP 5: Install and Build

```bash
cd /var/www/amer-shop
npm install
npm run build
```

---

### STEP 6: Create Admin User

```bash
node scripts/create-admin-vps.js
```

---

### STEP 7: Start Application

```bash
# Install PM2 (process manager)
npm install -g pm2

# Start app
pm2 start npm --name "amer-shop" -- start

# Save PM2 config
pm2 save
pm2 startup
```

---

### STEP 8: Access Admin Panel

Open browser:
```
http://72.61.143.56:3000/admin
```

Login:
- Email: `admin@amershop.com`
- Password: `admin123`

---

## ✅ Done!

Your admin panel is now live at: http://72.61.143.56:3000/admin


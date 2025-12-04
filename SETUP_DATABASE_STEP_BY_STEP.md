# Step-by-Step Database Setup Guide

## STEP 1: Install MySQL

### Option A: Download MySQL Installer (Recommended)
1. Go to: https://dev.mysql.com/downloads/installer/
2. Download "MySQL Installer for Windows"
3. Run the installer
4. Choose "Developer Default" or "Server only"
5. **IMPORTANT:** Remember the root password you set!
6. Make sure MySQL starts as a Windows Service

### Option B: Use XAMPP (Easier)
1. Download XAMPP: https://www.apachefriends.org/
2. Install XAMPP
3. Open XAMPP Control Panel
4. Click "Start" next to MySQL
5. MySQL will run on port 3306

## STEP 2: Create Database

After MySQL is installed and running, open Command Prompt or PowerShell and run:

```bash
mysql -u root -p
```

Enter your MySQL root password when prompted.

Then run these commands one by one:

```sql
CREATE DATABASE IF NOT EXISTS amer_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE amer_shop;
```

Then copy and paste the entire contents of `database/schema.sql` into the MySQL command line.

OR use this command from your project folder:
```bash
mysql -u root -p < database/schema.sql
```

## STEP 3: Create Admin User

From your project folder, run:
```bash
node scripts/create-admin.js
```

This will create:
- Email: `admin@amershop.com`
- Password: `admin123`

## STEP 4: Configure Environment

Create a file named `.env.local` in your project root with:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_ROOT_PASSWORD_HERE
DB_NAME=amer_shop
JWT_SECRET=amer-shop-super-secret-jwt-key-2024
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Replace `YOUR_MYSQL_ROOT_PASSWORD_HERE` with your actual MySQL root password.

## STEP 5: Restart Server

Stop the current server (Ctrl+C) and restart:
```bash
npm run dev
```

## STEP 6: Test Admin Login

1. Go to: http://localhost:3000/admin
2. Login with:
   - Email: `admin@amershop.com`
   - Password: `admin123`

## STEP 7: Add a Test Product

1. Click "Add New Product"
2. Fill in:
   - Name: Test Product
   - Price: 99.99
   - Category: Select any category
   - Stock Quantity: 10
3. Click "Create Product"
4. Check the products list - your product should appear!

## Troubleshooting

### "Can't connect to MySQL"
- Make sure MySQL service is running
- Check if MySQL is on port 3306
- Verify password in `.env.local`

### "Database doesn't exist"
- Run: `mysql -u root -p < database/schema.sql`

### "Admin login fails"
- Run: `node scripts/create-admin.js`
- Check `.env.local` has correct password


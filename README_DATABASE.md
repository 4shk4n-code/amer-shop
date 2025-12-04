# Database Setup Guide

## MySQL Database Setup

### 1. Install MySQL

If you don't have MySQL installed, download and install it from:
- Windows: https://dev.mysql.com/downloads/installer/
- macOS: `brew install mysql`
- Linux: `sudo apt-get install mysql-server` (Ubuntu/Debian)

### 2. Start MySQL Server

**Windows:**
- Open MySQL Command Line Client or MySQL Workbench
- Or start MySQL service from Services

**macOS/Linux:**
```bash
sudo systemctl start mysql
# or
brew services start mysql
```

### 3. Create Database and Tables

1. Open MySQL command line or MySQL Workbench
2. Run the SQL file to create the database and tables:

```bash
mysql -u root -p < database/schema.sql
```

Or manually:
```sql
mysql -u root -p
source database/schema.sql
```

### 4. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=amer_shop
JWT_SECRET=your-secret-key-change-this
```

### 5. Default Admin Credentials

After running the schema, you can login with:
- **Email:** admin@amershop.com
- **Password:** admin123

**⚠️ IMPORTANT:** Change the admin password immediately after first login!

### 6. Test Database Connection

Start the development server:
```bash
npm run dev
```

Visit: `http://localhost:3000/admin`

If you see the login page, the database connection is working!

## Database Schema Overview

- **categories** - Product categories
- **products** - Product information
- **product_images** - Product images (multiple per product)
- **product_specifications** - Product specifications/key-value pairs
- **users** - Admin and customer accounts
- **orders** - Customer orders
- **order_items** - Items in each order
- **cart** - Shopping cart for logged-in users

## Troubleshooting

### Connection Error
- Check MySQL is running: `mysql -u root -p`
- Verify credentials in `.env.local`
- Ensure database `amer_shop` exists

### Permission Denied
- Grant privileges: `GRANT ALL PRIVILEGES ON amer_shop.* TO 'root'@'localhost';`
- Flush privileges: `FLUSH PRIVILEGES;`

### Port Already in Use
- Change MySQL port or check if another MySQL instance is running


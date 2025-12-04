# AMER SHOP - E-Commerce MVP Setup Instructions

## Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up MySQL Database

#### Option A: Using MySQL Command Line
```bash
# Login to MySQL
mysql -u root -p

# Run the schema file
source database/schema.sql
```

#### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open `database/schema.sql`
4. Execute the script

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=amer_shop
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Access the Application

- **Frontend:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin
  - Email: `admin@amershop.com`
  - Password: `admin123`

⚠️ **IMPORTANT:** Change the admin password immediately after first login!

## Features Implemented

### ✅ Admin Panel
- Login system with JWT authentication
- Add/Edit/Delete products
- Product management with:
  - Name, description, pricing
  - Category assignment
  - Stock management
  - Multiple images
  - Product specifications
- View all products in a table

### ✅ Product Management
- Full CRUD API for products
- Category management
- Image upload support (URLs)
- Stock tracking
- Product specifications

### ✅ Frontend
- Homepage with dynamic product loading
- Product listing page with filters
- Product detail pages
- Category pages
- Shopping cart (localStorage)
- Favorites/Wishlist system

### ✅ Database Schema
- Products table
- Categories table
- Product images table
- Product specifications table
- Users table (admin/customer)
- Orders table
- Order items table
- Cart table

## Database Structure

### Products
- Basic info (name, description, price)
- Stock management
- Category assignment
- Multiple images
- Specifications (key-value pairs)

### Categories
- Hierarchical support (parent categories)
- Active/inactive status
- Sort ordering

### Orders
- Customer information
- Order items
- Status tracking
- Payment information

## API Endpoints

### Products
- `GET /api/products` - List all products (with filters)
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category (admin)

### Orders
- `GET /api/orders` - List orders (admin)
- `POST /api/orders` - Create order

### Authentication
- `POST /api/auth/login` - Admin login

## Next Steps for Full MVP

1. **Image Upload**
   - Implement file upload for product images
   - Use cloud storage (AWS S3, Cloudinary, etc.)

2. **Order Management**
   - Order status updates
   - Order history for customers
   - Email notifications

3. **Payment Integration**
   - Payment gateway integration
   - Payment status tracking

4. **User Authentication**
   - Customer registration/login
   - Password reset
   - Profile management

5. **Search & Filters**
   - Full-text search
   - Advanced filtering
   - Sorting options

6. **Reviews & Ratings**
   - Product reviews
   - Rating system
   - Review moderation

## Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check credentials in `.env.local`
- Ensure database `amer_shop` exists

### Products Not Showing
- Check if products exist in database
- Verify API routes are working
- Check browser console for errors

### Admin Login Not Working
- Verify admin user exists in database
- Check JWT_SECRET in `.env.local`
- Clear browser localStorage

## Support

For issues or questions, check:
1. Database connection
2. Environment variables
3. Browser console for errors
4. Server logs


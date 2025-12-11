# Vercel Deployment Guide for amer-shop

## Your Vercel Project
**URL**: https://vercel.com/mohammadhossein-tajiks-projects/amer-shop

## Step 1: Set Up Database on Vercel

### Option A: Vercel Postgres (Recommended - Easiest)
1. Go to your Vercel project: https://vercel.com/mohammadhossein-tajiks-projects/amer-shop
2. Click on **Storage** tab
3. Click **Create Database** → Select **Postgres**
4. Choose a name (e.g., "amer-shop-db")
5. Select a region (choose closest to your users)
6. Click **Create**
7. Once created, go to **.env.local** tab in the database settings
8. Copy the `POSTGRES_URL` - this is your `DATABASE_URL`

### Option B: External PostgreSQL (Supabase - Free)
1. Go to https://supabase.com and sign up
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the **Connection string** (URI format)
5. Use this as your `DATABASE_URL`

## Step 2: Add Environment Variables in Vercel

Go to your Vercel project → **Settings** → **Environment Variables** and add:

### Required Variables:

```
DATABASE_URL=your-postgres-connection-string-from-step-1
NEXTAUTH_URL=https://amer-shop.vercel.app (or your custom domain)
NEXTAUTH_SECRET=generate-a-random-32-character-secret
ADMIN_CREATE_SECRET=another-random-secret-for-creating-admin
```

### Optional (for Google OAuth):

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### How to Generate Secrets:

**For NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

Or visit: https://generate-secret.vercel.app/32

**For ADMIN_CREATE_SECRET:**
Use any random string (you'll use this once to create your admin user)

## Step 3: Deploy

1. **Push your code to GitHub** (if not already connected):
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Vercel will automatically:**
   - Detect the push
   - Install dependencies
   - Run `prisma generate`
   - Run `prisma migrate deploy` (creates database tables)
   - Build and deploy your app

3. **Wait for deployment to complete**

## Step 4: Create Your Admin User

After deployment, create your admin user:

### Method 1: Using API (Easiest)
```bash
curl -X POST https://amer-shop.vercel.app/api/admin/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "name": "Admin User",
    "secret": "your-ADMIN_CREATE_SECRET"
  }'
```

### Method 2: Using Vercel Database Dashboard
1. Go to your Vercel project → **Storage** → Your database
2. Click **Data** tab
3. Find the `users` table
4. Add a new row or edit existing:
   - `email`: your email
   - `name`: your name
   - `role`: `"admin"`

### Method 3: Sign in with Google OAuth
1. Sign in with Google on your deployed site
2. Then use Method 2 to change your role to "admin"

## Step 5: Verify Everything Works

1. Visit your deployed site
2. Sign in (Google OAuth or credentials)
3. Visit `/admin` - you should see the admin dashboard
4. Test adding products, viewing orders, etc.

## Troubleshooting

### Database Connection Issues
- Make sure `DATABASE_URL` is set correctly in Vercel
- Check that the database is created and running
- Verify the connection string format

### Build Fails
- Check Vercel build logs
- Make sure all environment variables are set
- Verify Prisma migrations are working

### Admin Access Issues
- Make sure you set `role: "admin"` in the database
- Check that you're signed in with the correct email

## Your Project Structure

```
amer-shop/
├── app/
│   ├── admin/          # Admin dashboard (protected)
│   ├── api/            # API routes
│   └── ...
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── migrations/     # Database migrations
├── lib/
│   ├── prisma.ts       # Prisma client
│   └── auth.ts         # NextAuth config
└── vercel.json         # Vercel configuration
```

## Next Steps After Deployment

1. ✅ Database is set up
2. ✅ Admin user created
3. ✅ Add products via `/admin/products`
4. ✅ Add categories via `/admin/categories`
5. ✅ Start managing orders!

Your site is now fully functional with:
- ✅ User authentication
- ✅ Database (PostgreSQL)
- ✅ Admin dashboard
- ✅ Product management
- ✅ Order management
- ✅ Cart functionality


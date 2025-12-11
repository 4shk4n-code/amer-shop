# Quick Vercel Setup Guide

## 1. Database Setup

### Using Vercel Postgres:
1. In Vercel dashboard → Your Project → Storage
2. Click "Create Database" → Select "Postgres"
3. Create database
4. Copy the `POSTGRES_URL` connection string

### Using External (Supabase - Free):
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the "Connection string" (URI format)
5. Use this as your `DATABASE_URL`

## 2. Environment Variables in Vercel

Go to Vercel Project → Settings → Environment Variables and add:

```
DATABASE_URL=your-postgres-connection-string
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=generate-a-random-secret-here
ADMIN_CREATE_SECRET=your-secret-for-creating-admin
GOOGLE_CLIENT_ID=optional
GOOGLE_CLIENT_SECRET=optional
```

## 3. Generate NEXTAUTH_SECRET

Run this in terminal:
```bash
openssl rand -base64 32
```

Or use: https://generate-secret.vercel.app/32

## 4. Create Admin User

After deployment, you can create an admin user via API:

```bash
curl -X POST https://your-app.vercel.app/api/admin/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "name": "Admin User",
    "secret": "your-ADMIN_CREATE_SECRET"
  }'
```

Or use the Vercel database dashboard to manually set a user's role to "admin".

## 5. Deploy

Just push to GitHub - Vercel will auto-deploy!

The build process will:
1. Install dependencies
2. Generate Prisma Client
3. Run database migrations
4. Build Next.js app


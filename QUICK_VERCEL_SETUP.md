# Quick Setup for Vercel Project: amer-shop

## ✅ What's Already Done

- ✅ Code pushed to GitHub: `4shk4n-code/amer-shop`
- ✅ Backend fully configured (Prisma, PostgreSQL ready)
- ✅ Admin dashboard created
- ✅ API routes ready
- ✅ Authentication set up
- ✅ Vercel configuration file (`vercel.json`)

## 🚀 What You Need to Do in Vercel Dashboard

### Step 1: Connect Database (2 minutes)

1. Go to: **https://vercel.com/mohammadhossein-tajiks-projects/amer-shop**
2. Click **Storage** tab (in the left sidebar)
3. Click **Create Database** → Select **Postgres**
4. Name it: `amer-shop-db` (or any name)
5. Choose region (closest to your users)
6. Click **Create**
7. Wait for it to be created (30 seconds)

### Step 2: Get Database URL (1 minute)

1. In the database you just created, click **.env.local** tab
2. Copy the `POSTGRES_URL` value
   - It looks like: `postgres://default:xxxxx@xxxxx.aws.neon.tech:5432/verceldb?sslmode=require`

### Step 3: Add Environment Variables (2 minutes)

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Add these variables:

**Variable 1:**
- Key: `DATABASE_URL`
- Value: (paste the POSTGRES_URL from Step 2)
- Environment: Production, Preview, Development (select all)

**Variable 2:**
- Key: `NEXTAUTH_URL`
- Value: `https://amer-shop.vercel.app` (or your custom domain)
- Environment: Production, Preview, Development

**Variable 3:**
- Key: `NEXTAUTH_SECRET`
- Value: (generate one - see below)
- Environment: Production, Preview, Development

**Variable 4:**
- Key: `ADMIN_CREATE_SECRET`
- Value: (any random string like `my-secret-123`)
- Environment: Production, Preview, Development

**To generate NEXTAUTH_SECRET:**
- Visit: https://generate-secret.vercel.app/32
- Or run in terminal: `openssl rand -base64 32`

### Step 4: Redeploy (Automatic)

1. After adding environment variables, Vercel will ask to redeploy
2. Click **Redeploy** or go to **Deployments** → Click the 3 dots → **Redeploy**
3. Wait for deployment (2-3 minutes)

### Step 5: Create Admin User (1 minute)

After deployment completes:

**Option A: Using API (Easiest)**
```bash
curl -X POST https://amer-shop.vercel.app/api/admin/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "name": "Admin User",
    "secret": "your-ADMIN_CREATE_SECRET"
  }'
```

**Option B: Using Vercel Database Dashboard**
1. Go to **Storage** → Your database → **Data** tab
2. Find `users` table
3. Click **Insert row** or edit existing
4. Set:
   - `email`: your email
   - `name`: your name
   - `role`: `"admin"` (with quotes)

## ✅ Done!

Now you can:
- Visit your site: `https://amer-shop.vercel.app`
- Sign in
- Go to `/admin` to access admin dashboard
- Add products, manage orders, etc.

## 🔍 Verify Everything Works

1. Visit: `https://amer-shop.vercel.app/api/health`
   - Should show: `{"status":"ok","database":"connected"}`

2. Visit: `https://amer-shop.vercel.app`
   - Should load your homepage

3. Visit: `https://amer-shop.vercel.app/admin`
   - Should show admin dashboard (if you're logged in as admin)

## 📝 Summary

**Total time needed:** ~5 minutes
**What you do:** Create database, add 4 environment variables, create admin user
**Everything else:** Already automated! 🎉


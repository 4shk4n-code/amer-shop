# Step-by-Step Vercel Setup

## ✅ Step 1: Get Your Database URL

You already have a Prisma Postgres database created! 

**What to do:**
1. On the Prisma dashboard page you're looking at
2. In the ".env.local" tab (which is already open)
3. Click **"Show secret"** (the eye icon) next to the code snippet
4. You'll see two URLs:
   - `PRISMA_DATABASE_URL` 
   - `POSTGRES_URL`
5. **Copy the `POSTGRES_URL`** - this is what we need!

**It will look like:**
```
postgres://default:xxxxx@xxxxx.aws.neon.tech:5432/verceldb?sslmode=require
```

**Once you have it copied, let me know and we'll move to Step 2!**

---

## Step 2: Add Environment Variables to Vercel (Next)

## Step 3: Redeploy (Next)

## Step 4: Create Admin User (Next)


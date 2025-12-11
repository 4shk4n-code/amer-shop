# Step 2: Add Environment Variables to Vercel

## What You Need to Do:

1. **Go to your Vercel project:**
   - Visit: https://vercel.com/mohammadhossein-tajiks-projects/amer-shop
   - Or go to Vercel Dashboard → Your Project

2. **Navigate to Environment Variables:**
   - Click **Settings** (in the top menu)
   - Click **Environment Variables** (in the left sidebar)

3. **Add the First Variable (DATABASE_URL):**
   - Click **Add New** button
   - **Key:** `DATABASE_URL`
   - **Value:** Paste this:
     ```
     postgres://d9eac47202cf6f9620e7b40ca4cbc0081646f75fa1742624d8df841efb172e2e:sk_pgwY0TUZ2jLXhQYMUzkiN@db.prisma.io:5432/postgres?sslmode=require
     ```
   - **Environment:** Select all three (Production, Preview, Development)
   - Click **Save**

4. **Add the Second Variable (NEXTAUTH_URL):**
   - Click **Add New** again
   - **Key:** `NEXTAUTH_URL`
   - **Value:** `https://amer-shop.vercel.app` (or your actual domain)
   - **Environment:** Select all three
   - Click **Save**

5. **Add the Third Variable (NEXTAUTH_SECRET):**
   - Click **Add New** again
   - **Key:** `NEXTAUTH_SECRET`
   - **Value:** I'll generate one for you (see below)
   - **Environment:** Select all three
   - Click **Save**

6. **Add the Fourth Variable (ADMIN_CREATE_SECRET):**
   - Click **Add New** again
   - **Key:** `ADMIN_CREATE_SECRET`
   - **Value:** `amershop-admin-2024-secret` (or any random string you want)
   - **Environment:** Select all three
   - Click **Save**

## Generated NEXTAUTH_SECRET for you:

Use this value for NEXTAUTH_SECRET:
```
NvDhAGt4jU5NLsewM4SlotpRfGUJPBuZwnP1H2tGw7o=
```

---

**Once you've added all 4 environment variables, let me know and we'll move to Step 3!**


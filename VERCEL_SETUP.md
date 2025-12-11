# Vercel Deployment Setup

## Database Setup on Vercel

### Option 1: Vercel Postgres (Recommended)
1. Go to your Vercel project dashboard
2. Navigate to Storage → Create Database → Postgres
3. Create a new Postgres database
4. Copy the connection string
5. Add it as `DATABASE_URL` in your Vercel environment variables

### Option 2: External PostgreSQL (Supabase, Neon, etc.)
1. Create a PostgreSQL database on Supabase/Neon/Railway
2. Copy the connection string
3. Add it as `DATABASE_URL` in Vercel environment variables

## Environment Variables Needed in Vercel

Add these in your Vercel project settings → Environment Variables:

```
DATABASE_URL=your-postgres-connection-string
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id (optional)
GOOGLE_CLIENT_SECRET=your-google-client-secret (optional)
```

## Deployment Steps

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Vercel will automatically:
   - Install dependencies
   - Run `prisma generate`
   - Run `prisma migrate deploy`
   - Build and deploy

## First Deployment

After first deployment:
1. Run migrations: The build command will handle this
2. Create admin user: Use Vercel's database dashboard or run a script

## Database Migrations

Migrations run automatically during build via `prisma migrate deploy` in the build command.


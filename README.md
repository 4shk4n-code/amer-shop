# AMER SHOP - E-commerce Platform

Full-featured e-commerce website built with Next.js, MySQL, and TypeScript.

**Last Updated:** 2025-12-04 - Auto-deployment configured with Vercel

## Features

- ✅ Product catalog with categories
- ✅ Shopping cart
- ✅ Checkout process
- ✅ Customer accounts & authentication
- ✅ Order tracking
- ✅ Product reviews & ratings
- ✅ Admin panel
- ✅ Image upload
- ✅ Search functionality

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your database credentials
```

3. Set up database:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p amer_shop < database/add_reviews_table.sql
```

4. Run development server:
```bash
npm run dev
```

## Deployment

### Manual Deployment
Use the `deploy.ps1` script for Windows or deploy manually via SSH.

### Auto Deployment
This repo is configured for GitHub Actions auto-deployment. Set up secrets:
- `VPS_HOST`: Your VPS IP
- `VPS_USER`: SSH username (usually `root`)
- `VPS_SSH_KEY`: Your SSH private key

## Tech Stack

- Next.js 14
- React
- TypeScript
- MySQL
- Tailwind CSS
- PM2 (production)

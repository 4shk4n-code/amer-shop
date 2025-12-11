# How to Seed the Database

After deploying the latest changes, you need to seed the database to add all the automotive products.

## Quick Steps

1. **Wait for Vercel to finish deploying** (check your Vercel dashboard)

2. **Visit the seed endpoint:**
   - Go to: `https://amertrading.shop/api/seed`
   - Or: `https://amertrading.shop/api/seed` in your browser

3. **Wait for it to complete** - You should see a success message with the number of products seeded

4. **Test a product page:**
   - Try: `https://amertrading.shop/product/auto-bp-se-5312`
   - Or: `https://amertrading.shop/product/auto-bp-se-5016`

## What Gets Seeded

- ✅ All categories (Electronics, Fashion, Home & Garden, Sports, Automotive, Toys)
- ✅ Featured products (4 products)
- ✅ Flash sale products (4 products)
- ✅ New arrivals (4 products)
- ✅ Category products:
  - Electronics (6 products)
  - Fashion (6 products)
  - Sports (6 products)
  - Toys (6 products)
  - Home & Garden (6 products)
  - **Automotive (33 brake pad products)** ← NEW!

## Total Products

After seeding, you should have **69 products** in your database.

## Admin Credentials

After seeding, you can sign in with:
- Email: `admin@amershop.com`
- Password: `admin123`

## Troubleshooting

If products still show 404 after seeding:
1. Check the browser console for errors
2. Verify the seed completed successfully
3. Check Vercel logs for any errors
4. Try visiting `/api/check-db` to see what's in the database


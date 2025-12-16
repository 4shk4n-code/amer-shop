-- Fix column types from SQLite to PostgreSQL
-- Convert DATETIME to TIMESTAMP and REAL to DOUBLE PRECISION
-- This migration handles columns that may be TEXT, TIMESTAMP, or other types

-- Fix users table
DO $$ 
BEGIN
  -- Check and fix emailVerified (handle TEXT or TIMESTAMP)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'emailVerified' AND data_type != 'timestamp without time zone') THEN
    ALTER TABLE "users" ALTER COLUMN "emailVerified" TYPE TIMESTAMP USING 
      CASE 
        WHEN "emailVerified"::text IS NULL OR "emailVerified"::text = '' THEN NULL
        ELSE "emailVerified"::TIMESTAMP
      END;
  END IF;
  
  -- Fix createdAt
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'createdAt' AND data_type != 'timestamp without time zone') THEN
    ALTER TABLE "users" ALTER COLUMN "createdAt" TYPE TIMESTAMP USING "createdAt"::TIMESTAMP;
  END IF;
  
  -- Fix updatedAt
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'updatedAt' AND data_type != 'timestamp without time zone') THEN
    ALTER TABLE "users" ALTER COLUMN "updatedAt" TYPE TIMESTAMP USING "updatedAt"::TIMESTAMP;
  END IF;
END $$;

-- Fix sessions table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sessions' AND column_name = 'expires' AND data_type != 'timestamp without time zone') THEN
    ALTER TABLE "sessions" ALTER COLUMN "expires" TYPE TIMESTAMP USING "expires"::TIMESTAMP;
  END IF;
END $$;

-- Fix verification_tokens table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'verification_tokens' AND column_name = 'expires' AND data_type != 'timestamp without time zone') THEN
    ALTER TABLE "verification_tokens" ALTER COLUMN "expires" TYPE TIMESTAMP USING "expires"::TIMESTAMP;
  END IF;
END $$;

-- Fix categories table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'createdAt' AND data_type != 'timestamp without time zone') THEN
    ALTER TABLE "categories" ALTER COLUMN "createdAt" TYPE TIMESTAMP USING "createdAt"::TIMESTAMP;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'updatedAt' AND data_type != 'timestamp without time zone') THEN
    ALTER TABLE "categories" ALTER COLUMN "updatedAt" TYPE TIMESTAMP USING "updatedAt"::TIMESTAMP;
  END IF;
END $$;

-- Fix products table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'price' AND data_type != 'double precision') THEN
    ALTER TABLE "products" ALTER COLUMN "price" TYPE DOUBLE PRECISION USING "price"::DOUBLE PRECISION;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'originalPrice' AND data_type != 'double precision') THEN
    ALTER TABLE "products" ALTER COLUMN "originalPrice" TYPE DOUBLE PRECISION USING "originalPrice"::DOUBLE PRECISION;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'tax' AND data_type != 'double precision') THEN
    ALTER TABLE "products" ALTER COLUMN "tax" TYPE DOUBLE PRECISION USING "tax"::DOUBLE PRECISION;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'createdAt' AND data_type != 'timestamp without time zone') THEN
    ALTER TABLE "products" ALTER COLUMN "createdAt" TYPE TIMESTAMP USING "createdAt"::TIMESTAMP;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'updatedAt' AND data_type != 'timestamp without time zone') THEN
    ALTER TABLE "products" ALTER COLUMN "updatedAt" TYPE TIMESTAMP USING "updatedAt"::TIMESTAMP;
  END IF;
END $$;

-- Fix cart_items table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'createdAt' AND data_type != 'timestamp without time zone') THEN
    ALTER TABLE "cart_items" ALTER COLUMN "createdAt" TYPE TIMESTAMP USING "createdAt"::TIMESTAMP;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'updatedAt' AND data_type != 'timestamp without time zone') THEN
    ALTER TABLE "cart_items" ALTER COLUMN "updatedAt" TYPE TIMESTAMP USING "updatedAt"::TIMESTAMP;
  END IF;
END $$;

-- Fix orders table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'total' AND data_type != 'double precision') THEN
    ALTER TABLE "orders" ALTER COLUMN "total" TYPE DOUBLE PRECISION USING "total"::DOUBLE PRECISION;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'subtotal' AND data_type != 'double precision') THEN
    ALTER TABLE "orders" ALTER COLUMN "subtotal" TYPE DOUBLE PRECISION USING "subtotal"::DOUBLE PRECISION;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'tax' AND data_type != 'double precision') THEN
    ALTER TABLE "orders" ALTER COLUMN "tax" TYPE DOUBLE PRECISION USING "tax"::DOUBLE PRECISION;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping' AND data_type != 'double precision') THEN
    ALTER TABLE "orders" ALTER COLUMN "shipping" TYPE DOUBLE PRECISION USING "shipping"::DOUBLE PRECISION;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'createdAt' AND data_type != 'timestamp without time zone') THEN
    ALTER TABLE "orders" ALTER COLUMN "createdAt" TYPE TIMESTAMP USING "createdAt"::TIMESTAMP;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'updatedAt' AND data_type != 'timestamp without time zone') THEN
    ALTER TABLE "orders" ALTER COLUMN "updatedAt" TYPE TIMESTAMP USING "updatedAt"::TIMESTAMP;
  END IF;
END $$;

-- Fix order_items table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'price' AND data_type != 'double precision') THEN
    ALTER TABLE "order_items" ALTER COLUMN "price" TYPE DOUBLE PRECISION USING "price"::DOUBLE PRECISION;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'createdAt' AND data_type != 'timestamp without time zone') THEN
    ALTER TABLE "order_items" ALTER COLUMN "createdAt" TYPE TIMESTAMP USING "createdAt"::TIMESTAMP;
  END IF;
END $$;

-- Fix addresses table (if it exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'addresses') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'addresses' AND column_name = 'createdAt' AND data_type != 'timestamp without time zone') THEN
      ALTER TABLE "addresses" ALTER COLUMN "createdAt" TYPE TIMESTAMP USING "createdAt"::TIMESTAMP;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'addresses' AND column_name = 'updatedAt' AND data_type != 'timestamp without time zone') THEN
      ALTER TABLE "addresses" ALTER COLUMN "updatedAt" TYPE TIMESTAMP USING "updatedAt"::TIMESTAMP;
    END IF;
  END IF;
END $$;

-- Fix wishlist_items table (if it exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wishlist_items') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wishlist_items' AND column_name = 'createdAt' AND data_type != 'timestamp without time zone') THEN
      ALTER TABLE "wishlist_items" ALTER COLUMN "createdAt" TYPE TIMESTAMP USING "createdAt"::TIMESTAMP;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wishlist_items' AND column_name = 'updatedAt' AND data_type != 'timestamp without time zone') THEN
      ALTER TABLE "wishlist_items" ALTER COLUMN "updatedAt" TYPE TIMESTAMP USING "updatedAt"::TIMESTAMP;
    END IF;
  END IF;
END $$;


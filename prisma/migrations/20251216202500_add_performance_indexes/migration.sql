-- Add performance indexes for common queries

-- Product indexes
CREATE INDEX IF NOT EXISTS "products_categoryId_idx" ON "products"("categoryId");
CREATE INDEX IF NOT EXISTS "products_isActive_idx" ON "products"("isActive");
CREATE INDEX IF NOT EXISTS "products_isActive_categoryId_idx" ON "products"("isActive", "categoryId");
CREATE INDEX IF NOT EXISTS "products_createdAt_idx" ON "products"("createdAt");

-- Order indexes
CREATE INDEX IF NOT EXISTS "orders_userId_idx" ON "orders"("userId");
CREATE INDEX IF NOT EXISTS "orders_userId_status_idx" ON "orders"("userId", "status");
CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders"("status");
CREATE INDEX IF NOT EXISTS "orders_createdAt_idx" ON "orders"("createdAt");

-- Cart item indexes
CREATE INDEX IF NOT EXISTS "cart_items_userId_idx" ON "cart_items"("userId");

-- Wishlist item indexes
CREATE INDEX IF NOT EXISTS "wishlist_items_userId_idx" ON "wishlist_items"("userId");

-- Address indexes
CREATE INDEX IF NOT EXISTS "addresses_userId_idx" ON "addresses"("userId");
CREATE INDEX IF NOT EXISTS "addresses_userId_type_idx" ON "addresses"("userId", "type");


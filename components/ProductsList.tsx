"use client";

import { useState, useMemo, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import ProductFiltersSidebar from "@/components/ProductFiltersSidebar";
import {
  filterProducts,
  sortProducts,
  getPriceRange,
  ProductFilterOptions,
  ProductWithCategory,
} from "@/lib/product-filters";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ProductsListProps {
  products: ProductWithCategory[];
  categories: Array<{ id: string; name: string; slug: string }>;
  initialCategoryId?: string;
}

export default function ProductsList({ 
  products, 
  categories,
  initialCategoryId 
}: ProductsListProps) {
  const [filters, setFilters] = useState<ProductFilterOptions>({
    sortBy: "newest",
    categoryId: initialCategoryId,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Update filters when initialCategoryId changes
  useEffect(() => {
    if (initialCategoryId) {
      setFilters(prev => ({ ...prev, categoryId: initialCategoryId }));
    }
  }, [initialCategoryId]);

  const priceRange = useMemo(() => getPriceRange(products), [products]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = filterProducts(products, filters);
    if (filters.sortBy) {
      result = sortProducts(result, filters.sortBy);
    }
    return result;
  }, [products, filters]);

  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.searchQuery ||
      (filters.categoryId && filters.categoryId !== initialCategoryId) ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.inStock !== undefined ||
      filters.isRefurbished !== undefined ||
      filters.brand ||
      filters.hasDeal ||
      filters.priceDrop !== undefined ||
      filters.minRating !== undefined ||
      (filters.sortBy && filters.sortBy !== "newest")
    );
  }, [filters, initialCategoryId]);

  const clearAllFilters = () => {
    setFilters({
      sortBy: "newest",
      categoryId: initialCategoryId,
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar Filters - Desktop */}
      <aside className="hidden md:block flex-shrink-0">
        <ProductFiltersSidebar
          categories={categories}
          products={products}
          filters={filters}
          onFiltersChange={setFilters}
          priceRange={priceRange}
          currentCategoryId={initialCategoryId}
        />
      </aside>

      {/* Mobile Filters Toggle */}
      <div className="md:hidden">
        <Button
          variant="outline"
          onClick={() => setShowMobileFilters(true)}
          className="w-full mb-4"
        >
          Filters {hasActiveFilters && <span className="ml-2">●</span>}
        </Button>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="h-full overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Filters</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileFilters(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <ProductFiltersSidebar
              categories={categories}
              products={products}
              filters={filters}
              onFiltersChange={setFilters}
              priceRange={priceRange}
              currentCategoryId={initialCategoryId}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar - Sort and Results Count */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="text-sm text-muted-foreground">
            Showing {filteredAndSortedProducts.length} of {products.length} products
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="ml-2 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Sort by:</label>
            <select
              value={filters.sortBy || "newest"}
              onChange={(e) =>
                setFilters({ ...filters, sortBy: e.target.value as any })
              }
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No products found matching your filters.
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="mt-4"
              >
                Clear all filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice || undefined}
                image={product.image || undefined}
                description={product.description || undefined}
                category={product.category.name}
                unit={product.unit || undefined}
                slug={product.slug}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

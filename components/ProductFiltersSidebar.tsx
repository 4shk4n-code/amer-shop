"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronUp, X, Star } from "lucide-react";
import { ProductFilterOptions, SortOption } from "@/lib/product-filters";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  onClear?: () => void;
  showClear?: boolean;
}

function FilterSection({ 
  title, 
  children, 
  defaultOpen = false, 
  onClear,
  showClear = false 
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 hover:text-primary transition-colors"
        >
          <span>{title}</span>
          <div className="flex items-center gap-2">
            {showClear && onClear && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 border border-blue-600 rounded"
              >
                Clear
              </button>
            )}
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </button>
      </div>
      {isOpen && <div className="space-y-2">{children}</div>}
    </div>
  );
}

interface ProductFiltersSidebarProps {
  categories: Category[];
  products: Array<{
    id: string;
    categoryId: string;
    price: number;
    originalPrice?: number | null;
    name: string;
    stock: number;
    isRefurbished: boolean;
    condition?: string | null;
  }>;
  filters: ProductFilterOptions;
  onFiltersChange: (filters: ProductFilterOptions) => void;
  priceRange?: { min: number; max: number };
  currentCategoryId?: string;
}

export default function ProductFiltersSidebar({
  categories,
  products,
  filters,
  onFiltersChange,
  priceRange,
  currentCategoryId,
}: ProductFiltersSidebarProps) {
  const updateFilter = (key: keyof ProductFilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  // Extract unique brands from product names (simple heuristic: take first word or common brand names)
  const brands = useMemo(() => {
    const brandSet = new Set<string>();
    products.forEach((product) => {
      // Try to extract brand from product name (first word or known patterns)
      if (product.name && typeof product.name === 'string') {
        const words = product.name.split(/\s+/);
        if (words[0] && words[0].length > 2) {
          brandSet.add(words[0]);
        }
      }
    });
    return Array.from(brandSet).sort().slice(0, 20); // Limit to 20 brands
  }, [products]);

  // Calculate product counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((product) => {
      counts[product.categoryId] = (counts[product.categoryId] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Check if has deals (has originalPrice higher than price)
  const hasDeals = useMemo(() => {
    return products.some((p) => p.originalPrice && p.originalPrice > p.price);
  }, [products]);

  // Get price drop percentage
  const getPriceDrop = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  const clearCategoryFilter = () => {
    updateFilter("categoryId", currentCategoryId || undefined);
  };

  const clearPriceFilter = () => {
    updateFilter("minPrice", undefined);
    updateFilter("maxPrice", undefined);
  };

  const clearBrandFilter = () => {
    updateFilter("brand", undefined);
  };

  const clearDealsFilter = () => {
    updateFilter("hasDeal", undefined);
  };

  const clearRatingFilter = () => {
    updateFilter("minRating", undefined);
  };

  const clearStockFilter = () => {
    updateFilter("inStock", undefined);
  };

  const clearRefurbishedFilter = () => {
    updateFilter("isRefurbished", undefined);
  };

  return (
    <div className="w-full md:w-64 lg:w-72 pr-4">
      <div className="sticky top-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-10"
            value={filters.searchQuery || ""}
            onChange={(e) => updateFilter("searchQuery", e.target.value)}
          />
        </div>

        {/* Category Filter */}
        {!currentCategoryId && categories.length > 0 && (
          <FilterSection
            title="Category"
            defaultOpen={true}
            showClear={!!filters.categoryId}
            onClear={clearCategoryFilter}
          >
            <div className="space-y-1 max-h-64 overflow-y-auto">
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  checked={!filters.categoryId}
                  onChange={(e) => {
                    if (e.target.checked) updateFilter("categoryId", undefined);
                  }}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">All Categories</span>
                <span className="text-xs text-gray-500 ml-auto">
                  ({products.length})
                </span>
              </label>
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={filters.categoryId === category.id}
                    onChange={(e) => {
                      updateFilter(
                        "categoryId",
                        e.target.checked ? category.id : undefined
                      );
                    }}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    ({categoryCounts[category.id] || 0})
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Price Filter */}
        {priceRange && (
          <FilterSection
            title="Price"
            defaultOpen={false}
            showClear={!!(filters.minPrice || filters.maxPrice)}
            onClear={clearPriceFilter}
          >
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    updateFilter(
                      "minPrice",
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                  min={0}
                  step="0.01"
                  className="text-sm"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    updateFilter(
                      "maxPrice",
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                  min={0}
                  step="0.01"
                  className="text-sm"
                />
              </div>
              <div className="text-xs text-gray-500">
                Range: {priceRange.min.toFixed(2)} - {priceRange.max.toFixed(2)}
              </div>
            </div>
          </FilterSection>
        )}

        {/* Deals Filter */}
        {hasDeals && (
          <FilterSection
            title="Deals"
            defaultOpen={false}
            showClear={filters.hasDeal !== undefined}
            onClear={clearDealsFilter}
          >
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  checked={filters.hasDeal === true}
                  onChange={(e) =>
                    updateFilter("hasDeal", e.target.checked ? true : undefined)
                  }
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">On Sale</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  checked={filters.priceDrop !== undefined}
                  onChange={(e) =>
                    updateFilter("priceDrop", e.target.checked ? 10 : undefined)
                  }
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Price Drop (10%+)</span>
              </label>
            </div>
          </FilterSection>
        )}

        {/* Brand Filter */}
        {brands.length > 0 && (
          <FilterSection
            title="Brand"
            defaultOpen={false}
            showClear={!!filters.brand}
            onClear={clearBrandFilter}
          >
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {brands.map((brand) => {
                const brandCount = products.filter((p) =>
                  p.name?.toLowerCase().startsWith(brand.toLowerCase())
                ).length;
                return (
                  <label
                    key={brand}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={filters.brand === brand}
                      onChange={(e) =>
                        updateFilter("brand", e.target.checked ? brand : undefined)
                      }
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{brand}</span>
                    <span className="text-xs text-gray-500 ml-auto">
                      ({brandCount})
                    </span>
                  </label>
                );
              })}
            </div>
          </FilterSection>
        )}

        {/* Stock Filter */}
        <FilterSection
          title="Stock Status"
          defaultOpen={false}
          showClear={filters.inStock !== undefined}
          onClear={clearStockFilter}
        >
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="radio"
                name="stock"
                checked={filters.inStock === undefined}
                onChange={() => updateFilter("inStock", undefined)}
                className="border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">All</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="radio"
                name="stock"
                checked={filters.inStock === true}
                onChange={() => updateFilter("inStock", true)}
                className="border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">In Stock</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="radio"
                name="stock"
                checked={filters.inStock === false}
                onChange={() => updateFilter("inStock", false)}
                className="border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Out of Stock</span>
            </label>
          </div>
        </FilterSection>

        {/* Product Type Filter */}
        <FilterSection
          title="Product Type"
          defaultOpen={false}
          showClear={filters.isRefurbished !== undefined}
          onClear={clearRefurbishedFilter}
        >
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="radio"
                name="productType"
                checked={filters.isRefurbished === undefined}
                onChange={() => updateFilter("isRefurbished", undefined)}
                className="border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">All Products</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="radio"
                name="productType"
                checked={filters.isRefurbished === false}
                onChange={() => updateFilter("isRefurbished", false)}
                className="border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">New</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="radio"
                name="productType"
                checked={filters.isRefurbished === true}
                onChange={() => updateFilter("isRefurbished", true)}
                className="border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Refurbished</span>
            </label>
          </div>
        </FilterSection>

        {/* Rating Filter (if products have ratings in future) */}
        <FilterSection
          title="Product Rating"
          defaultOpen={false}
          showClear={filters.minRating !== undefined}
          onClear={clearRatingFilter}
        >
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label
                key={rating}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={filters.minRating === rating}
                  onChange={(e) =>
                    updateFilter("minRating", e.target.checked ? rating : undefined)
                  }
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3 w-3",
                        i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      )}
                    />
                  ))}
                  <span className="text-xs text-gray-600 ml-1">& Up</span>
                </div>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
}

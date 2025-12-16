"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X, SlidersHorizontal } from "lucide-react";
import { ProductFilterOptions, SortOption } from "@/lib/product-filters";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  categories?: Category[];
  filters: ProductFilterOptions;
  onFiltersChange: (filters: ProductFilterOptions) => void;
  priceRange?: { min: number; max: number };
  showCategoryFilter?: boolean;
  showStockFilter?: boolean;
  showRefurbishedFilter?: boolean;
  preserveCategoryId?: string; // Category ID to preserve when clearing filters
}

export default function ProductFilters({
  categories = [],
  filters,
  onFiltersChange,
  priceRange,
  showCategoryFilter = true,
  showStockFilter = true,
  showRefurbishedFilter = true,
  preserveCategoryId,
}: ProductFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<ProductFilterOptions>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateFilter = (key: keyof ProductFilterOptions, value: any) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    onFiltersChange(updated);
  };

  const clearFilters = () => {
    const cleared: ProductFilterOptions = {
      searchQuery: "",
      categoryId: preserveCategoryId, // Preserve initial category if set
      minPrice: undefined,
      maxPrice: undefined,
      inStock: undefined,
      isRefurbished: undefined,
      sortBy: "newest",
    };
    setLocalFilters(cleared);
    onFiltersChange(cleared);
  };

  // Don't count initial categoryId as an active filter if category filter is hidden
  const hasActiveFilters =
    localFilters.searchQuery ||
    (showCategoryFilter && localFilters.categoryId) ||
    localFilters.minPrice ||
    localFilters.maxPrice ||
    localFilters.inStock !== undefined ||
    localFilters.isRefurbished !== undefined ||
    (localFilters.sortBy && localFilters.sortBy !== "newest");

  return (
    <div className="space-y-4 mb-6">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-10"
            value={localFilters.searchQuery || ""}
            onChange={(e) => updateFilter("searchQuery", e.target.value)}
          />
        </div>

        {/* Sort */}
        <select
          value={localFilters.sortBy || "newest"}
          onChange={(e) => updateFilter("sortBy", e.target.value as SortOption)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>

        {/* Expand/Collapse Filters */}
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 px-1.5 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
              !
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} className="gap-2">
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Filter Options</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Category Filter */}
            {showCategoryFilter && categories.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  value={localFilters.categoryId || ""}
                  onChange={(e) =>
                    updateFilter("categoryId", e.target.value || undefined)
                  }
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Price Range */}
            {priceRange && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Min Price</label>
                  <Input
                    type="number"
                    placeholder="Min"
                    value={localFilters.minPrice || ""}
                    onChange={(e) =>
                      updateFilter(
                        "minPrice",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    min={0}
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Price</label>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={localFilters.maxPrice || ""}
                    onChange={(e) =>
                      updateFilter(
                        "maxPrice",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    min={0}
                    step="0.01"
                  />
                </div>
              </>
            )}

            {/* Stock Filter */}
            {showStockFilter && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Stock Status</label>
                <select
                  value={
                    localFilters.inStock === undefined
                      ? "all"
                      : localFilters.inStock
                      ? "in-stock"
                      : "out-of-stock"
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    updateFilter(
                      "inStock",
                      value === "all"
                        ? undefined
                        : value === "in-stock"
                        ? true
                        : false
                    );
                  }}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="all">All Products</option>
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            )}

            {/* Refurbished Filter */}
            {showRefurbishedFilter && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Type</label>
                <select
                  value={
                    localFilters.isRefurbished === undefined
                      ? "all"
                      : localFilters.isRefurbished
                      ? "refurbished"
                      : "new"
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    updateFilter(
                      "isRefurbished",
                      value === "all"
                        ? undefined
                        : value === "refurbished"
                        ? true
                        : false
                    );
                  }}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="all">All Products</option>
                  <option value="new">New Products</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

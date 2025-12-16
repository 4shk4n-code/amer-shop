export type SortOption = 
  | "price-asc" 
  | "price-desc" 
  | "name-asc" 
  | "name-desc" 
  | "newest" 
  | "oldest";

export interface ProductFilterOptions {
  searchQuery?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isRefurbished?: boolean;
  sortBy?: SortOption;
  brand?: string;
  hasDeal?: boolean;
  priceDrop?: number; // Minimum percentage drop (e.g., 10 for 10%+)
  minRating?: number;
}

export interface ProductWithCategory {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  image?: string | null;
  description?: string | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  stock: number;
  unit?: string | null;
  isRefurbished: boolean;
  condition?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Filter products based on filter options
 */
export function filterProducts(
  products: ProductWithCategory[],
  filters: ProductFilterOptions
): ProductWithCategory[] {
  let filtered = [...products];

  // Search query filter
  if (filters.searchQuery?.trim()) {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (product) =>
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.name?.toLowerCase().includes(query)
    );
  }

  // Category filter
  if (filters.categoryId) {
    filtered = filtered.filter(
      (product) => product.categoryId === filters.categoryId
    );
  }

  // Price range filter
  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    filtered = filtered.filter((product) => product.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
    filtered = filtered.filter((product) => product.price <= filters.maxPrice!);
  }

  // Stock filter
  if (filters.inStock !== undefined) {
    filtered = filtered.filter((product) =>
      filters.inStock ? product.stock > 0 : product.stock === 0
    );
  }

  // Refurbished filter
  if (filters.isRefurbished !== undefined) {
    filtered = filtered.filter(
      (product) => product.isRefurbished === filters.isRefurbished
    );
  }

  // Brand filter (checks if product name starts with brand)
  if (filters.brand && filters.brand.trim()) {
    const brandLower = filters.brand.toLowerCase().trim();
    filtered = filtered.filter((product) =>
      product.name?.toLowerCase().startsWith(brandLower)
    );
  }

  // Deal filter (has originalPrice higher than price)
  if (filters.hasDeal !== undefined && filters.hasDeal) {
    filtered = filtered.filter(
      (product) =>
        product.originalPrice !== null &&
        product.originalPrice !== undefined &&
        product.originalPrice > product.price
    );
  }

  // Price drop filter (minimum percentage drop)
  if (filters.priceDrop !== undefined) {
    filtered = filtered.filter((product) => {
      if (
        product.originalPrice === null ||
        product.originalPrice === undefined ||
        product.originalPrice <= product.price
      ) {
        return false;
      }
      const dropPercent =
        ((product.originalPrice - product.price) / product.originalPrice) * 100;
      return dropPercent >= filters.priceDrop!;
    });
  }

  // Rating filter (for future use when ratings are added to products)
  // Currently skipped as products don't have ratings yet

  return filtered;
}

/**
 * Sort products based on sort option
 */
export function sortProducts(
  products: ProductWithCategory[],
  sortBy: SortOption = "newest"
): ProductWithCategory[] {
  const sorted = [...products];

  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "oldest":
      return sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    default:
      return sorted;
  }
}

/**
 * Get price range from products array
 */
export function getPriceRange(products: ProductWithCategory[]): {
  min: number;
  max: number;
} {
  if (products.length === 0) {
    return { min: 0, max: 0 };
  }

  const prices = products.map((p) => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

export interface RefurbishedProduct {
  id: string;
  name: string;
  originalPrice: number;
  refurbishedPrice: number;
  image?: string;
  description?: string;
  category?: string;
  unit?: string;
  condition: "excellent" | "good" | "fair" | "satisfactory";
  warranty?: string;
  refurbishedDate?: Date;
  originalPurchaseDate?: Date;
  refurbishedBy?: string;
  features?: string[];
  specifications?: Record<string, string>;
  stock?: number;
  sku?: string;
}

export type RefurbishedCondition = "excellent" | "good" | "fair" | "satisfactory";

export interface RefurbishedProductFilters {
  category?: string;
  condition?: RefurbishedCondition;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
}


import { RefurbishedProduct, RefurbishedProductFilters } from "./types/refurbished";

// In-memory storage for refurbished products
// In production, this would be replaced with a database
const refurbishedProducts: RefurbishedProduct[] = [
  {
    id: "ref-tv-fhd-32-001",
    name: "FHD 32\" TV - Refurbished",
    originalPrice: 270,
    refurbishedPrice: 189,
    category: "TV",
    description: "Full HD 32 inch TV - Professionally refurbished and tested. Like new condition with full functionality.",
    image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (15).jpeg",
    condition: "excellent",
    warranty: "90 days",
    refurbishedDate: new Date("2024-11-15"),
    refurbishedBy: "Certified Technician",
    features: ["HDMI ports", "USB connectivity", "Smart TV features"],
    specifications: {
      "Screen Size": "32 inches",
      "Resolution": "1920x1080",
      "Refresh Rate": "60Hz",
    },
    stock: 5,
    sku: "REF-TV-FHD-32-001",
  },
  {
    id: "ref-tv-fhd-43-001",
    name: "FHD 43\" TV - Refurbished",
    originalPrice: 408,
    refurbishedPrice: 285,
    category: "TV",
    description: "Full HD 43 inch TV - Refurbished with minor cosmetic wear. All features working perfectly.",
    image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (14).jpeg",
    condition: "good",
    warranty: "60 days",
    refurbishedDate: new Date("2024-11-20"),
    refurbishedBy: "Certified Technician",
    features: ["HDMI ports", "USB connectivity", "Smart TV features"],
    specifications: {
      "Screen Size": "43 inches",
      "Resolution": "1920x1080",
      "Refresh Rate": "60Hz",
    },
    stock: 3,
    sku: "REF-TV-FHD-43-001",
  },
  {
    id: "ref-tv-uhd-55-001",
    name: "UHD 55\" TV - Refurbished",
    originalPrice: 780,
    refurbishedPrice: 546,
    category: "TV",
    description: "Ultra HD 55 inch TV - Excellent condition, professionally refurbished. Looks and works like new.",
    image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (9).jpeg",
    condition: "excellent",
    warranty: "90 days",
    refurbishedDate: new Date("2024-12-01"),
    refurbishedBy: "Certified Technician",
    features: ["4K UHD", "HDR support", "Smart TV", "Voice control"],
    specifications: {
      "Screen Size": "55 inches",
      "Resolution": "3840x2160",
      "Refresh Rate": "120Hz",
    },
    stock: 2,
    sku: "REF-TV-UHD-55-001",
  },
  {
    id: "ref-tv-uhd-70-001",
    name: "UHD 70\" TV - Refurbished",
    originalPrice: 1425,
    refurbishedPrice: 998,
    category: "TV",
    description: "Ultra HD 70 inch TV - Good condition with minor signs of use. Fully functional and tested.",
    image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (6).jpeg",
    condition: "good",
    warranty: "60 days",
    refurbishedDate: new Date("2024-11-25"),
    refurbishedBy: "Certified Technician",
    features: ["4K UHD", "HDR support", "Smart TV", "Voice control"],
    specifications: {
      "Screen Size": "70 inches",
      "Resolution": "3840x2160",
      "Refresh Rate": "120Hz",
    },
    stock: 1,
    sku: "REF-TV-UHD-70-001",
  },
  {
    id: "ref-tv-uhd-75-001",
    name: "UHD 75\" TV - Refurbished",
    originalPrice: 1615,
    refurbishedPrice: 1131,
    category: "TV",
    description: "Ultra HD 75 inch TV - Premium refurbished model. Excellent condition with full warranty.",
    image: "/images/products/tv/WhatsApp Image 2025-12-10 at 10.10.31 AM (4).jpeg",
    condition: "excellent",
    warranty: "90 days",
    refurbishedDate: new Date("2024-12-05"),
    refurbishedBy: "Certified Technician",
    features: ["4K UHD", "HDR support", "Smart TV", "Voice control", "Dolby Vision"],
    specifications: {
      "Screen Size": "75 inches",
      "Resolution": "3840x2160",
      "Refresh Rate": "120Hz",
    },
    stock: 1,
    sku: "REF-TV-UHD-75-001",
  },
];

// Refurbished Products Management Functions
export function getAllRefurbishedProducts(): RefurbishedProduct[] {
  return refurbishedProducts;
}

export function getRefurbishedProductById(id: string): RefurbishedProduct | undefined {
  return refurbishedProducts.find((p) => p.id === id);
}

export function getRefurbishedProductsByCategory(category: string): RefurbishedProduct[] {
  return refurbishedProducts.filter((p) => p.category === category);
}

export function getRefurbishedProductsByCondition(
  condition: RefurbishedProduct["condition"]
): RefurbishedProduct[] {
  return refurbishedProducts.filter((p) => p.condition === condition);
}

export function searchRefurbishedProducts(query: string): RefurbishedProduct[] {
  const lowerQuery = query.toLowerCase();
  return refurbishedProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.sku?.toLowerCase().includes(lowerQuery) ||
      p.category?.toLowerCase().includes(lowerQuery) ||
      p.description?.toLowerCase().includes(lowerQuery)
  );
}

export function filterRefurbishedProducts(
  filters: RefurbishedProductFilters
): RefurbishedProduct[] {
  let filtered = [...refurbishedProducts];

  if (filters.category) {
    filtered = filtered.filter((p) => p.category === filters.category);
  }

  if (filters.condition) {
    filtered = filtered.filter((p) => p.condition === filters.condition);
  }

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.refurbishedPrice >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.refurbishedPrice <= filters.maxPrice!);
  }

  if (filters.searchQuery) {
    filtered = searchRefurbishedProducts(filters.searchQuery);
    // Re-apply other filters after search
    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }
    if (filters.condition) {
      filtered = filtered.filter((p) => p.condition === filters.condition);
    }
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.refurbishedPrice >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.refurbishedPrice <= filters.maxPrice!);
    }
  }

  return filtered;
}

export function calculateSavings(originalPrice: number, refurbishedPrice: number): number {
  return originalPrice - refurbishedPrice;
}

export function calculateSavingsPercentage(originalPrice: number, refurbishedPrice: number): number {
  return Math.round(((originalPrice - refurbishedPrice) / originalPrice) * 100);
}

export function addRefurbishedProduct(
  product: Omit<RefurbishedProduct, "id">
): RefurbishedProduct {
  const newProduct: RefurbishedProduct = {
    ...product,
    id: `ref-${product.sku?.toLowerCase().replace(/\s+/g, "-") || Date.now().toString()}`,
  };
  refurbishedProducts.push(newProduct);
  return newProduct;
}

export function updateRefurbishedProduct(
  id: string,
  updates: Partial<RefurbishedProduct>
): RefurbishedProduct | null {
  const index = refurbishedProducts.findIndex((p) => p.id === id);
  if (index === -1) return null;

  refurbishedProducts[index] = {
    ...refurbishedProducts[index],
    ...updates,
  };

  return refurbishedProducts[index];
}

export function deleteRefurbishedProduct(id: string): boolean {
  const index = refurbishedProducts.findIndex((p) => p.id === id);
  if (index === -1) return false;
  refurbishedProducts.splice(index, 1);
  return true;
}


"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import RefurbishedProductCard from "@/components/RefurbishedProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, RefreshCw, Shield } from "lucide-react";
import { RefurbishedProduct, RefurbishedCondition } from "@/lib/types/refurbished";
import {
  getAllRefurbishedProducts,
  filterRefurbishedProducts,
  calculateSavingsPercentage,
} from "@/lib/refurbished";

const categories = [
  "all",
  "TV",
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Sports",
  "Automotive",
  "Toys",
];

const conditions: { value: RefurbishedCondition; label: string }[] = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "satisfactory", label: "Satisfactory" },
];

export default function RefurbishedProductsPage() {
  const [products, setProducts] = useState<RefurbishedProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<RefurbishedProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCondition, setSelectedCondition] = useState<RefurbishedCondition | "all">("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const allProducts = getAllRefurbishedProducts();
    setProducts(allProducts);
  };

  const applyFilters = () => {
    const filters: any = {};

    if (selectedCategory !== "all") {
      filters.category = selectedCategory;
    }

    if (selectedCondition !== "all") {
      filters.condition = selectedCondition;
    }

    if (priceRange.min) {
      filters.minPrice = parseFloat(priceRange.min);
    }

    if (priceRange.max) {
      filters.maxPrice = parseFloat(priceRange.max);
    }

    if (searchQuery.trim()) {
      filters.searchQuery = searchQuery;
    }

    const filtered = filterRefurbishedProducts(filters);
    setFilteredProducts(filtered);
  };

  const totalSavings = filteredProducts.reduce(
    (sum, p) => sum + (p.originalPrice - p.refurbishedPrice),
    0
  );

  const averageSavings = filteredProducts.length > 0
    ? Math.round(
        filteredProducts.reduce(
          (sum, p) => sum + calculateSavingsPercentage(p.originalPrice, p.refurbishedPrice),
          0
        ) / filteredProducts.length
      )
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="h-8 w-8 text-purple-600" />
              <h1 className="text-4xl font-bold">Refurbished Products</h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Quality refurbished products at unbeatable prices. All items are professionally
              tested, cleaned, and come with warranty.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Warranty Included</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-purple-600" />
                <span>Professionally Refurbished</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{filteredProducts.length}</div>
              <div className="text-sm text-muted-foreground">Available Products</div>
            </div>
            <div className="bg-card border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{averageSavings}%</div>
              <div className="text-sm text-muted-foreground">Average Savings</div>
            </div>
            <div className="bg-card border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                }).format(totalSavings)}
              </div>
              <div className="text-sm text-muted-foreground">Total Potential Savings</div>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search refurbished products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category and Condition Filters */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Category:</span>
              </div>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === "all" ? "All" : category}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Condition:</span>
              </div>
              <Button
                variant={selectedCondition === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCondition("all")}
              >
                All Conditions
              </Button>
              {conditions.map((condition) => (
                <Button
                  key={condition.value}
                  variant={selectedCondition === condition.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCondition(condition.value)}
                >
                  {condition.label}
                </Button>
              ))}
            </div>

            {/* Price Range */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Price Range:</span>
              <Input
                type="number"
                placeholder="Min"
                className="w-24"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="number"
                placeholder="Max"
                className="w-24"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} refurbished products
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <RefurbishedProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


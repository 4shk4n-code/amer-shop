"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    image: "",
    images: "",
    categoryId: "",
    stock: "0",
    unit: "",
    isRefurbished: false,
    condition: "",
    tax: "0",
  });

  const [categories, setCategories] = useState<any[]>([]);

  // Fetch categories on mount
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
        }
      })
      .catch(() => {
        console.error("Failed to fetch categories");
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const imagesArray = formData.images
        ? formData.images.split(",").map((img) => img.trim()).filter(Boolean)
        : [];

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice
            ? parseFloat(formData.originalPrice)
            : null,
          stock: parseInt(formData.stock) || 0,
          tax: parseFloat(formData.tax) || 0,
          images: imagesArray.length > 0 ? imagesArray : null,
          condition: formData.isRefurbished ? formData.condition : null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Add New Product</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-md bg-background"
              placeholder='e.g., UHD 75" TV'
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Category *
            </label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="w-full px-4 py-2 border border-border rounded-md bg-background"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              If no categories appear, run the seed script first
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Price (AED) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full px-4 py-2 border border-border rounded-md bg-background"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Original Price (AED)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.originalPrice}
              onChange={(e) =>
                setFormData({ ...formData, originalPrice: e.target.value })
              }
              className="w-full px-4 py-2 border border-border rounded-md bg-background"
              placeholder="Leave empty if not on sale"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Set this to show a discount
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              required
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              className="w-full px-4 py-2 border border-border rounded-md bg-background"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Unit</label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
              }
              className="w-full px-4 py-2 border border-border rounded-md bg-background"
              placeholder="e.g., PER SQM, PER PIECE"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Main Image URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="w-full px-4 py-2 border border-border rounded-md bg-background"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Additional Images (comma-separated URLs)
            </label>
            <input
              type="text"
              value={formData.images}
              onChange={(e) =>
                setFormData({ ...formData, images: e.target.value })
              }
              className="w-full px-4 py-2 border border-border rounded-md bg-background"
              placeholder="url1, url2, url3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tax (AED)</label>
            <input
              type="number"
              step="0.01"
              value={formData.tax}
              onChange={(e) =>
                setFormData({ ...formData, tax: e.target.value })
              }
              className="w-full px-4 py-2 border border-border rounded-md bg-background"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full px-4 py-2 border border-border rounded-md bg-background"
            placeholder="Product description..."
          />
        </div>

        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            id="isRefurbished"
            checked={formData.isRefurbished}
            onChange={(e) =>
              setFormData({ ...formData, isRefurbished: e.target.checked })
            }
            className="w-4 h-4"
          />
          <label htmlFor="isRefurbished" className="text-sm font-medium">
            This is a refurbished product
          </label>
        </div>

        {formData.isRefurbished && (
          <div>
            <label className="block text-sm font-medium mb-2">Condition</label>
            <select
              value={formData.condition}
              onChange={(e) =>
                setFormData({ ...formData, condition: e.target.value })
              }
              className="w-full px-4 py-2 border border-border rounded-md bg-background"
            >
              <option value="">Select condition</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Product"}
          </Button>
          <Link href="/admin/products">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}


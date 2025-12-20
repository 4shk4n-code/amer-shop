"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Edit2,
  X,
  Check,
  Save,
  Package,
  User,
  Calendar,
  DollarSign,
  Truck,
  CreditCard,
  MapPin,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import Image from "next/image";
import { formatCurrency } from "@/lib/currency";

interface Order {
  id: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  shippingAddress: string | null;
  billingAddress: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  user: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
  };
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    image: string | null;
    price: number;
    slug: string;
  };
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    status: "",
    paymentStatus: "",
    paymentMethod: "",
    shippingAddress: "",
    billingAddress: "",
    notes: "",
    total: "",
    subtotal: "",
    tax: "",
    shipping: "",
  });

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
        setEditData({
          status: data.status || "",
          paymentStatus: data.paymentStatus || "",
          paymentMethod: data.paymentMethod || "",
          shippingAddress: data.shippingAddress || "",
          billingAddress: data.billingAddress || "",
          notes: data.notes || "",
          total: data.total?.toString() || "",
          subtotal: data.subtotal?.toString() || "",
          tax: data.tax?.toString() || "",
          shipping: data.shipping?.toString() || "",
        });
      } else {
        const errorData = await response.json();
        showToast(
          `Failed to fetch order: ${errorData.error || "Unknown error"}`,
          "error"
        );
        router.push("/admin/orders");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      showToast("An error occurred while fetching order details.", "error");
      router.push("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!order) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        showToast("Order updated successfully!", "success");
        setIsEditing(false);
        fetchOrder(); // Re-fetch to get updated data
      } else {
        const errorData = await response.json();
        showToast(
          `Failed to update order: ${errorData.error || "Unknown error"}`,
          "error"
        );
      }
    } catch (error) {
      console.error("Error saving order:", error);
      showToast("An error occurred while saving order.", "error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "cancelled":
        return "destructive";
      case "delivered":
        return "default";
      case "shipped":
      case "processing":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "failed":
      case "refunded":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading && !order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Order not found.</p>
        <Button onClick={() => router.push("/admin/orders")} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
        </Button>
      </div>
    );
  }

  const isActiveOrder = !["cancelled", "delivered"].includes(order.status);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push("/admin/orders")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
        </Button>
        <h1 className="text-3xl font-bold">Order Details</h1>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                <Check className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4 mr-2" /> Edit Order
            </Button>
          )}
        </div>
      </div>

      {/* Order Header - Highlight active orders */}
      {isActiveOrder && (
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            ⚠️ Active Order - This order requires attention
          </p>
        </div>
      )}

      {/* Order Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Package className="h-6 w-6 mr-2" /> Order Information
          </h2>
          <div className="space-y-4">
            <div>
              <Label>Order ID</Label>
              <p className="text-sm font-mono text-muted-foreground mt-1">
                {order.id}
              </p>
            </div>
            <div>
              <Label>Status</Label>
              {isEditing ? (
                <Select
                  value={editData.status}
                  onValueChange={(value) =>
                    setEditData({ ...editData, status: value })
                  }
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-1">
                  <Badge variant={getStatusColor(order.status) as any}>
                    {order.status}
                  </Badge>
                </div>
              )}
            </div>
            <div>
              <Label>Payment Status</Label>
              {isEditing ? (
                <Select
                  value={editData.paymentStatus}
                  onValueChange={(value) =>
                    setEditData({ ...editData, paymentStatus: value })
                  }
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-1">
                  <Badge variant={getPaymentStatusColor(order.paymentStatus) as any}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              )}
            </div>
            <div>
              <Label>Payment Method</Label>
              {isEditing ? (
                <Input
                  value={editData.paymentMethod}
                  onChange={(e) =>
                    setEditData({ ...editData, paymentMethod: e.target.value })
                  }
                  className="mt-1"
                  placeholder="e.g., card, cash, paypal"
                />
              ) : (
                <p className="text-sm text-muted-foreground mt-1">
                  {order.paymentMethod || "N/A"}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label className="text-xs">Created</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <User className="h-6 w-6 mr-2" /> Customer Information
          </h2>
          <div className="space-y-3">
            <div>
              <Label>Name</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {order.user.name || "N/A"}
              </p>
            </div>
            <div>
              <Label>Email</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {order.user.email}
              </p>
            </div>
            {order.user.phone && (
              <div>
                <Label>Phone</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {order.user.phone}
                </p>
              </div>
            )}
            <Link href={`/admin/users/${order.user.id}`}>
              <Button variant="outline" size="sm">
                View Customer Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b border-border pb-4 last:border-b-0"
            >
              {item.product.image && (
                <div className="relative h-20 w-20 flex-shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-md"
                  />
                </div>
              )}
              <div className="flex-1">
                <Link
                  href={`/product/${item.product.slug}`}
                  className="font-medium hover:underline"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-muted-foreground">
                  Quantity: {item.quantity} × {formatCurrency(item.price)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <DollarSign className="h-6 w-6 mr-2" /> Financial Summary
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Subtotal</Label>
            {isEditing ? (
              <Input
                type="number"
                step="0.01"
                value={editData.subtotal}
                onChange={(e) =>
                  setEditData({ ...editData, subtotal: e.target.value })
                }
                className="w-32"
              />
            ) : (
              <span className="font-semibold">{formatCurrency(order.subtotal)}</span>
            )}
          </div>
          <div className="flex justify-between">
            <Label>Tax</Label>
            {isEditing ? (
              <Input
                type="number"
                step="0.01"
                value={editData.tax}
                onChange={(e) =>
                  setEditData({ ...editData, tax: e.target.value })
                }
                className="w-32"
              />
            ) : (
              <span className="font-semibold">{formatCurrency(order.tax)}</span>
            )}
          </div>
          <div className="flex justify-between">
            <Label>Shipping</Label>
            {isEditing ? (
              <Input
                type="number"
                step="0.01"
                value={editData.shipping}
                onChange={(e) =>
                  setEditData({ ...editData, shipping: e.target.value })
                }
                className="w-32"
              />
            ) : (
              <span className="font-semibold">{formatCurrency(order.shipping)}</span>
            )}
          </div>
          <div className="flex justify-between border-t border-border pt-3">
            <Label className="text-lg">Total</Label>
            {isEditing ? (
              <Input
                type="number"
                step="0.01"
                value={editData.total}
                onChange={(e) =>
                  setEditData({ ...editData, total: e.target.value })
                }
                className="w-32 font-semibold"
              />
            ) : (
              <span className="text-lg font-bold">{formatCurrency(order.total)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Addresses */}
      {(order.shippingAddress || order.billingAddress) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {order.shippingAddress && (
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Truck className="h-5 w-5 mr-2" /> Shipping Address
              </h2>
              {isEditing ? (
                <textarea
                  value={editData.shippingAddress}
                  onChange={(e) =>
                    setEditData({ ...editData, shippingAddress: e.target.value })
                  }
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Shipping address"
                />
              ) : (
                <p className="text-sm whitespace-pre-wrap">
                  {order.shippingAddress}
                </p>
              )}
            </div>
          )}
          {order.billingAddress && (
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" /> Billing Address
              </h2>
              {isEditing ? (
                <textarea
                  value={editData.billingAddress}
                  onChange={(e) =>
                    setEditData({ ...editData, billingAddress: e.target.value })
                  }
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Billing address"
                />
              ) : (
                <p className="text-sm whitespace-pre-wrap">
                  {order.billingAddress}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Notes</h2>
        {isEditing ? (
          <textarea
            value={editData.notes}
            onChange={(e) =>
              setEditData({ ...editData, notes: e.target.value })
            }
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Order notes..."
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            {order.notes || "No notes"}
          </p>
        )}
      </div>
    </div>
  );
}


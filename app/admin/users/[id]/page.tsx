"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  Mail, 
  Phone, 
  Calendar,
  ShoppingBag,
  Heart,
  MapPin,
  Package
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface User {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  orders: Order[];
  addresses: Address[];
  cartItems: CartItem[];
  wishlistItems: WishlistItem[];
  _count: {
    orders: number;
    cartItems: number;
    wishlistItems: number;
    addresses: number;
  };
}

interface Order {
  id: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  createdAt: string;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface Address {
  id: string;
  type: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string | null;
  zipCode: string | null;
  country: string;
  isDefault: boolean;
}

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string | null;
  };
}

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    image: string | null;
  };
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });
  const [cancelingOrder, setCancelingOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setEditData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          role: data.role || "customer",
        });
      } else {
        showToast("Failed to load user", "error");
        router.push("/admin/users");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      showToast("Failed to load user", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        showToast("User updated successfully", "success");
        setEditing(false);
        fetchUser();
      } else {
        const error = await response.json();
        showToast(error.error || "Failed to update user", "error");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      showToast("Failed to update user", "error");
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      setCancelingOrder(orderId);
      const response = await fetch(`/api/admin/orders/${orderId}/cancel`, {
        method: "POST",
      });

      if (response.ok) {
        showToast("Order cancelled successfully", "success");
        fetchUser();
      } else {
        const error = await response.json();
        showToast(error.error || "Failed to cancel order", "error");
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      showToast("Failed to cancel order", "error");
    } finally {
      setCancelingOrder(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete this user account? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showToast("User account deleted successfully", "success");
        router.push("/admin/users");
      } else {
        const error = await response.json();
        showToast(error.error || "Failed to delete account", "error");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      showToast("Failed to delete account", "error");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading user...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">User not found</p>
        <Link href="/admin/users">
          <Button className="mt-4">Back to Users</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/users">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{user.name || "User"}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button variant="outline" onClick={() => setEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Check className="h-4 w-4 mr-2" />
                Save
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit User
              </Button>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </>
          )}
        </div>
      </div>

      {/* User Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Name</label>
                <Input
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Phone</label>
                <Input
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Role</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editData.role}
                  onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                  {user.role}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Statistics</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Total Orders</span>
              </div>
              <span className="font-semibold">{user._count.orders}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Cart Items</span>
              </div>
              <span className="font-semibold">{user._count.cartItems}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Wishlist Items</span>
              </div>
              <span className="font-semibold">{user._count.wishlistItems}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Addresses</span>
              </div>
              <span className="font-semibold">{user._count.addresses}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order History</h2>
        {user.orders.length === 0 ? (
          <p className="text-muted-foreground">No orders found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 text-sm font-medium">Order ID</th>
                  <th className="text-left p-3 text-sm font-medium">Date</th>
                  <th className="text-left p-3 text-sm font-medium">Items</th>
                  <th className="text-left p-3 text-sm font-medium">Total</th>
                  <th className="text-left p-3 text-sm font-medium">Status</th>
                  <th className="text-left p-3 text-sm font-medium">Payment</th>
                  <th className="text-left p-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {user.orders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="p-3 text-sm font-mono">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="p-3 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-sm">{order.items.length} items</td>
                    <td className="p-3 text-sm font-semibold">
                      {order.total.toFixed(2)} AED
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={
                          order.status === "cancelled"
                            ? "destructive"
                            : order.status === "delivered"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{order.paymentStatus}</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Link href={`/admin/orders/${order.id}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                        {order.status !== "cancelled" &&
                          order.status !== "delivered" && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancelOrder(order.id)}
                              disabled={cancelingOrder === order.id}
                            >
                              {cancelingOrder === order.id ? "Canceling..." : "Cancel"}
                            </Button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Addresses */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Addresses</h2>
        {user.addresses.length === 0 ? (
          <p className="text-muted-foreground">No addresses found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.addresses.map((address) => (
              <div
                key={address.id}
                className="border border-border rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{address.type}</Badge>
                  {address.isDefault && (
                    <Badge variant="default">Default</Badge>
                  )}
                </div>
                <p className="font-medium">
                  {address.firstName} {address.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{address.email}</p>
                <p className="text-sm text-muted-foreground">{address.phone}</p>
                <p className="text-sm mt-2">{address.address}</p>
                <p className="text-sm text-muted-foreground">
                  {address.city}, {address.state || ""} {address.zipCode || ""}
                </p>
                <p className="text-sm text-muted-foreground">{address.country}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Items */}
      {user.cartItems.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
          <div className="space-y-2">
            {user.cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div className="flex items-center gap-3">
                  {item.product.image && (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} × {item.product.price.toFixed(2)} AED
                    </p>
                  </div>
                </div>
                <p className="font-semibold">
                  {(item.quantity * item.product.price).toFixed(2)} AED
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wishlist Items */}
      {user.wishlistItems.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Wishlist Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {user.wishlistItems.map((item) => (
              <div
                key={item.id}
                className="border border-border rounded-lg p-4"
              >
                {item.product.image && (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                )}
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm font-semibold text-primary mt-1">
                  {item.product.price.toFixed(2)} AED
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


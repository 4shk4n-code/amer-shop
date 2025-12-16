"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Heart,
  Settings,
  ShoppingBag,
  Edit,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/currency";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import AddressModal from "@/components/AddressModal";

type TabType = "overview" | "orders" | "addresses" | "wishlist" | "settings";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  useEffect(() => {
    if (!session?.user) {
      router.push("/signin");
      return;
    }

    // Load user data
    if (session.user) {
      setUserData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: "",
      });
    }

    // Load orders, addresses, and wishlist
    loadProfileData();
  }, [session, router]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Load orders
      const ordersRes = await fetch("/api/orders");
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }

      // Load addresses
      const addressesRes = await fetch("/api/profile/addresses");
      if (addressesRes.ok) {
        const addressesData = await addressesRes.json();
        setAddresses(addressesData);
      }

      // Load wishlist
      const wishlistRes = await fetch("/api/wishlist");
      if (wishlistRes.ok) {
        const wishlistData = await wishlistRes.json();
        setWishlist(wishlistData);
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        await update(); // Refresh session
        alert("Profile updated successfully!");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-600";
      case "shipped":
        return "text-blue-600";
      case "processing":
        return "text-yellow-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "processing":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Account</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-16 h-16 rounded-full"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-8 w-8 text-primary" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{session.user.name || "User"}</h3>
                      <p className="text-sm text-muted-foreground">{session.user.email}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    <button
                      onClick={() => setActiveTab("overview")}
                      className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-left transition-colors ${
                        activeTab === "overview"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <User className="h-4 w-4" />
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-left transition-colors ${
                        activeTab === "orders"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Orders ({orders.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("addresses")}
                      className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-left transition-colors ${
                        activeTab === "addresses"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <MapPin className="h-4 w-4" />
                      Addresses ({addresses.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("wishlist")}
                      className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-left transition-colors ${
                        activeTab === "wishlist"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <Heart className="h-4 w-4" />
                      Wishlist ({wishlist.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("settings")}
                      className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-left transition-colors ${
                        activeTab === "settings"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Overview</CardTitle>
                      <CardDescription>Your account information and statistics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <ShoppingBag className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">Total Orders</h3>
                          </div>
                          <p className="text-2xl font-bold">{orders.length}</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Heart className="h-5 w-5 text-red-500" />
                            <h3 className="font-semibold">Wishlist Items</h3>
                          </div>
                          <p className="text-2xl font-bold">{wishlist.length}</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-5 w-5 text-blue-500" />
                            <h3 className="font-semibold">Saved Addresses</h3>
                          </div>
                          <p className="text-2xl font-bold">{addresses.length}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Name</label>
                          <p className="text-muted-foreground">{session.user.name || "Not set"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <p className="text-muted-foreground">{session.user.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Member Since</label>
                          <p className="text-muted-foreground">
                            {session.user.email ? "Recently joined" : "N/A"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Orders */}
                  {orders.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {orders.slice(0, 3).map((order: any) => (
                            <div
                              key={order.id}
                              className="flex items-center justify-between p-4 border rounded-lg"
                            >
                              <div>
                                <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">{formatPrice(order.total)}</p>
                                <p className={`text-sm ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </p>
                              </div>
                            </div>
                          ))}
                          {orders.length > 3 && (
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => setActiveTab("orders")}
                            >
                              View All Orders
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {activeTab === "orders" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View and track your orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Loading orders...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No orders yet</p>
                        <Button asChild className="mt-4">
                          <Link href="/products">Start Shopping</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order: any) => (
                          <div key={order.id} className="border rounded-lg p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-lg">
                                  Order #{order.id.slice(0, 8)}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold">{formatPrice(order.total)}</p>
                                <div
                                  className={`flex items-center gap-1 text-sm ${getStatusColor(
                                    order.status
                                  )}`}
                                >
                                  {getStatusIcon(order.status)}
                                  <span className="capitalize">{order.status}</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2 mb-4">
                              {order.items?.map((item: any) => (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-4 p-3 bg-muted/50 rounded"
                                >
                                  <div className="relative w-16 h-16 rounded overflow-hidden">
                                    <PlaceholderImage
                                      src={item.product?.image || undefined}
                                      alt={item.product?.name || "Product"}
                                      fill
                                      className="object-cover"
                                      placeholderText={item.product?.name}
                                      placeholderWidth={64}
                                      placeholderHeight={64}
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium">{item.product?.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Qty: {item.quantity} × {formatPrice(item.price)}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold">
                                      {formatPrice(item.price * item.quantity)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t">
                              <div className="text-sm text-muted-foreground">
                                <p>
                                  Payment:{" "}
                                  <span className="capitalize">{order.paymentStatus}</span>
                                </p>
                                {order.paymentMethod && (
                                  <p>Method: {order.paymentMethod}</p>
                                )}
                              </div>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/profile/orders/${order.id}`}>View Details</Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "addresses" && (
                <Card>
                  <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Saved Addresses</CardTitle>
                          <CardDescription>Manage your shipping and billing addresses</CardDescription>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            setEditingAddress(null);
                            setAddressModalOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Address
                        </Button>
                      </div>
                  </CardHeader>
                  <CardContent>
                    {addresses.length === 0 ? (
                      <div className="text-center py-8">
                        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">No saved addresses</p>
                        <Button
                          onClick={() => {
                            setEditingAddress(null);
                            setAddressModalOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Address
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((address: any) => (
                          <div key={address.id} className="border rounded-lg p-4 relative">
                            {address.isDefault && (
                              <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                Default
                              </span>
                            )}
                            <div className="mb-2">
                              <span className="text-xs uppercase bg-muted px-2 py-1 rounded">
                                {address.type}
                              </span>
                            </div>
                            <h4 className="font-semibold mb-2">
                              {address.firstName} {address.lastName}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-1">{address.address}</p>
                            <p className="text-sm text-muted-foreground mb-1">
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p className="text-sm text-muted-foreground mb-1">{address.country}</p>
                            <p className="text-sm text-muted-foreground mb-3">{address.phone}</p>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingAddress(address);
                                  setAddressModalOpen(true);
                                }}
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                  if (
                                    confirm(
                                      "Are you sure you want to delete this address?"
                                    )
                                  ) {
                                    try {
                                      const response = await fetch(
                                        `/api/profile/addresses/${address.id}`,
                                        {
                                          method: "DELETE",
                                        }
                                      );
                                      if (response.ok) {
                                        loadProfileData();
                                      }
                                    } catch (error) {
                                      console.error("Error deleting address:", error);
                                    }
                                  }
                                }}
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "wishlist" && (
                <Card>
                  <CardHeader>
                    <CardTitle>My Wishlist</CardTitle>
                    <CardDescription>Products you&apos;ve saved for later</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Loading wishlist...</p>
                      </div>
                    ) : wishlist.length === 0 ? (
                      <div className="text-center py-8">
                        <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
                        <Button asChild>
                          <Link href="/products">Browse Products</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {wishlist.map((item: any) => (
                          <div key={item.id} className="border rounded-lg overflow-hidden group">
                            <Link href={`/product/${item.product.slug}`}>
                              <div className="relative aspect-square bg-muted">
                                <PlaceholderImage
                                  src={item.product.image || undefined}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform"
                                  placeholderText={item.product.name}
                                  placeholderWidth={400}
                                  placeholderHeight={400}
                                />
                              </div>
                            </Link>
                            <div className="p-4">
                              <Link href={`/product/${item.product.slug}`}>
                                <h3 className="font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
                                  {item.product.name}
                                </h3>
                              </Link>
                              <p className="text-lg font-bold text-primary mb-3">
                                {formatPrice(item.product.price)}
                              </p>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                  onClick={async () => {
                                    // Remove from wishlist
                                    await fetch(`/api/wishlist/${item.productId}`, {
                                      method: "DELETE",
                                    });
                                    loadProfileData();
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                                <Button size="sm" className="flex-1" asChild>
                                  <Link href={`/product/${item.product.slug}`}>View</Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "settings" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Full Name
                        </label>
                        <Input
                          value={userData.name}
                          onChange={(e) =>
                            setUserData({ ...userData, name: e.target.value })
                          }
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Email
                        </label>
                        <Input
                          type="email"
                          value={userData.email}
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Email cannot be changed
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Phone Number
                        </label>
                        <Input
                          type="tel"
                          value={userData.phone}
                          onChange={(e) =>
                            setUserData({ ...userData, phone: e.target.value })
                          }
                          placeholder="+971 50 123 4567"
                        />
                      </div>
                      <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <AddressModal
        open={addressModalOpen}
        onOpenChange={setAddressModalOpen}
        onSuccess={loadProfileData}
        address={editingAddress}
      />
    </div>
  );
}


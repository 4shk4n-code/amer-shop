import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  if (!prisma) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Database connection unavailable. Please check your configuration.
          </p>
        </div>
      </div>
    );
  }

  let productsCount = 0;
  let ordersCount = 0;
  let usersCount = 0;
  let categoriesCount = 0;
  let recentOrders = [];

  try {
    [productsCount, ordersCount, usersCount, categoriesCount] =
      await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.user.count(),
        prisma.category.count(),
      ]);

    recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Continue with default values
  }

  const stats = [
    { label: "Total Products", value: productsCount, href: "/admin/products" },
    { label: "Total Orders", value: ordersCount, href: "/admin/orders" },
    { label: "Total Users", value: usersCount, href: "/admin/users" },
    { label: "Categories", value: categoriesCount, href: "/admin/categories" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat: any) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-sm text-muted-foreground mb-2">
              {stat.label}
            </h3>
            <p className="text-3xl font-bold">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Order ID</th>
                <th className="text-left p-2">Customer</th>
                <th className="text-left p-2">Total</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order: any) => (
                <tr key={order.id} className="border-b">
                  <td className="p-2">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-primary hover:underline"
                    >
                      {order.id.slice(0, 8)}...
                    </Link>
                  </td>
                  <td className="p-2">
                    {order.user.name || order.user.email}
                  </td>
                  <td className="p-2">{order.total.toFixed(2)} AED</td>
                  <td className="p-2">
                    <span className="px-2 py-1 bg-muted rounded text-sm">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4">Order ID</th>
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Items</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order.id} className="border-b">
                <td className="p-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-primary hover:underline"
                  >
                    {order.id.slice(0, 8)}...
                  </Link>
                </td>
                <td className="p-4">
                  {order.user.name || order.user.email}
                </td>
                <td className="p-4">{order.items.length} items</td>
                <td className="p-4">{order.total.toFixed(2)} AED</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-muted rounded text-sm">
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-primary hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


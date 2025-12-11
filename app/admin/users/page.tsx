import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { orders: true },
      },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <div className="text-sm text-muted-foreground">
          Total: {users.length} users
        </div>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Orders</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: typeof users[0]) => (
              <tr
                key={user.id}
                className="border-t border-border hover:bg-muted/50 transition-colors"
              >
                <td className="px-4 py-3 text-sm">
                  {user.name || "N/A"}
                </td>
                <td className="px-4 py-3 text-sm">{user.email}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                  >
                    {user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm">
                  {user._count.orders}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No users found.</p>
        </div>
      )}
    </div>
  );
}


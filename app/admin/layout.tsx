import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import Header from "@/components/Header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin?callbackUrl=/admin");
  }

  if ((session.user as any).role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              <Link
                href="/admin"
                className="block px-4 py-2 rounded-md hover:bg-accent transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className="block px-4 py-2 rounded-md hover:bg-accent transition-colors"
              >
                Products
              </Link>
              <Link
                href="/admin/orders"
                className="block px-4 py-2 rounded-md hover:bg-accent transition-colors"
              >
                Orders
              </Link>
              <Link
                href="/admin/categories"
                className="block px-4 py-2 rounded-md hover:bg-accent transition-colors"
              >
                Categories
              </Link>
              <Link
                href="/admin/users"
                className="block px-4 py-2 rounded-md hover:bg-accent transition-colors"
              >
                Users
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}


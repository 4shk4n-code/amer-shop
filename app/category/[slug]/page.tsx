import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import Header from "@/components/Header";

// Loading skeleton component
function CategorySkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-10 w-64 bg-muted animate-pulse rounded mb-4" />
        <div className="h-6 w-96 bg-muted animate-pulse rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="aspect-square bg-muted animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
              <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
              <div className="h-6 w-1/4 bg-muted animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Lazy load category components
const Electronics = dynamic(() => import("@/components/categories/Electronics").then(mod => ({ default: mod.default })), {
  loading: () => <CategorySkeleton />,
  ssr: false,
});

const Fashion = dynamic(() => import("@/components/categories/Fashion").then(mod => ({ default: mod.default })), {
  loading: () => <CategorySkeleton />,
  ssr: false,
});

const HomeGarden = dynamic(() => import("@/components/categories/HomeGarden").then(mod => ({ default: mod.default })), {
  loading: () => <CategorySkeleton />,
  ssr: false,
});

const Sports = dynamic(() => import("@/components/categories/Sports").then(mod => ({ default: mod.default })), {
  loading: () => <CategorySkeleton />,
  ssr: false,
});

const Automotive = dynamic(() => import("@/components/categories/Automotive").then(mod => ({ default: mod.default })), {
  loading: () => <CategorySkeleton />,
  ssr: false,
});

const Toys = dynamic(() => import("@/components/categories/Toys").then(mod => ({ default: mod.default })), {
  loading: () => <CategorySkeleton />,
  ssr: false,
});

const categoryMap: Record<string, React.ComponentType> = {
  electronics: Electronics,
  fashion: Fashion,
  "home-garden": HomeGarden,
  sports: Sports,
  automotive: Automotive,
  toys: Toys,
};

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const CategoryComponent = categoryMap[params.slug];

  if (!CategoryComponent) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Header />
      <CategoryComponent />
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Amer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

// Generate static params for known categories
export function generateStaticParams() {
  return [
    { slug: "electronics" },
    { slug: "fashion" },
    { slug: "home-garden" },
    { slug: "sports" },
    { slug: "automotive" },
    { slug: "toys" },
  ];
}

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

// Lazy load Artificial Grass component
const ArtificialGrass = dynamic(() => import("@/components/categories/ArtificialGrass").then(mod => ({ default: mod.default })), {
  loading: () => <CategorySkeleton />,
  ssr: false,
});

const subcategoryMap: Record<string, React.ComponentType> = {
  "artificial-grass": ArtificialGrass,
};

interface SubcategoryPageProps {
  params: {
    subcategory: string;
  };
}

export default function SubcategoryPage({ params }: SubcategoryPageProps) {
  const SubcategoryComponent = subcategoryMap[params.subcategory];

  if (!SubcategoryComponent) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Header />
      <SubcategoryComponent />
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

// Generate static params for known subcategories
export function generateStaticParams() {
  return [
    { subcategory: "artificial-grass" },
  ];
}


import dynamic from "next/dynamic";
import Header from "@/components/Header";
import CategoryGrid from "@/components/CategoryGrid";
import SpecialOffers from "@/components/SpecialOffers";
import FeaturedProducts from "@/components/FeaturedProducts";
import FlashSale from "@/components/FlashSale";
import NewArrivals from "@/components/NewArrivals";
import PromoBanner from "@/components/PromoBanner";

// Dynamically import BannerSlider to avoid webpack issues
const BannerSlider = dynamic(() => import("@/components/BannerSlider"), {
  ssr: true,
});

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <BannerSlider />
      </div>
      <PromoBanner />
      <SpecialOffers />
      <FlashSale />
      <FeaturedProducts />
      <NewArrivals />
      <CategoryGrid />
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


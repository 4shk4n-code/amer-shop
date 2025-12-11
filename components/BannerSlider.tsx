"use client";

import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

const banners = [
  {
    id: 1,
    title: "Summer Sale",
    subtitle: "Up to 50% Off",
    description: "Discover amazing deals on all categories",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=600&fit=crop",
    cta: "Shop Now",
    href: "/sale",
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Latest Collection",
    description: "Check out our newest products",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&h=600&fit=crop",
    cta: "Explore",
    href: "/new-arrivals",
  },
  {
    id: 3,
    title: "Free Shipping",
    subtitle: "On Orders Over 50 AED",
    description: "Shop now and get free shipping",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=600&fit=crop",
    cta: "Learn More",
    href: "/shipping",
  },
];

export default function BannerSlider() {
  return (
    <div className="w-full relative">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full relative"
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
                <PlaceholderImage
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  priority={banner.id === 1}
                  sizes="100vw"
                  placeholderWidth={1600}
                  placeholderHeight={600}
                  placeholderText={banner.title}
                />
                <div className="absolute inset-0 z-20 flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-2xl">
                      <p className="text-lg md:text-xl text-white/90 mb-2 font-medium">
                        {banner.subtitle}
                      </p>
                      <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        {banner.title}
                      </h2>
                      <p className="text-lg md:text-xl text-white/80 mb-6">
                        {banner.description}
                      </p>
                      <Link
                        href={banner.href}
                        className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors"
                      >
                        {banner.cta}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-white/90 hover:bg-white border-0 shadow-lg z-30" />
        <CarouselNext className="right-4 bg-white/90 hover:bg-white border-0 shadow-lg z-30" />
      </Carousel>
    </div>
  );
}


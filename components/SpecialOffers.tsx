"use client";

import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { formatPrice } from "@/lib/currency";
import { Badge } from "@/components/ui/badge";
import { Percent } from "lucide-react";

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  image: string;
  href: string;
  badge?: string;
}

const offers: Offer[] = [
  {
    id: "offer-1",
    title: "Flash Sale",
    description: "Limited time offers - Up to 40% off",
    discount: "40% OFF",
    image: "",
    href: "/category/electronics",
    badge: "HOT",
  },
  {
    id: "offer-2",
    title: "Weekend Special",
    description: "Best deals on automotive parts",
    discount: "25% OFF",
    image: "",
    href: "/category/automotive",
    badge: "NEW",
  },
  {
    id: "offer-3",
    title: "Clearance Sale",
    description: "Huge discounts on selected items",
    discount: "50% OFF",
    image: "",
    href: "/category/fashion",
    badge: "SALE",
  },
];

export default function SpecialOffers() {
  return (
    <section className="py-12 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Special Offers</h2>
          <p className="text-muted-foreground text-lg">Don&apos;t miss out on these amazing deals</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <Link
              key={offer.id}
              href={offer.href}
              className="group relative overflow-hidden rounded-lg bg-card border-2 border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative h-64 overflow-hidden">
                <PlaceholderImage
                  src={offer.image}
                  alt={offer.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  placeholderText={offer.title}
                  placeholderWidth={400}
                  placeholderHeight={300}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                {offer.badge && (
                  <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground">
                    {offer.badge}
                  </Badge>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="h-5 w-5" />
                    <span className="text-3xl font-bold">{offer.discount}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
                  <p className="text-white/90">{offer.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


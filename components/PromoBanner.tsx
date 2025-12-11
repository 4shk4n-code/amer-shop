"use client";

import Link from "next/link";
import { Truck, Shield, HeadphonesIcon, Gift } from "lucide-react";

const promos = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over 50 AED",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure transactions",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Dedicated customer service",
  },
  {
    icon: Gift,
    title: "Special Offers",
    description: "Exclusive deals for you",
  },
];

export default function PromoBanner() {
  return (
    <section className="py-12 bg-card border-y">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {promos.map((promo, index) => {
            const Icon = promo.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="p-3 rounded-full bg-primary/10 mb-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{promo.title}</h3>
                <p className="text-sm text-muted-foreground">{promo.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


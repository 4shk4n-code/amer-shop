"use client";

import { useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/toast";

export function CartToastConnector() {
  const { setToastCallback } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    // Connect toast to cart
    setToastCallback((message: string) => {
      showToast(message, "success", 3000);
    });
  }, [setToastCallback, showToast]);

  return null;
}


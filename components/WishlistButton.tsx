"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: "sm" | "default" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost";
}

export default function WishlistButton({
  productId,
  className,
  size = "icon",
  variant = "ghost",
}: WishlistButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const checkWishlistStatus = useCallback(async () => {
    if (!session?.user) {
      setChecking(false);
      return;
    }

    try {
      const response = await fetch(`/api/wishlist/check/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setIsInWishlist(data.inWishlist || false);
      } else {
        console.error("Failed to check wishlist status:", response.status, response.statusText);
        setIsInWishlist(false);
      }
    } catch (error) {
      console.error("Error checking wishlist:", error);
      setIsInWishlist(false);
    } finally {
      setChecking(false);
    }
  }, [session?.user, productId]);

  useEffect(() => {
    checkWishlistStatus();
  }, [checkWishlistStatus]);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      router.push("/signin");
      return;
    }

    setLoading(true);

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(`/api/wishlist/${productId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsInWishlist(false);
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error("Failed to remove from wishlist:", response.status, errorData);
          alert("Failed to remove from wishlist. Please try again.");
        }
      } else {
        // Add to wishlist
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        });

        if (response.ok) {
          setIsInWishlist(true);
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error("Failed to add to wishlist:", response.status, errorData);
          alert(`Failed to add to wishlist: ${errorData.error || "Unknown error"}`);
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleToggleWishlist}
      disabled={loading}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`h-4 w-4 ${
          isInWishlist
            ? "fill-red-500 text-red-500"
            : "text-muted-foreground"
        } ${loading ? "animate-pulse" : ""}`}
      />
    </Button>
  );
}


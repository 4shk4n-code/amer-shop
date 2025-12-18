"use client";

import { useState, useEffect } from "react";
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

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch(`/api/wishlist/check/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setIsInWishlist(data.inWishlist);
      }
    } catch (error) {
      console.error("Error checking wishlist:", error);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      checkWishlistStatus();
    } else {
      setChecking(false);
    }
  }, [session?.user, productId]);

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch(`/api/wishlist/check/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setIsInWishlist(data.inWishlist);
      }
    } catch (error) {
      console.error("Error checking wishlist:", error);
    } finally {
      setChecking(false);
    }
  };

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
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
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


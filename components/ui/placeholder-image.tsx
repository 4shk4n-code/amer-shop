"use client";

import Image from "next/image";
import { getPlaceholderImage } from "@/lib/placeholder";

interface PlaceholderImageProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  placeholderWidth?: number;
  placeholderHeight?: number;
  placeholderText?: string;
}

export function PlaceholderImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  sizes,
  placeholderWidth,
  placeholderHeight,
  placeholderText,
}: PlaceholderImageProps) {
  const placeholder = getPlaceholderImage(
    placeholderWidth || width || 400,
    placeholderHeight || height || 300,
    placeholderText || alt
  );

  // Use placeholder if no src provided or if src is empty string
  const finalSrc = (src && src.trim() !== "") ? src : placeholder;
  
  // Ensure finalSrc is a valid URL - if not, use placeholder
  const isValidUrl = finalSrc.startsWith("http://") || finalSrc.startsWith("https://") || finalSrc.startsWith("/");
  const imageSrc = isValidUrl ? finalSrc : placeholder;

  // Disable optimization for Unsplash images (they're already optimized)
  // Check the original src, not imageSrc (which might be placeholder)
  const isUnsplash = src && src.includes("images.unsplash.com");
  const shouldOptimize = src && isValidUrl && !isUnsplash;

  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        unoptimized={!shouldOptimize}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width || 400}
      height={height || 300}
      className={className}
      priority={priority}
      unoptimized={!shouldOptimize}
    />
  );
}


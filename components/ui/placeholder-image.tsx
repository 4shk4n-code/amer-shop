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
  const isValidUrl = finalSrc && (finalSrc.startsWith("http://") || finalSrc.startsWith("https://") || finalSrc.startsWith("/"));
  const imageSrc = isValidUrl ? finalSrc : placeholder;

  // Check if this is an external URL (not a local path or data URI)
  const isExternalUrl = src ? (src.startsWith("http://") || src.startsWith("https://")) : false;
  const isDataUri = imageSrc ? imageSrc.startsWith("data:") : false;
  
  // For external URLs, use regular img tag to avoid Next.js optimization issues
  // For local paths and data URIs, use Next.js Image component
  if (isExternalUrl && !isDataUri) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={alt}
          className={className}
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            objectFit: "cover",
          }}
          loading={priority ? "eager" : "lazy"}
        />
      );
    }
    
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageSrc}
        alt={alt}
        width={width || 400}
        height={height || 300}
        className={className}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  // Use Next.js Image component for local paths and data URIs
  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        unoptimized={isDataUri}
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
      unoptimized={isDataUri}
    />
  );
}


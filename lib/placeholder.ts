/**
 * Generate placeholder image URLs
 * Uses SVG data URIs for reliable placeholder images (no external requests)
 */

export function getPlaceholderImage(
  width: number,
  height: number,
  text?: string,
  bgColor?: string,
  textColor?: string
): string {
  // Use SVG data URI instead of external service for reliability
  const bg = bgColor || "cccccc";
  const color = textColor || "969696";
  const label = text || "Image";
  
  // Create SVG placeholder as data URI (browser-compatible)
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#${bg}"/><text x="50%" y="50%" font-family="Arial,sans-serif" font-size="${Math.min(width / 10, 20)}" fill="#${color}" text-anchor="middle" dominant-baseline="middle">${encodeURIComponent(label)}</text></svg>`;
  
  // Use encodeURIComponent for proper URL encoding (works in browser)
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Get category-specific placeholder images
 */
export function getCategoryPlaceholder(categoryName: string, width = 400, height = 300): string {
  return getPlaceholderImage(width, height, categoryName, "e0e0e0", "666666");
}

/**
 * Get banner placeholder images
 */
export function getBannerPlaceholder(width = 1600, height = 600, text = "Banner"): string {
  return getPlaceholderImage(width, height, text, "4a5568", "ffffff");
}

/**
 * Get product placeholder images
 */
export function getProductPlaceholder(width = 400, height = 400): string {
  return getPlaceholderImage(width, height, "Product Image", "f0f0f0", "999999");
}


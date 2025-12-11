/**
 * Generate placeholder image URLs
 * Uses placeholder.com service for dummy images
 */

export function getPlaceholderImage(
  width: number,
  height: number,
  text?: string,
  bgColor?: string,
  textColor?: string
): string {
  const baseUrl = "https://via.placeholder.com";
  const dimensions = `${width}x${height}`;
  const bg = bgColor || "cccccc";
  const color = textColor || "969696";
  const label = text ? encodeURIComponent(text) : "";

  if (label) {
    return `${baseUrl}/${dimensions}/${bg}/${color}?text=${label}`;
  }
  return `${baseUrl}/${dimensions}/${bg}/${color}`;
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


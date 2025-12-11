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
  const label = text ? encodeURIComponent(text) : "Image";
  
  // Create SVG placeholder as data URI
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#${bg}"/>
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial, sans-serif" 
        font-size="16" 
        fill="#${color}" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >${label}</text>
    </svg>
  `.trim().replace(/\s+/g, ' ');
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
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


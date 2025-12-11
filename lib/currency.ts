/**
 * Format price in AED currency
 */
export function formatPrice(price: number): string {
  return `${price.toFixed(2)} AED`;
}

/**
 * Format price with currency symbol only (no AED text)
 */
export function formatPriceSymbol(price: number): string {
  return `${price.toFixed(2)} د.إ`;
}


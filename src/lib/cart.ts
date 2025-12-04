// Shopping Cart Utilities

export interface CartItem {
  id: number
  name: string
  price: number
  originalPrice?: number
  quantity: number
  image: string
}

const CART_STORAGE_KEY = 'amer_shop_cart'

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY)
    return cart ? JSON.parse(cart) : []
  } catch {
    return []
  }
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    // Dispatch custom event for cart updates
    window.dispatchEvent(new Event('cartUpdated'))
  } catch (error) {
    console.error('Error saving cart:', error)
  }
}

export function addToCart(product: CartItem): void {
  const cart = getCart()
  const existingItem = cart.find(item => item.id === product.id)
  
  if (existingItem) {
    existingItem.quantity += product.quantity || 1
  } else {
    cart.push({ ...product, quantity: product.quantity || 1 })
  }
  
  saveCart(cart)
}

export function removeFromCart(productId: number): void {
  const cart = getCart().filter(item => item.id !== productId)
  saveCart(cart)
}

export function updateCartItemQuantity(productId: number, quantity: number): void {
  if (quantity <= 0) {
    removeFromCart(productId)
    return
  }
  
  const cart = getCart()
  const item = cart.find(item => item.id === productId)
  if (item) {
    item.quantity = quantity
    saveCart(cart)
  }
}

export function clearCart(): void {
  saveCart([])
}

export function getCartTotal(): number {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function getCartItemCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0)
}


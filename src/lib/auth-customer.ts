// Customer authentication utilities

export function getCustomerToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('customer_token')
}

export function setCustomerToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('customer_token', token)
}

export function removeCustomerToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('customer_token')
}

export function getCustomer(): { id: number; email: string; firstName: string; lastName: string; phone?: string } | null {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem('customer_user')
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function setCustomer(user: any): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('customer_user', JSON.stringify(user))
}

export function removeCustomer(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('customer_user')
}

export function isCustomerAuthenticated(): boolean {
  return getCustomerToken() !== null
}


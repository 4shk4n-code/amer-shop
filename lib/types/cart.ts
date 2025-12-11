export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  category?: string;
  unit?: string;
  isRefurbished?: boolean;
  originalPrice?: number; // For refurbished products
  condition?: string; // For refurbished products
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}


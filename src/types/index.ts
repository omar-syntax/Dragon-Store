export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number;
  images: string[];
  category: string;
  stock: number;
  is_featured: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'customer' | 'admin';
  phone?: string;
  created_at: string;
}

export interface Session {
  userId: string;
  role: 'customer' | 'admin';
  name: string;
  email: string;
  expiresAt: number;
}

export interface Order {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  shipping_address: ShippingAddress;
  payment_method: 'cod';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
}

export interface Offer {
  id: string;
  label: string;
  product_ids: string[];
  discount_percent: number;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface AdminStats {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  total_products: number;
  pending_orders: number;
  low_stock_count: number;
  recent_orders: Order[];
  revenue_by_day: { date: string; revenue: number }[];
}

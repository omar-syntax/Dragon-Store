import type { Product, Category, Order, User, Session, CartItem, Offer, AdminStats } from '@/types'
import { generateId } from './utils'

// ─── Storage Keys ────────────────────────────────────────────────────────────
const KEYS = {
  PRODUCTS: 'dragon:products',
  CATEGORIES: 'dragon:categories',
  ORDERS: 'dragon:orders',
  USERS: 'dragon:users',
  SESSION: 'dragon:session',
  CART: 'dragon:cart',
  OFFERS: 'dragon:offers',
  SEEDED: 'dragon:seeded',
}

// ─── Seed Data ───────────────────────────────────────────────────────────────
const SEED_CATEGORIES: Category[] = [
  { id: 'watches', name: 'Watches', slug: 'watches', created_at: new Date().toISOString() },
  { id: 'bags', name: 'Bags', slug: 'bags', created_at: new Date().toISOString() },
  { id: 'perfumes', name: 'Perfumes', slug: 'perfumes', created_at: new Date().toISOString() },
]

const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Dragon Chronograph Silver',
    slug: 'dragon-chronograph-silver',
    description: 'A premium stainless steel chronograph watch with a sleek silver finish and sapphire crystal glass. Water resistant to 100m, featuring a tachymeter bezel and Swiss-inspired movement. The perfect blend of precision engineering and timeless elegance.',
    price: 250,
    compare_at_price: 320,
    images: ['https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1000&auto=format&fit=crop'],
    category: 'watches',
    stock: 10,
    is_featured: true,
    tags: ['chronograph', 'silver', 'stainless-steel'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Midnight Leather Messenger',
    slug: 'midnight-leather-messenger',
    description: 'Handcrafted genuine leather messenger bag perfect for daily essentials and a 14-inch laptop. Features brass hardware, adjustable strap, and multiple interior compartments. Sustainably sourced full-grain leather that develops a beautiful patina over time.',
    price: 180,
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop'],
    category: 'bags',
    stock: 5,
    is_featured: true,
    tags: ['leather', 'messenger', 'laptop-bag'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    name: 'Dragon Essence No. 5',
    slug: 'dragon-essence-no-5',
    description: 'A signature scent with top notes of bergamot and citrus, a heart of jasmine and sandalwood, and a base of white musk and amber. Long-lasting EDP formulation. 100ml bottle with magnetic cap closure. Our best-selling fragrance for over 3 years.',
    price: 95,
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop'],
    category: 'perfumes',
    stock: 15,
    is_featured: true,
    tags: ['edp', 'signature', 'bestseller'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    name: 'Classic Bifold Wallet',
    slug: 'classic-bifold-wallet',
    description: 'Slim, durable bifold wallet crafted from premium full-grain leather. Features 6 card slots, 2 bill compartments, and a transparent ID window. RFID blocking technology protects your cards. Fits perfectly in any pocket.',
    price: 65,
    images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop'],
    category: 'bags',
    stock: 20,
    is_featured: true,
    tags: ['wallet', 'leather', 'rfid'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-5',
    name: 'Stealth Black Chronograph',
    slug: 'stealth-black-chronograph',
    description: 'A sleek, all-black chronograph watch with PVD-coated stainless steel case and bracelet. Matte black dial with luminous hands for low-light visibility. Japanese quartz movement with 3-year battery life. A statement piece for the modern professional.',
    price: 210,
    images: ['https://images.unsplash.com/photo-1522312346375-d1a52e2b9264?q=80&w=1000&auto=format&fit=crop'],
    category: 'watches',
    stock: 8,
    is_featured: false,
    tags: ['chronograph', 'black', 'pvd'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-6',
    name: 'Velvet Rose EDP',
    slug: 'velvet-rose-edp',
    description: 'A deep, floral fragrance with a velvety texture and long-lasting sillage. Opens with a burst of red rose and patchouli, deepens into oud and vanilla. 80ml bottle. Perfect for evening occasions. Inspired by the gardens of Grasse, France.',
    price: 110,
    images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop'],
    category: 'perfumes',
    stock: 12,
    is_featured: false,
    tags: ['edp', 'rose', 'floral', 'evening'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// ─── Generic localStorage helpers ─────────────────────────────────────────────
function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

// ─── Seeding ─────────────────────────────────────────────────────────────────
export async function seedIfNeeded(): Promise<void> {
  if (typeof window === 'undefined') return
  if (localStorage.getItem(KEYS.SEEDED)) return

  write(KEYS.PRODUCTS, SEED_PRODUCTS)
  write(KEYS.CATEGORIES, SEED_CATEGORIES)
  write(KEYS.ORDERS, [])
  write(KEYS.OFFERS, [])

  // Create admin account
  const adminHash = await hashPassword('dragon2024!')
  const adminUser: User = {
    id: 'user-admin',
    name: 'Dragon Admin',
    email: 'admin@dragonstore.com',
    password_hash: adminHash,
    role: 'admin',
    created_at: new Date().toISOString(),
  }
  write(KEYS.USERS, [adminUser])
  localStorage.setItem(KEYS.SEEDED, '1')
}

// ─── Password hashing (SHA-256 via Web Crypto) ────────────────────────────────
export async function hashPassword(plain: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// ─── Products ─────────────────────────────────────────────────────────────────
export function getProducts(): Product[] {
  return read<Product[]>(KEYS.PRODUCTS, [])
}

export function getProductById(id: string): Product | null {
  return getProducts().find((p) => p.id === id) ?? null
}

export function getProductBySlug(slug: string): Product | null {
  return getProducts().find((p) => p.slug === slug) ?? null
}

export function saveProduct(product: Product): void {
  const products = getProducts()
  const index = products.findIndex((p) => p.id === product.id)
  if (index >= 0) {
    products[index] = { ...product, updated_at: new Date().toISOString() }
  } else {
    products.push({ ...product, updated_at: new Date().toISOString() })
  }
  write(KEYS.PRODUCTS, products)
}

export function deleteProduct(id: string): void {
  write(KEYS.PRODUCTS, getProducts().filter((p) => p.id !== id))
}

export function decrementStock(productId: string, qty: number): void {
  const products = getProducts()
  const product = products.find((p) => p.id === productId)
  if (product) {
    product.stock = Math.max(0, product.stock - qty)
    product.updated_at = new Date().toISOString()
    write(KEYS.PRODUCTS, products)
  }
}

// ─── Categories ───────────────────────────────────────────────────────────────
export function getCategories(): Category[] {
  return read<Category[]>(KEYS.CATEGORIES, [])
}

export function saveCategory(category: Category): void {
  const cats = getCategories()
  const index = cats.findIndex((c) => c.id === category.id)
  if (index >= 0) cats[index] = category
  else cats.push(category)
  write(KEYS.CATEGORIES, cats)
}

export function deleteCategory(id: string): void {
  write(KEYS.CATEGORIES, getCategories().filter((c) => c.id !== id))
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export function getOrders(): Order[] {
  return read<Order[]>(KEYS.ORDERS, [])
}

export function getOrdersByUser(userId: string): Order[] {
  return getOrders().filter((o) => o.user_id === userId)
}

export function saveOrder(order: Order): void {
  const orders = getOrders()
  const index = orders.findIndex((o) => o.id === order.id)
  if (index >= 0) {
    orders[index] = { ...order, updated_at: new Date().toISOString() }
  } else {
    orders.push({ ...order, updated_at: new Date().toISOString() })
  }
  write(KEYS.ORDERS, orders)
}

export function updateOrderStatus(orderId: string, status: Order['status']): void {
  const orders = getOrders()
  const order = orders.find((o) => o.id === orderId)
  if (order) {
    order.status = status
    order.updated_at = new Date().toISOString()
    write(KEYS.ORDERS, orders)
  }
}

export function generateOrderId(): string {
  return 'ORD-' + generateId().toUpperCase().slice(0, 8)
}

// ─── Users ────────────────────────────────────────────────────────────────────
export function getUsers(): User[] {
  return read<User[]>(KEYS.USERS, [])
}

export function getUserById(id: string): User | null {
  return getUsers().find((u) => u.id === id) ?? null
}

export function getUserByEmail(email: string): User | null {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null
}

export function saveUser(user: User): void {
  const users = getUsers()
  const index = users.findIndex((u) => u.id === user.id)
  if (index >= 0) users[index] = user
  else users.push(user)
  write(KEYS.USERS, users)
}

// ─── Session ──────────────────────────────────────────────────────────────────
export function getSession(): Session | null {
  const session = read<Session | null>(KEYS.SESSION, null)
  if (!session) return null
  if (Date.now() > session.expiresAt) {
    clearSession()
    return null
  }
  return session
}

export function setSession(session: Session): void {
  write(KEYS.SESSION, session)
}

export function clearSession(): void {
  if (typeof window !== 'undefined') localStorage.removeItem(KEYS.SESSION)
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export function getCart(): CartItem[] {
  return read<CartItem[]>(KEYS.CART, [])
}

export function setCart(items: CartItem[]): void {
  write(KEYS.CART, items)
}

export function clearCart(): void {
  write(KEYS.CART, [])
}

// ─── Offers ───────────────────────────────────────────────────────────────────
export function getOffers(): Offer[] {
  return read<Offer[]>(KEYS.OFFERS, [])
}

export function getActiveOffers(): Offer[] {
  const now = new Date().toISOString()
  return getOffers().filter((o) => o.start_date <= now && o.end_date >= now)
}

export function getProductOffer(productId: string): Offer | null {
  return getActiveOffers().find((o) => o.product_ids.includes(productId)) ?? null
}

export function getDiscountedPrice(product: Product): number {
  const offer = getProductOffer(product.id)
  if (!offer) return product.price
  return +(product.price * (1 - offer.discount_percent / 100)).toFixed(2)
}

export function saveOffer(offer: Offer): void {
  const offers = getOffers()
  const index = offers.findIndex((o) => o.id === offer.id)
  if (index >= 0) offers[index] = offer
  else offers.push(offer)
  write(KEYS.OFFERS, offers)
}

export function deleteOffer(id: string): void {
  write(KEYS.OFFERS, getOffers().filter((o) => o.id !== id))
}

// ─── Stats ────────────────────────────────────────────────────────────────────
export function getStats(): AdminStats {
  const orders = getOrders()
  const products = getProducts()
  const users = getUsers().filter((u) => u.role === 'customer')

  const completedOrders = orders.filter((o) => o.status !== 'cancelled')
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = orders.filter((o) => o.status === 'pending').length
  const lowStockCount = products.filter((p) => p.stock <= 5).length

  // Revenue by day (last 7 days)
  const revenueByDay: { date: string; revenue: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const dayRevenue = completedOrders
      .filter((o) => o.created_at.slice(0, 10) === dateStr)
      .reduce((sum, o) => sum + o.total, 0)
    revenueByDay.push({ date: dateStr, revenue: dayRevenue })
  }

  return {
    total_revenue: totalRevenue,
    total_orders: orders.length,
    total_customers: users.length,
    total_products: products.length,
    pending_orders: pendingOrders,
    low_stock_count: lowStockCount,
    recent_orders: [...orders].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5),
    revenue_by_day: revenueByDay,
  }
}

import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ShoppingCart, Truck, ShieldCheck, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

// Mock function - will be replaced with Supabase fetch
async function getProduct(id: string) {
  const products = [
    {
      id: '1',
      name: 'Dragon Chronograph Silver',
      slug: 'dragon-chronograph-silver',
      description: 'A premium stainless steel chronograph watch with a sleek silver finish. Features water resistance up to 50m, scratch-resistant sapphire glass, and a precision quartz movement. The perfect balance between elegance and durability.',
      price: 250,
      images: [],
      category: 'watches',
      stock: 10,
      created_at: new Date().toISOString()
    },
    // ... other mock products
  ]
  return products.find(p => p.id === id)
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container py-8 md:py-12">
      <Link 
        href="/products" 
        className="mb-8 flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 flex flex-col items-center justify-center gap-2">
              <svg className="h-16 w-16 opacity-30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M38 30L44 40L50 25L56 40L62 30L58 45H42L38 30Z" fill="currentColor" className="text-slate-600 dark:text-slate-400" />
                <rect x="44" y="47" width="12" height="3" rx="1" fill="currentColor" className="text-slate-600 dark:text-slate-400" />
                <circle cx="50" cy="65" r="18" stroke="currentColor" strokeWidth="4" className="text-slate-600 dark:text-slate-400" />
              </svg>
              <span className="text-[12px] uppercase tracking-wider text-muted-foreground font-semibold opacity-60">
                {product.category}
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium uppercase tracking-wider text-primary">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {product.name}
            </h1>
            <p className="text-2xl font-bold">{formatPrice(product.price)}</p>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="flex flex-col gap-4 py-6 border-y">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Availability:</span>
              <span className={`text-sm font-bold ${product.stock > 0 ? 'text-green-600' : 'text-destructive'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>
            
            <Button size="lg" className="w-full md:w-max px-12 gap-2" disabled={product.stock <= 0}>
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-bold">Fast Shipping</p>
                <p className="text-xs text-muted-foreground">Cash on delivery available</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-bold">Authentic Product</p>
                <p className="text-xs text-muted-foreground">100% genuine quality</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

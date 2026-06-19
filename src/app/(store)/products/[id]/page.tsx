'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Minus, Plus, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getProductById, getDiscountedPrice, getProductOffer, getProducts } from '@/lib/store-engine'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/contexts/CartContext'
import type { Product } from '@/types'
import ProductCard from '@/components/products/ProductCard'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const id = params?.id as string
    const p = getProductById(id)
    if (!p) { router.push('/products'); return }
    setProduct(p)
    const all = getProducts()
    setRelated(all.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4))
  }, [params, router])

  if (!product) return (
    <div className="container py-24 flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )

  const offer = getProductOffer(product.id)
  const finalPrice = getDiscountedPrice(product)
  const hasDiscount = offer !== null && finalPrice < product.price

  const handleAddToCart = () => {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="container py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/products" className="hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Products
        </Link>
        <span>/</span>
        <span className="capitalize">{product.category}</span>
        <span>/</span>
        <span className="text-foreground font-medium truncate">{product.name}</span>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
            {product.images[activeImage] ? (
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="h-20 w-20 opacity-10" viewBox="0 0 100 100" fill="none">
                  <path d="M38 30L44 40L50 25L56 40L62 30L58 45H42L38 30Z" fill="currentColor" />
                </svg>
              </div>
            )}
            {hasDiscount && (
              <div className="absolute top-4 right-4 z-10 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                -{offer!.discount_percent}% OFF
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${i === activeImage ? 'border-primary' : 'border-transparent hover:border-muted-foreground/30'}`}
                >
                  <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-primary capitalize">{product.category}</span>
            <h1 className="text-3xl font-bold tracking-tight mt-1">{product.name}</h1>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold">{formatPrice(finalPrice)}</span>
            {hasDiscount && (
              <div className="flex flex-col">
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.price)}</span>
                <span className="text-xs text-green-600 font-semibold">Save {formatPrice(product.price - finalPrice)}</span>
              </div>
            )}
          </div>

          {/* Offer badge */}
          {offer && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 px-4 py-2">
              <Tag className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">{offer.label}</span>
            </div>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${product.stock > 5 ? 'bg-green-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium">
              {product.stock > 5 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
            </span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {product.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-full bg-muted text-xs font-medium capitalize">{tag}</span>
              ))}
            </div>
          )}

          {/* Quantity + Add to Cart */}
          {product.stock > 0 && (
            <div className="flex gap-3 items-center pt-2">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button onClick={handleAddToCart} className="flex-1 gap-2" size="lg">
                <ShoppingCart className="h-5 w-5" />
                {added ? 'Added to Cart!' : 'Add to Cart'}
              </Button>
            </div>
          )}

          {product.stock <= 0 && (
            <Button disabled size="lg" className="w-full">Out of Stock</Button>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/contexts/CartContext'
import { getDiscountedPrice, getProductOffer } from '@/lib/store-engine'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const offer = getProductOffer(product.id)
  const finalPrice = getDiscountedPrice(product)
  const hasDiscount = offer !== null && finalPrice < product.price

  return (
    <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-sm transition-all hover:shadow-2xl">
      <Link href={`/products/${product.id}`} className="block h-full w-full">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center gap-2">
            <svg className="h-10 w-10 opacity-20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M38 30L44 40L50 25L56 40L62 30L58 45H42L38 30Z" fill="currentColor" />
            </svg>
          </div>
        )}
      </Link>

      {product.stock <= 0 && (
        <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-destructive/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-white">
          Out of Stock
        </div>
      )}

      {hasDiscount && (
        <div className="absolute top-4 right-4 z-20 px-2.5 py-1 bg-green-500/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-white">
          -{offer!.discount_percent}%
        </div>
      )}

      <div className="absolute inset-0 z-30 flex flex-col justify-end p-6 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 group-active:opacity-100 group-focus-within:opacity-100 transition-all duration-500 pointer-events-none group-hover:pointer-events-auto group-active:pointer-events-auto group-focus-within:pointer-events-auto">
        <div className="transform translate-y-8 group-hover:translate-y-0 group-active:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-500 ease-out space-y-4">
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors"
              disabled={product.stock <= 0}
              onClick={(e) => { e.preventDefault(); addItem(product) }}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Link href={`/products/${product.id}`}>
              <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full shadow-lg transition-colors">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="text-white">
            <div className="flex justify-between items-start gap-2 mb-1">
              <h3 className="font-heading font-bold text-lg leading-tight uppercase tracking-wide truncate">
                {product.name}
              </h3>
              <div className="flex flex-col items-end shrink-0">
                <span className="font-bold text-sm bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-md">
                  {formatPrice(finalPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-white/60 line-through">{formatPrice(product.price)}</span>
                )}
              </div>
            </div>
            <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

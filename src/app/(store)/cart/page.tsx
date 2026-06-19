'use client'

import Link from 'next/link'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CartItem from '@/components/cart/CartItem'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/contexts/CartContext'

export default function CartPage() {
  const { items, subtotal } = useCart()
  const shipping = items.length > 0 ? 10 : 0
  const total = subtotal + shipping

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>

      {items.length > 0 ? (
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Cart Items */}
          <div className="lg:col-span-8 flex flex-col divide-y border-y">
            {items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
            <div className="py-6">
              <Button variant="link" asChild className="p-0 h-auto">
                <Link href="/products" className="flex items-center text-sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="rounded-lg border bg-card p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <Button className="w-full mt-6" size="lg" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Taxes calculated at checkout. Shipping is flat rate.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground mt-2 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Button asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

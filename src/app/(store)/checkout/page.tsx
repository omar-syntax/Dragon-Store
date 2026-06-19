'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Truck, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { saveOrder, decrementStock, generateOrderId, getDiscountedPrice } from '@/lib/store-engine'
import type { Order, OrderItem } from '@/types'

export default function CheckoutPage() {
  const router = useRouter()
  const { session, isLoading: authLoading } = useAuth()
  const { items, subtotal, clearAllItems } = useCart()

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    notes: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !session) {
      router.push(`/login?redirect=/checkout`)
    }
  }, [session, authLoading, router])

  // Pre-fill user name if logged in
  useEffect(() => {
    if (session) {
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || session.name || '',
      }))
    }
  }, [session])

  // Redirect to cart if empty
  useEffect(() => {
    if (!authLoading && items.length === 0) {
      router.push('/cart')
    }
  }, [items, authLoading, router])

  if (authLoading || !session || items.length === 0) {
    return (
      <div className="container min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground text-sm">Loading checkout...</p>
      </div>
    )
  }

  const shipping = 10
  const total = subtotal + shipping

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    // Basic validation
    if (!form.fullName || !form.phone || !form.address || !form.city || !form.state || !form.postalCode) {
      setError('Please fill in all required fields.')
      setIsSubmitting(false)
      return
    }

    try {
      const orderItems: OrderItem[] = items.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.images[0] || '',
        quantity: item.quantity,
        price: getDiscountedPrice(item.product),
      }))

      const newOrder: Order = {
        id: generateOrderId(),
        user_id: session.userId,
        user_name: session.name,
        user_email: session.email,
        items: orderItems,
        status: 'pending',
        total: total,
        shipping_address: {
          full_name: form.fullName,
          address_line1: form.address,
          city: form.city,
          state: form.state,
          postal_code: form.postalCode,
          phone: form.phone,
        },
        payment_method: 'cod',
        notes: form.notes || undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // 1. Save order
      saveOrder(newOrder)

      // 2. Decrement stocks
      items.forEach((item) => {
        decrementStock(item.product.id, item.quantity)
      })

      // 3. Clear cart
      clearAllItems()

      // 4. Redirect
      router.push('/account/orders?success=true')
    } catch (err: any) {
      setError(err?.message || 'Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>

      {error && (
        <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-12 lg:grid-cols-12">
        {/* Checkout Form */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Shipping Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fullName" className="text-sm font-medium">Full Name *</label>
                <input
                  id="fullName"
                  required
                  value={form.fullName}
                  onChange={handleChange('fullName')}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="John Doe"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-sm font-medium">Phone Number *</label>
                <input
                  id="phone"
                  required
                  value={form.phone}
                  onChange={handleChange('phone')}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="+88017..."
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="address" className="text-sm font-medium">Address Line *</label>
                <input
                  id="address"
                  required
                  value={form.address}
                  onChange={handleChange('address')}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="House 123, Road 4, Sector 5"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="city" className="text-sm font-medium">City *</label>
                <input
                  id="city"
                  required
                  value={form.city}
                  onChange={handleChange('city')}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Dhaka"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="state" className="text-sm font-medium">State/Province *</label>
                <input
                  id="state"
                  required
                  value={form.state}
                  onChange={handleChange('state')}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Dhaka Division"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="postalCode" className="text-sm font-medium">Postal Code *</label>
                <input
                  id="postalCode"
                  required
                  value={form.postalCode}
                  onChange={handleChange('postalCode')}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="1230"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="notes" className="text-sm font-medium">Order Notes <span className="text-muted-foreground">(optional)</span></label>
                <textarea
                  id="notes"
                  value={form.notes}
                  onChange={handleChange('notes')}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Notes about your order, e.g. special delivery instructions."
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold">Payment Method</h2>
            <div className="flex items-center gap-3 p-4 rounded-lg border bg-accent/50 border-primary">
              <div className="h-4 w-4 rounded-full border-4 border-primary" />
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Cash on Delivery (COD)</p>
                  <p className="text-xs text-muted-foreground">Pay when you receive the product</p>
                </div>
                <Truck className="h-5 w-5 text-primary" />
              </div>
            </div>
          </section>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Placing Order...</span>
            ) : (
              `Place Order (${formatPrice(total)})`
            )}
          </Button>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="rounded-lg border bg-card p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold mb-4">Your Order</h2>
            <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {items.map((item) => {
                const finalItemPrice = getDiscountedPrice(item.product)
                return (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="h-16 w-16 rounded border bg-muted flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                      {item.product.images[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <svg className="h-6 w-6 opacity-30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M38 30L44 40L50 25L56 40L62 30L58 45H42L38 30Z" fill="currentColor" className="text-slate-600 dark:text-slate-400" />
                          <rect x="44" y="47" width="12" height="3" rx="1" fill="currentColor" className="text-slate-600 dark:text-slate-400" />
                          <circle cx="50" cy="65" r="18" stroke="currentColor" strokeWidth="4" className="text-slate-600 dark:text-slate-400" />
                        </svg>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold self-center">{formatPrice(finalItemPrice * item.quantity)}</p>
                  </div>
                )
              })}
            </div>

            <div className="space-y-4 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatPrice(shipping)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { getOrdersByUser } from '@/lib/store-engine'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Order } from '@/types'
import { Loader2, ShoppingBag, CheckCircle, Package } from 'lucide-react'

export default function OrdersPage() {
  const router = useRouter()
  const { session, isLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [showSuccess, setShowSuccess] = useState(false)

  // Protect route
  useEffect(() => {
    if (!isLoading && !session) {
      router.push('/login?redirect=/account/orders')
    }
  }, [session, isLoading, router])

  // Load orders and check for success query param
  useEffect(() => {
    if (session?.userId) {
      const userOrders = getOrdersByUser(session.userId)
      setOrders(userOrders.sort((a, b) => b.created_at.localeCompare(a.created_at)))
    }
    
    // Use window.location.search to avoid Next.js static bailout issue with useSearchParams
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('success') === 'true') {
        setShowSuccess(true)
        // Clean up url query param
        router.replace('/account/orders')
      }
    }
  }, [session, router])

  if (isLoading || !session) {
    return (
      <div className="container min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground text-sm">Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
        <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
        </span>
      </div>

      {showSuccess && (
        <div className="mb-8 p-4 rounded-xl border border-green-500/20 bg-green-500/5 flex items-start gap-3 text-green-600 animate-in fade-in slide-in-from-top-4 duration-500">
          <CheckCircle className="h-5 w-5 shrink-0 mt-0.5 text-green-500" />
          <div>
            <h3 className="font-bold text-sm text-green-700">Order Placed Successfully!</h3>
            <p className="text-xs text-green-600/90 mt-0.5">Thank you for your purchase. We are processing your Cash on Delivery order and will contact you shortly.</p>
          </div>
        </div>
      )}

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border bg-card shadow-sm overflow-hidden">
              {/* Order Header */}
              <div className="bg-muted/40 p-4 border-b flex flex-wrap justify-between items-center gap-4 text-sm">
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Order ID</p>
                    <p className="font-bold text-foreground font-mono mt-0.5">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Placed On</p>
                    <p className="font-medium text-foreground mt-0.5">{formatDate(order.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Total Price</p>
                    <p className="font-bold text-foreground mt-0.5">{formatPrice(order.total)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${
                    order.status === 'delivered' ? 'bg-green-500/10 border-green-500/30 text-green-500' :
                    order.status === 'cancelled' ? 'bg-destructive/10 border-destructive/20 text-destructive' :
                    'bg-amber-500/10 border-amber-500/20 text-amber-500'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 divide-y">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 py-4 first:pt-0 last:pb-0 items-center">
                    <div className="relative h-16 w-16 border rounded bg-muted overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {item.product_image ? (
                        <Image
                          src={item.product_image}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-muted-foreground/40" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm line-clamp-1">{item.product_name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Qty: {item.quantity} @ {formatPrice(item.price)} each
                      </p>
                    </div>
                    <p className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              {/* Shipping Details */}
              <div className="bg-muted/20 px-4 py-3 border-t flex flex-wrap justify-between gap-4 text-xs text-muted-foreground">
                <div>
                  <span className="font-bold text-foreground">Ship To:</span>{' '}
                  {order.shipping_address.full_name},{' '}
                  {order.shipping_address.address_line1},{' '}
                  {order.shipping_address.city},{' '}
                  {order.shipping_address.state} {order.shipping_address.postal_code}
                </div>
                <div>
                  <span className="font-bold text-foreground">Phone:</span> {order.shipping_address.phone}
                </div>
                <div>
                  <span className="font-bold text-foreground">Payment:</span> Cash on Delivery
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-12 text-center shadow-sm">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold">No orders found</h2>
          <p className="text-muted-foreground mt-2 mb-6">You haven&apos;t placed any orders with this account yet.</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

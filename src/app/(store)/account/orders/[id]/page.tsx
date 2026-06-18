import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Package, MapPin, Phone, CreditCard, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PageProps {
  params: Promise<{ id: string }>
}

// Mock database call
async function getOrderDetails(id: string) {
  // In a real application, you would fetch this from Supabase
  const mockOrders = [
    {
      id: 'ord-8293-hj89',
      created_at: '2026-06-15T14:32:00Z',
      status: 'processing' as const,
      payment_method: 'cod' as const,
      total: 320.00,
      shipping_address: {
        full_name: 'John Doe',
        address_line1: '123 Dragon Street',
        address_line2: 'Apartment 4B',
        city: 'Metropolis',
        state: 'New York',
        postal_code: '10001',
        phone: '+1 (555) 019-2834',
      },
      items: [
        {
          product_id: 'prod-1',
          name: 'Chronograph Elite Gold Watch',
          category: 'watches',
          image: '/images/watch-1.jpg',
          quantity: 1,
          price: 250.00,
        },
        {
          product_id: 'prod-2',
          name: 'Classic Leather Wallet',
          category: 'bags',
          image: '/images/wallet-1.jpg',
          quantity: 2,
          price: 35.00,
        }
      ]
    }
  ]

  const order = mockOrders.find(o => o.id === id)
  return order || null
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params
  const order = await getOrderDetails(id)

  if (!order) {
    notFound()
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900/50',
    processing: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-900/50',
    delivered: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50',
    cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  }

  return (
    <div className="container max-w-4xl py-8 md:py-12 space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link href="/account/orders">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
          <p className="text-sm text-muted-foreground">ID: {order.id}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" /> Order Items
            </h2>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.product_id} className="py-4 flex items-center gap-4 first:pt-0 last:pb-0">
                  <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center font-bold text-xs text-muted-foreground overflow-hidden">
                    {/* Placeholder image representation */}
                    {item.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-muted-foreground capitalize">Category: {item.category}</p>
                    <p className="text-xs font-semibold">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-sm font-bold">${(item.quantity * item.price).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between items-center font-bold text-lg">
              <span>Total Amount</span>
              <span className="text-primary">${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Delivery Timeline / Details */}
          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> Status & Updates
            </h2>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[order.status]}`}>
                {order.status.toUpperCase()}
              </span>
              <span className="text-sm text-muted-foreground">
                Placed on {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              You will pay the delivery agent in cash upon receiving the package. Please ensure you have the exact amount ready.
            </p>
          </div>
        </div>

        {/* Sidebar details */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> Shipping Address
            </h2>
            <div className="space-y-2 text-sm">
              <p className="font-bold">{order.shipping_address.full_name}</p>
              <p>{order.shipping_address.address_line1}</p>
              {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
              <p>
                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
              </p>
              <p className="flex items-center gap-2 mt-2 pt-2 border-t text-muted-foreground">
                <Phone className="h-4 w-4" /> {order.shipping_address.phone}
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" /> Payment Method
            </h2>
            <div className="flex items-center gap-2 text-sm bg-primary/5 p-3 rounded-lg border border-primary/15">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-primary">Cash On Delivery</p>
                <p className="text-xs text-muted-foreground">No online payment needed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

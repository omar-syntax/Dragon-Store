import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Truck } from 'lucide-react'

export default function CheckoutPage() {
  // Static summary for UI scaffolding
  const subtotal = 250
  const shipping = 10
  const total = subtotal + shipping

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>

      <div className="grid gap-12 lg:grid-cols-12">
        {/* Checkout Form */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Shipping Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Full Name</label>
                <input className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="John Doe" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Phone Number</label>
                <input className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="+88017..." />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-sm font-medium">Address Line</label>
                <input className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="House 123, Road 4, Sector 5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">City</label>
                <input className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Dhaka" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Postal Code</label>
                <input className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="1230" />
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

          <Button size="lg" className="w-full">Place Order (COD)</Button>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5">
           <div className="rounded-lg border bg-card p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold mb-4">Your Order</h2>
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex gap-4">
                   <div className="h-16 w-16 rounded border bg-muted flex items-center justify-center flex-shrink-0">
                     <svg className="h-6 w-6 opacity-30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M38 30L44 40L50 25L56 40L62 30L58 45H42L38 30Z" fill="currentColor" className="text-slate-600 dark:text-slate-400" />
                       <rect x="44" y="47" width="12" height="3" rx="1" fill="currentColor" className="text-slate-600 dark:text-slate-400" />
                       <circle cx="50" cy="65" r="18" stroke="currentColor" strokeWidth="4" className="text-slate-600 dark:text-slate-400" />
                     </svg>
                   </div>
                   <div className="flex flex-1 flex-col justify-center">
                      <p className="text-sm font-medium">Dragon Chronograph Silver</p>
                      <p className="text-xs text-muted-foreground">Qty: 1</p>
                   </div>
                   <p className="text-sm font-bold self-center">{formatPrice(250)}</p>
                </div>
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
      </div>
    </div>
  )
}

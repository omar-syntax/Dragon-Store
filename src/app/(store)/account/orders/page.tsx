import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function OrdersPage() {
  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">My Orders</h1>
      <div className="rounded-lg border bg-card">
         <div className="p-6 text-center">
            <p className="text-muted-foreground">You have no orders yet.</p>
            <Button asChild className="mt-4">
               <Link href="/products">Shop Now</Link>
            </Button>
         </div>
      </div>
    </div>
  )
}

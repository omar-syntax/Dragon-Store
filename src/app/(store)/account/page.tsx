import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AccountPage() {
  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">My Account</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="col-span-1 space-y-4">
           <div className="rounded-lg border p-6 space-y-4">
              <div className="h-20 w-20 rounded-full bg-muted mx-auto" />
              <div className="text-center">
                 <p className="font-bold">John Doe</p>
                 <p className="text-sm text-muted-foreground">john@example.com</p>
              </div>
              <Button variant="outline" className="w-full">Edit Profile</Button>
           </div>
           <nav className="flex flex-col gap-1">
              <Link href="/account" className="p-2 bg-muted rounded-md text-sm font-medium">Dashboard</Link>
              <Link href="/account/orders" className="p-2 hover:bg-muted rounded-md text-sm transition-colors">My Orders</Link>
              <Button variant="ghost" className="justify-start px-2 font-normal text-destructive hover:text-destructive hover:bg-destructive/10">Logout</Button>
           </nav>
        </div>
        <div className="md:col-span-2 space-y-8">
           <section>
              <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
              <div className="rounded-lg border bg-card p-6 text-center">
                 <p className="text-sm text-muted-foreground">You haven't placed any orders yet.</p>
                 <Button asChild className="mt-4" variant="link">
                    <Link href="/products">Shop Now</Link>
                 </Button>
              </div>
           </section>
        </div>
      </div>
    </div>
  )
}

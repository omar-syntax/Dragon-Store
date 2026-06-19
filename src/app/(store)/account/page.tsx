'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { getUserById, saveUser, getOrdersByUser, setSession, getSession } from '@/lib/store-engine'
import { formatPrice, formatDate } from '@/lib/utils'
import type { User, Order } from '@/types'
import { Loader2, User as UserIcon, ShoppingBag, Shield } from 'lucide-react'

export default function AccountPage() {
  const router = useRouter()
  const { session, logout, isLoading, refreshSession, isAdmin } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Protect route
  useEffect(() => {
    if (!isLoading && !session) {
      router.push('/login?redirect=/account')
    }
  }, [session, isLoading, router])

  // Fetch full user details and user orders
  useEffect(() => {
    if (session?.userId) {
      const u = getUserById(session.userId)
      if (u) {
        setUser(u)
        setName(u.name)
        setPhone(u.phone || '')
      }
      const userOrders = getOrdersByUser(session.userId)
      setOrders(userOrders.sort((a, b) => b.created_at.localeCompare(a.created_at)))
    }
  }, [session])

  if (isLoading || !session) {
    return (
      <div className="container min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground text-sm">Loading account details...</p>
      </div>
    )
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!name.trim()) {
      setError('Name is required.')
      return
    }

    if (user) {
      const updatedUser: User = {
        ...user,
        name: name.trim(),
        phone: phone.trim() || undefined,
      }

      // Save user record
      saveUser(updatedUser)
      setUser(updatedUser)

      // Update session localStorage to reflect new name
      const currSession = getSession()
      if (currSession) {
        currSession.name = name.trim()
        setSession(currSession)
        refreshSession()
      }

      setSuccess('Profile updated successfully.')
      setIsEditing(false)
    }
  }

  const recentOrders = orders.slice(0, 3)

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
        {isAdmin && (
          <Button asChild variant="secondary" className="gap-2 border-amber-500/20 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
            <Link href="/admin">
              <Shield className="h-4 w-4" /> Go to Admin Panel
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile Sidebar */}
        <div className="col-span-1 space-y-4">
          <div className="rounded-lg border bg-card p-6 space-y-4 shadow-sm">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
              <UserIcon className="h-10 w-10" />
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">{user?.name || session.name}</p>
              <p className="text-sm text-muted-foreground">{session.email}</p>
              {user?.phone && (
                <p className="text-xs text-muted-foreground mt-1">{user.phone}</p>
              )}
            </div>

            {error && (
              <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 p-2 rounded text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="text-xs text-green-500 bg-green-500/10 border border-green-500/20 p-2 rounded text-center">
                {success}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-xs font-semibold">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex h-8 w-full rounded border border-input bg-background px-2.5 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="phone" className="text-xs font-semibold">Phone Number</label>
                  <input
                    id="phone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex h-8 w-full rounded border border-input bg-background px-2.5 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="e.g. +88017..."
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <Button type="submit" size="sm" className="w-full text-xs">Save</Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false)
                      setError('')
                      if (user) {
                        setName(user.name)
                        setPhone(user.phone || '')
                      }
                    }}
                    className="w-full text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>

          <nav className="flex flex-col gap-1 border rounded-lg p-2 bg-card shadow-sm">
            <Link href="/account" className="p-2 bg-muted rounded-md text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/account/orders" className="p-2 hover:bg-muted rounded-md text-sm transition-colors">
              My Orders
            </Link>
            <Button
              variant="ghost"
              onClick={logout}
              className="justify-start px-2 font-normal text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              Logout
            </Button>
          </nav>
        </div>

        {/* Dashboard Area */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recent Orders</h2>
              {orders.length > 3 && (
                <Link href="/account/orders" className="text-sm font-semibold text-primary hover:underline">
                  View All Orders
                </Link>
              )}
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="rounded-lg border bg-card p-5 shadow-sm space-y-3">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <p className="font-bold text-sm text-foreground uppercase">{order.id}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="text-sm font-bold bg-muted px-2.5 py-1 rounded-md">
                          {formatPrice(order.total)}
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                          order.status === 'delivered' ? 'bg-green-500/10 border-green-500/30 text-green-500' :
                          order.status === 'cancelled' ? 'bg-destructive/10 border-destructive/20 text-destructive' :
                          'bg-amber-500/10 border-amber-500/20 text-amber-500'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="border-t pt-3 flex flex-col gap-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs items-center">
                          <span className="text-muted-foreground truncate max-w-[250px]">
                            {item.product_name} <span className="text-foreground font-semibold">x{item.quantity}</span>
                          </span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border bg-card p-8 text-center shadow-sm">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">You haven&apos;t placed any orders yet.</p>
                <Button asChild className="mt-4" variant="outline">
                  <Link href="/products">Shop Now</Link>
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

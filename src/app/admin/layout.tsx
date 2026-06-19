'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { 
  LayoutGrid, 
  Package, 
  Tag, 
  ShoppingBag, 
  Users, 
  Sparkles, 
  LogOut, 
  Loader2,
  Store,
  Menu,
  X
} from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { session, isLoading, isAdmin, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Enforce admin access client-side
  useEffect(() => {
    if (!isLoading) {
      if (!session) {
        router.push('/login?redirect=' + pathname)
      } else if (!isAdmin) {
        router.push('/account')
      }
    }
  }, [session, isLoading, isAdmin, router, pathname])

  if (isLoading || !session || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-slate-400 text-sm">Authenticating admin session...</p>
      </div>
    )
  }

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutGrid },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/categories', label: 'Categories', icon: Tag },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/offers', label: 'Offers', icon: Sparkles },
  ]

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/80 sticky top-0 z-50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
            <Image src="/dragon-logo.svg" alt="Dragon Logo" width={20} height={20} className="object-contain" />
          </div>
          <span className="font-heading font-bold uppercase tracking-widest text-xs text-white">Admin Portal</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-800 bg-slate-950 md:bg-slate-900/50 backdrop-blur-xl flex flex-col justify-between p-6 h-screen transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky md:top-0 md:shrink-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-lg overflow-hidden shrink-0">
              <Image src="/dragon-logo.svg" alt="Dragon Logo" width={28} height={28} className="object-contain" />
            </div>
            <div>
              <span className="font-heading font-bold uppercase tracking-[0.2em] text-xs text-white block">Dragon</span>
              <span className="text-[10px] uppercase tracking-wider text-amber-500 font-bold">Admin Portal</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    active 
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="px-2">
            <p className="text-xs font-bold text-white truncate">{session.name}</p>
            <p className="text-[10px] text-slate-500 truncate mt-0.5">{session.email}</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button asChild variant="outline" className="w-full justify-start gap-2 text-xs border-slate-800 bg-transparent hover:bg-slate-800 text-slate-300">
              <Link href="/">
                <Store className="h-3.5 w-3.5" /> Back to Store
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              onClick={logout}
              className="w-full justify-start gap-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <LogOut className="h-3.5 w-3.5" /> Log Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 md:p-12 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  )
}

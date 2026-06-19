'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { ShoppingCart, User, Search, Home, Watch, Briefcase, Sparkles, LayoutGrid, LogOut, Shield, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect, Suspense } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import GlobalSearch from './GlobalSearch'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'

function NavbarContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { count } = useCart()
  const { session, logout, isAdmin } = useAuth()
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const isHome = pathname === '/'

  useEffect(() => {
    setIsMounted(true)
    if (!isHome) { setIsVisible(true); return }
    const handleScroll = () => setIsVisible(window.scrollY > window.innerHeight * 0.6)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHome])

  if (!isMounted) return null
  if (pathname.startsWith('/admin')) return null

  const navItems = [
    { href: '/products', icon: LayoutGrid, label: 'All Products' },
    { href: '/products?category=watches', icon: Watch, label: 'Watches' },
    { href: '/products?category=bags', icon: Briefcase, label: 'Bags' },
    { href: '/products?category=perfumes', icon: Sparkles, label: 'Perfumes' },
  ]

  const visibilityClasses = isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0 pointer-events-none'

  const isActive = (href: string) => {
    const itemCategory = href.includes('category=') ? new URLSearchParams(href.split('?')[1]).get('category') : null
    const currentCategory = searchParams.get('category')
    return pathname === href.split('?')[0] && (itemCategory ? currentCategory === itemCategory : !currentCategory)
  }

  return (
    <TooltipProvider delayDuration={0}>
      <GlobalSearch open={isSearchOpen} onOpenChange={setIsSearchOpen} />

      {/* Desktop Sidebar Dock */}
      <aside className={`fixed left-4 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col items-center transition-all duration-700 ease-in-out ${visibilityClasses}`}>
        <nav className="flex flex-col items-center gap-1.5 p-2 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
          <Link href="/" className="mb-2">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform overflow-hidden">
              <Image src="/dragon-logo.svg" alt="Dragon Logo" width={32} height={32} className="object-contain" />
            </div>
          </Link>

          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <Button variant="ghost" size="icon" className={`h-10 w-10 rounded-full transition-all duration-300 ${active ? 'bg-primary text-primary-foreground shadow-md' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}>
                      <Icon className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-heading font-bold text-[10px] uppercase tracking-widest">{item.label}</TooltipContent>
              </Tooltip>
            )
          })}

          <div className="w-6 h-px bg-white/10 my-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="h-10 w-10 rounded-full text-white/60 hover:bg-white/10 hover:text-white">
                <Search className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-heading font-bold text-[10px] uppercase tracking-widest">Search</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-white/60 hover:bg-white/10 hover:text-white relative">
                  <ShoppingCart className="h-4 w-4" />
                  {count > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-white shadow-sm">
                      {count > 9 ? '9+' : count}
                    </span>
                  )}
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-heading font-bold text-[10px] uppercase tracking-widest">Cart</TooltipContent>
          </Tooltip>

          {session ? (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/account">
                    <Button variant="ghost" size="icon" className={`h-10 w-10 rounded-full transition-all duration-300 ${pathname.startsWith('/account') ? 'bg-primary text-primary-foreground' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}>
                      <User className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-heading font-bold text-[10px] uppercase tracking-widest">Account</TooltipContent>
              </Tooltip>
              {isAdmin && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/admin">
                      <Button variant="ghost" size="icon" className={`h-10 w-10 rounded-full transition-all duration-300 ${pathname.startsWith('/admin') ? 'bg-amber-500 text-white' : 'text-amber-400/70 hover:bg-amber-500/20 hover:text-amber-400'}`}>
                        <Shield className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-heading font-bold text-[10px] uppercase tracking-widest">Admin</TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={logout} className="h-10 w-10 rounded-full text-white/40 hover:bg-red-500/20 hover:text-red-400 transition-all">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-heading font-bold text-[10px] uppercase tracking-widest">Logout</TooltipContent>
              </Tooltip>
            </>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/login">
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-white/60 hover:bg-white/10 hover:text-white">
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-heading font-bold text-[10px] uppercase tracking-widest">Sign In</TooltipContent>
            </Tooltip>
          )}
        </nav>
      </aside>

      {/* Mobile Bottom Floating Dock */}
      <header className={`lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-[400px] transition-all duration-700 ease-in-out ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-24 opacity-0 scale-95 pointer-events-none'}`}>
        <nav className="flex items-center justify-between p-2 px-4 bg-slate-950/90 backdrop-blur-2xl border border-white/20 rounded-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-lg overflow-hidden">
              <Image src="/dragon-logo.svg" alt="Dragon Logo" width={28} height={28} className="object-contain" />
            </div>
            <span className="font-heading font-bold uppercase tracking-[0.2em] text-[10px] text-white">Dragon</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="h-10 w-10 rounded-full text-white hover:bg-white/10">
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full relative text-white hover:bg-white/10">
                <ShoppingCart className="h-5 w-5" />
                {count > 0 && <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">{count > 9 ? '9+' : count}</span>}
              </Button>
            </Link>
            {session ? (
              <Link href="/account">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-white hover:bg-white/10">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-white hover:bg-white/10">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <div className="w-px h-5 bg-white/20 mx-0.5" />
            <Button variant="ghost" size="icon" onClick={() => setIsMobileNavOpen(true)} className="h-10 w-10 rounded-full text-white hover:bg-white/10">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </nav>
      </header>
      {/* Mobile Nav Overlay */}
      {isMobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-[110] bg-slate-950/95 backdrop-blur-3xl flex flex-col p-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-8">
            <span className="font-heading font-bold uppercase tracking-widest text-lg text-white">Menu</span>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileNavOpen(false)} className="text-white hover:bg-white/10 rounded-full h-10 w-10">
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link key={item.label} href={item.href} onClick={() => setIsMobileNavOpen(false)} className={`flex flex-col items-center justify-center p-6 rounded-3xl border transition-all ${active ? 'bg-primary/20 border-primary text-primary' : 'bg-slate-900 border-white/10 text-white hover:bg-slate-800'}`}>
                  <Icon className="h-8 w-8 mb-3" />
                  <span className="font-semibold text-sm text-center">{item.label}</span>
                </Link>
              )
            })}
          </div>
          
          <div className="mt-auto space-y-3 pb-8">
            {isAdmin && (
              <Button asChild variant="outline" className="w-full h-14 rounded-2xl border-amber-500/30 text-amber-500 bg-amber-500/10 hover:bg-amber-500/20" onClick={() => setIsMobileNavOpen(false)}>
                <Link href="/admin"><Shield className="mr-2 h-5 w-5" /> Admin Portal</Link>
              </Button>
            )}
            {session && (
              <Button variant="ghost" className="w-full h-14 rounded-2xl text-red-400 hover:bg-red-500/20 hover:text-red-300" onClick={() => { logout(); setIsMobileNavOpen(false); }}>
                <LogOut className="mr-2 h-5 w-5" /> Sign Out
              </Button>
            )}
          </div>
        </div>
      )}

    </TooltipProvider>
  )
}

export default function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  )
}

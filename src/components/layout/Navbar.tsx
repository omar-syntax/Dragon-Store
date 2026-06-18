'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, User, Search, Home, Watch, Briefcase, Sparkles, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import GlobalSearch from './GlobalSearch'

export default function Navbar() {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const isHome = pathname === '/'

  useEffect(() => {
    setIsMounted(true)
    
    if (!isHome) {
      setIsVisible(true)
      return
    }

    const handleScroll = () => {
      // Reveal the dock after scrolling past 60% of the screen height
      const threshold = window.innerHeight * 0.6
      setIsVisible(window.scrollY > threshold)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHome])

  if (!isMounted) return null

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/products', icon: LayoutGrid, label: 'All Products' },
    { href: '/products?category=watches', icon: Watch, label: 'Watches' },
    { href: '/products?category=bags', icon: Briefcase, label: 'Bags' },
    { href: '/products?category=perfumes', icon: Sparkles, label: 'Perfumes' },
  ]

  const visibilityClasses = isVisible 
    ? "translate-x-0 opacity-100" 
    : "-translate-x-20 opacity-0 pointer-events-none"

  return (
    <TooltipProvider delayDuration={0}>
      <GlobalSearch open={isSearchOpen} onOpenChange={setIsSearchOpen} />
      
      <aside className={`fixed left-4 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col items-center transition-all duration-700 ease-in-out ${visibilityClasses}`}>
        <nav className="flex flex-col items-center gap-1.5 p-2 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
          {/* Logo / Home */}
          <Link href="/" className="mb-2">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform overflow-hidden">
              <Image 
                src="/dragon-logo.svg" 
                alt="Dragon Logo" 
                width={32} 
                height={32}
                className="object-contain"
              />
            </div>
          </Link>

          {/* Navigation Items */}
          {navItems.slice(1).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
            
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-10 w-10 rounded-full transition-all duration-300 ${
                        isActive 
                          ? 'bg-primary text-primary-foreground shadow-md' 
                          : 'text-white/60 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-heading font-bold text-[10px] uppercase tracking-widest">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            )
          })}

          <div className="w-6 h-px bg-white/10 my-1" />

          {/* Search Trigger */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="h-10 w-10 rounded-full text-white/60 hover:bg-white/10 hover:text-white transition-all"
              >
                <Search className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-heading font-bold text-[10px] uppercase tracking-widest">
              Search
            </TooltipContent>
          </Tooltip>

          {/* Cart */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-white/60 hover:bg-white/10 hover:text-white transition-all relative"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-white shadow-sm">
                    0
                  </span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-heading font-bold text-[10px] uppercase tracking-widest">
              Cart
            </TooltipContent>
          </Tooltip>

          {/* Account */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/account">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-white/60 hover:bg-white/10 hover:text-white transition-all"
                >
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-heading font-bold text-[10px] uppercase tracking-widest">
              Account
            </TooltipContent>
          </Tooltip>
        </nav>
      </aside>

      {/* Mobile Top Bar */}
      <header className={`lg:hidden fixed top-4 left-4 right-4 z-[100] transition-all duration-700 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'}`}>
        <nav className="flex items-center justify-between p-2 pl-4 bg-slate-950/80 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl">
           <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-lg overflow-hidden">
              <Image 
                src="/dragon-logo.svg" 
                alt="Dragon Logo" 
                width={28} 
                height={28}
                className="object-contain"
              />
            </div>
            <span className="font-heading font-bold uppercase tracking-[0.2em] text-xs text-white">Dragon</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSearchOpen(true)}
              className="h-10 w-10 text-white hover:bg-white/10"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="h-10 w-10 relative text-white hover:bg-white/10">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">0</span>
              </Button>
            </Link>
            <Link href="/account">
              <Button variant="ghost" size="icon" className="h-10 w-10 text-white hover:bg-white/10">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>
    </TooltipProvider>
  )
}

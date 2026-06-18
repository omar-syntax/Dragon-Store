'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShieldCheck, Truck, Watch, Briefcase, Sparkles, ShoppingBag, Star, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/products/ProductCard'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

const SLIDES = [
  {
    image: '/slide-watches.png',
    title: 'Precision Craftsmanship',
    subtitle: 'Dragon Chronographs',
    description: 'Discover our premium collection of stainless steel watches designed for the bold and sophisticated.',
    buttonText: 'Shop Watches',
    link: '/products?category=watches',
    overlay: 'from-black/60 via-black/30 to-transparent',
  },
  {
    image: '/slide-wallets.png',
    title: 'Handcrafted Heritage',
    subtitle: 'Wallets & Bundles',
    description: 'Timeless wallets and bundle sets handcrafted from genuine, sustainably sourced leather.',
    buttonText: 'Shop Wallets',
    link: '/products?category=bags',
    overlay: 'from-black/60 via-black/30 to-transparent',
  },
  {
    image: '/slide-bracelets.png',
    title: 'Wear Your Identity',
    subtitle: 'Dragon Bracelets',
    description: 'Bold, elegant bracelets crafted to complement every style — from minimalist to statement-making.',
    buttonText: 'Shop Bracelets',
    link: '/products',
    overlay: 'from-black/60 via-black/30 to-transparent',
  },
]

const TESTIMONIALS = [
  {
    name: 'James R.',
    role: 'Watch Enthusiast',
    content: "The attention to detail on the Dragon Chronograph is insane. Feels like a $2000 watch for a fraction of the price.",
    rating: 5
  },
  {
    name: 'Sarah M.',
    role: 'Entrepreneur',
    content: "Best leather wallet I've ever owned. The patina after 3 months is beautiful. It truly gets better with age.",
    rating: 5
  },
  {
    name: 'Michael T.',
    role: 'Creative Director',
    content: "Dragon Essence No. 5 is my new signature scent. I get compliments every single day at the office.",
    rating: 5
  },
  {
    name: 'Elena G.',
    role: 'Digital Nomad',
    content: "Fast shipping and the packaging was pure luxury. Unboxing was an experience in itself. Highly recommended.",
    rating: 5
  },
  {
    name: 'David L.',
    role: 'Collector',
    content: "The weight and feel of their accessories are just different. You can tell they don't cut corners on materials.",
    rating: 5
  }
]

function RevealSection({
  children,
  delay = 0,
  duration = 1000,
  translateY = 48,
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  translateY?: number
}) {
  const [isVisible, setIsVisible] = useState(false)
  const domRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    )
    const currentRef = domRef.current
    if (currentRef) {
      // Check if already in viewport
      const rect = currentRef.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setTimeout(() => setIsVisible(true), delay)
      } else {
        observer.observe(currentRef)
      }
    }
    return () => {
      if (currentRef) observer.unobserve(currentRef)
      observer.disconnect()
    }
  }, [delay])

  return (
    <div
      ref={domRef}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transform: isVisible ? 'translateY(0)' : `translateY(${translateY}px)`,
      }}
      className={`transition-all ease-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      {children}
    </div>
  )
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const dragStartX = useRef<number | null>(null)

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    dragStartX.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return
    const diffX = dragStartX.current - e.clientX
    if (diffX > 60) nextSlide()
    else if (diffX < -60) prevSlide()
    dragStartX.current = null
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  const bestSellers = MOCK_PRODUCTS.slice(0, 4)
  const newArrivals = MOCK_PRODUCTS.slice(4, 6).concat(MOCK_PRODUCTS.slice(0, 2))

  return (
    <div className="flex flex-col">
      {/* Full-Screen Sticky Swipeable Carousel */}
      <section
        className="sticky top-0 w-full h-screen bg-slate-950 overflow-hidden cursor-grab active:cursor-grabbing select-none z-10"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {SLIDES.map((slide, index) => {
          const isActive = index === currentSlide
          return (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-all duration-[1400ms] ease-in-out ${
                isActive
                  ? 'opacity-100 z-10 pointer-events-auto'
                  : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <div className={`absolute inset-0 transition-transform duration-[7000ms] ease-out ${
                isActive ? 'scale-110' : 'scale-100'
              }`}>
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="100vw"
                />
              </div>

              <div className={`absolute inset-0 bg-gradient-to-t ${slide.overlay} z-10`} />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent z-10" />
{/* Centered Brand Text + CTA */}
<div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
  <div className="max-w-3xl mx-auto space-y-6 text-white flex flex-col items-center">
    <div 
      className={`transition-all duration-[1200ms] ease-out mb-4 ${
        isActive ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-12'
      }`}
      style={{ transitionDelay: isActive ? '100ms' : '0ms' }}
    >
      <div className="h-40 w-40 rounded-full bg-white flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.4)] group-hover:scale-105 transition-transform duration-700 overflow-hidden">
        <Image 
          src="/dragon-logo.svg" 
          alt="Dragon Logo" 
          width={120} 
          height={120}
          className="object-contain"
        />
      </div>

    </div>
    <span
      className={`inline-block text-xs uppercase tracking-[0.25em] font-semibold bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm transition-all duration-700 ease-out ${
        isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: isActive ? '300ms' : '0ms' }}
    >
      {slide.subtitle}
    </span>


                  <h1
                    className={`text-4xl md:text-6xl font-bold tracking-wider drop-shadow-lg transition-all duration-700 ease-out font-heading ${
                      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                    style={{ transitionDelay: isActive ? '500ms' : '0ms' }}
                  >
                    {slide.title}
                  </h1>

                  <p
                    className={`text-sm md:text-lg text-slate-200 max-w-xl mx-auto font-normal leading-relaxed drop-shadow transition-all duration-700 ease-out ${
                      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                    style={{ transitionDelay: isActive ? '700ms' : '0ms' }}
                  >
                    {slide.description}
                  </p>

                  <div
                    className={`pt-2 transition-all duration-700 ease-out ${
                      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                    style={{ transitionDelay: isActive ? '900ms' : '0ms' }}
                  >
                    <Button
                      asChild
                      size="lg"
                      className="bg-white text-slate-950 hover:bg-slate-100 transition-colors shadow-lg font-semibold px-8 gap-2"
                    >
                      <Link href={slide.link}>
                        {slide.buttonText} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Main Store Content */}
      <div 
        className="relative z-20 bg-background shadow-[0_-20px_80px_rgba(0,0,0,0.22)] flex flex-col gap-24 py-24"
        style={{ touchAction: 'pan-y' }}
      >

        {/* Best Sellers Section */}
        <section className="container">
          <RevealSection translateY={24}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Crowd Favorites</span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-wide">Best Sellers</h2>
              </div>
              <Button asChild variant="ghost" className="hidden md:flex gap-2 group">
                <Link href="/products">
                  View All Products <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product, index) => (
              <RevealSection key={product.id} delay={index * 100} translateY={30}>
                <ProductCard product={product} />
              </RevealSection>
            ))}
          </div>
          
          <div className="mt-10 md:hidden text-center">
            <Button asChild variant="outline" className="w-full">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </section>

        {/* Shop by Category */}
        <section className="container">
          <RevealSection translateY={24}>
            <div className="flex flex-col items-center text-center gap-4 mb-12">
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Curated Collections</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-wide">Shop by Category</h2>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Watches', slug: 'watches', icon: Watch, count: '42 Products', gradient: 'from-blue-600 to-indigo-900', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000' },
              { name: 'Bags', slug: 'bags', icon: Briefcase, count: '18 Products', gradient: 'from-purple-600 to-indigo-950', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000' },
              { name: 'Perfumes', slug: 'perfumes', icon: Sparkles, count: '12 Products', gradient: 'from-pink-600 to-purple-950', img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000' },
            ].map((category, index) => {
              const Icon = category.icon
              return (
                <RevealSection key={category.slug} delay={index * 150} duration={800}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="group relative h-[380px] block overflow-hidden rounded-2xl bg-muted shadow-sm transition-all hover:shadow-2xl"
                  >
                    <Image 
                      src={category.img} 
                      alt={category.name} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Hover Overlay - Matching Product Card Pattern */}
                    <div className="absolute inset-0 z-30 flex flex-col justify-end p-8 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 group-active:opacity-100 group-focus-within:opacity-100 transition-all duration-500 pointer-events-none group-hover:pointer-events-auto group-active:pointer-events-auto group-focus-within:pointer-events-auto">
                      <div className="transform translate-y-8 group-hover:translate-y-0 group-active:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-500 ease-out space-y-4">
                        
                        <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 group-active:scale-110 group-focus-within:scale-110 transition-transform duration-500">
                          <Icon className="h-6 w-6 text-white" />
                        </div>

                        <div className="text-white">
                          <div className="flex justify-between items-end gap-2 mb-1">
                            <h3 className="text-2xl font-bold tracking-wide uppercase font-heading">
                              {category.name}
                            </h3>
                            <span className="text-[10px] font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-md uppercase tracking-widest">
                              {category.count}
                            </span>
                          </div>
                          <p className="text-sm text-white/70 tracking-wide">
                            Explore the finest {category.name.toLowerCase()} collection.
                          </p>
                        </div>

                        <Button variant="secondary" className="w-full rounded-full font-bold uppercase tracking-widest text-xs h-10 group/btn">
                          View Collection <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                </RevealSection>
              )
            })}
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="bg-slate-950 py-24 text-white">
          <div className="container">
            <RevealSection translateY={24}>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-blue-400">Fresh Drops</span>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-wide">New Arrivals</h2>
                </div>
                <Button asChild variant="link" className="text-blue-400 hover:text-blue-300 p-0 h-auto gap-2 group">
                  <Link href="/products">
                    See what's new <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </RevealSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {newArrivals.map((product, index) => (
                <RevealSection key={product.id + '-new'} delay={index * 100} translateY={30}>
                  <ProductCard product={product} />
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* Infinite Scroll Testimonials */}
        <section className="py-12 overflow-hidden bg-muted/30">
          <div className="container mb-12 text-center">
            <RevealSection>
              <h2 className="text-3xl font-bold tracking-wide mb-4 uppercase font-heading">The Dragon Experience</h2>
              <p className="text-muted-foreground">Hear from our community of global collectors</p>
            </RevealSection>
          </div>
          
          <div className="flex w-max animate-scroll">
            {/* First set */}
            <div className="flex gap-8 px-4">
              {TESTIMONIALS.map((t, i) => (
                <div 
                  key={`t1-${i}`} 
                  className="w-[350px] flex-shrink-0 p-8 rounded-2xl bg-card border shadow-sm flex flex-col gap-4"
                >
                  <div className="flex gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-4 h-8 w-8 text-primary/10 -z-0" />
                    <p className="text-sm italic leading-relaxed text-foreground relative z-10">"{t.content}"</p>
                  </div>
                  <div className="mt-2">
                    <p className="font-bold text-sm tracking-wide uppercase">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Second identical set for seamless looping */}
            <div className="flex gap-8 px-4">
              {TESTIMONIALS.map((t, i) => (
                <div 
                  key={`t2-${i}`} 
                  className="w-[350px] flex-shrink-0 p-8 rounded-2xl bg-card border shadow-sm flex flex-col gap-4"
                >
                  <div className="flex gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-4 h-8 w-8 text-primary/10 -z-0" />
                    <p className="text-sm italic leading-relaxed text-foreground relative z-10">"{t.content}"</p>
                  </div>
                  <div className="mt-2">
                    <p className="font-bold text-sm tracking-wide uppercase">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 bg-card border rounded-3xl p-12 shadow-sm">
            {[
              { icon: Truck, title: 'Global Express', description: 'Insured worldwide shipping with real-time tracking on all orders.' },
              { icon: ShieldCheck, title: 'Certified Authenticity', description: 'Every item comes with a certificate of authenticity and a 2-year warranty.' },
              { icon: ShoppingBag, title: 'Concierge Returns', description: 'Personalized assistance for returns and exchanges within 14 days.' },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <RevealSection key={index} delay={index * 150} duration={800} translateY={30}>
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-bold uppercase tracking-wider text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </RevealSection>
              )
            })}
          </div>
        </section>

      </div>
    </div>
  )
}

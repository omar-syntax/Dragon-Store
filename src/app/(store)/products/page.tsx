'use client'

import { useState, useEffect, useMemo } from 'react'
import ProductCard from '@/components/products/ProductCard'
import { getProducts } from '@/lib/store-engine'
import type { Product } from '@/types'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low → High', value: 'price-asc' },
  { label: 'Price: High → Low', value: 'price-desc' },
  { label: 'Name A-Z', value: 'name-asc' },
]

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const [params, setParams] = useState<{ category?: string; q?: string }>({})
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('')

  useEffect(() => {
    searchParams.then((p) => {
      setParams(p)
      setActiveCategory(p.category ?? '')
      if (p.q) setSearch(p.q)
    })
    setProducts(getProducts())
  }, [searchParams])

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)))
    return cats
  }, [products])

  const filtered = useMemo(() => {
    let list = [...products]
    if (activeCategory) list = list.filter((p) => p.category === activeCategory)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }
    switch (sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break
      case 'price-desc': list.sort((a, b) => b.price - a.price); break
      case 'name-asc': list.sort((a, b) => a.name.localeCompare(b.name)); break
      default: list.sort((a, b) => b.created_at.localeCompare(a.created_at))
    }
    return list
  }, [products, activeCategory, search, sort])

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight capitalize">
            {activeCategory ? activeCategory : 'All Products'}
          </h1>
          <p className="text-muted-foreground">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-lg border border-input bg-background text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Category chips */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveCategory('')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${!activeCategory ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary hover:text-primary'}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? '' : cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors capitalize ${activeCategory === cat ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary hover:text-primary'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium">No products found.</p>
            <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
            <Button variant="outline" className="mt-4" onClick={() => { setSearch(''); setActiveCategory('') }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

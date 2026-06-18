'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search as SearchIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'

interface SearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function GlobalSearch({ open, onOpenChange }: SearchProps) {
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<Product[]>([])

  React.useEffect(() => {
    if (query.length > 1) {
      const filtered = MOCK_PRODUCTS.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
    } else {
      setResults([])
    }
  }, [query])

  // Reset query when closed
  React.useEffect(() => {
    if (!open) {
      setTimeout(() => setQuery(''), 300)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden glass-search border-none">
        <DialogHeader className="p-5 border-b border-white/5">
          <div className="flex items-center gap-4 px-2">
            <SearchIcon className="h-6 w-6 text-white/40" />
            <input
              autoFocus
              placeholder="Search Dragon..."
              className="flex-1 bg-transparent border-none outline-none text-xl font-medium text-white placeholder:text-white/20 tracking-wide"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </DialogHeader>
        
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
          {query.length > 0 ? (
            results.length > 0 ? (
              <div className="p-2">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 px-4 py-3">
                  Products Found ({results.length})
                </p>
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    onClick={() => onOpenChange(false)}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-white/5">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wide truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-white/50 uppercase tracking-widest mt-0.5">
                        {product.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-white/40 text-sm">No products found for "{query}"</p>
              </div>
            )
          ) : (
            <div className="p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-4">
                Quick Categories
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['Watches', 'Bags', 'Perfumes', 'Bracelets'].map((cat) => (
                  <Link
                    key={cat}
                    href={`/products?category=${cat.toLowerCase()}`}
                    onClick={() => onOpenChange(false)}
                    className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-primary/20 hover:border-primary/50 transition-all text-sm font-bold text-white/80 uppercase tracking-widest text-center"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

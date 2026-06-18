'use client'

import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CartItem as CartItemType } from '@/types'
import { formatPrice } from '@/lib/utils'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
        {item.product.images[0] ? (
          <Image
            src={item.product.images[0]}
            alt={item.product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 flex flex-col items-center justify-center">
            <svg className="h-8 w-8 opacity-30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M38 30L44 40L50 25L56 40L62 30L58 45H42L38 30Z" fill="currentColor" className="text-slate-600 dark:text-slate-400" />
              <rect x="44" y="47" width="12" height="3" rx="1" fill="currentColor" className="text-slate-600 dark:text-slate-400" />
              <circle cx="50" cy="65" r="18" stroke="currentColor" strokeWidth="4" className="text-slate-600 dark:text-slate-400" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col self-start">
        <h3 className="line-clamp-1 text-sm font-medium">{item.product.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground uppercase">{item.product.category}</p>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center rounded-md border">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none border-r">
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-xs">{item.quantity}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none border-l">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="text-right">
        <p className="text-sm font-bold">{formatPrice(item.product.price * item.quantity)}</p>
        <p className="text-xs text-muted-foreground">{formatPrice(item.product.price)} each</p>
      </div>
    </div>
  )
}

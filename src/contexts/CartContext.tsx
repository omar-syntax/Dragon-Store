'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { CartItem, Product } from '@/types'
import { getCart, setCart, clearCart, getDiscountedPrice } from '@/lib/store-engine'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertCircle, Trash2 } from 'lucide-react'

interface CartContextValue {
  items: CartItem[]
  count: number
  subtotal: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, quantity: number) => void
  clearAllItems: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

interface DialogConfig {
  isOpen: boolean
  title: string
  description: string
  type: 'alert' | 'confirm'
  onConfirm?: () => void
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [dialogConfig, setDialogConfig] = useState<DialogConfig | null>(null)

  useEffect(() => {
    setItems(getCart())
  }, [])

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      const currentQty = existing ? existing.quantity : 0
      
      if (currentQty + quantity > product.stock) {
        setDialogConfig({
          isOpen: true,
          title: 'Stock Limit Reached',
          description: `Sorry, you cannot add more of this item. Only ${product.stock} left in stock.`,
          type: 'alert'
        })
        quantity = product.stock - currentQty
        if (quantity <= 0) return prev
      }

      let updated: CartItem[]
      if (existing) {
        updated = prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        )
      } else {
        updated = [...prev, { product, quantity }]
      }
      setCart(updated)
      return updated
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setDialogConfig({
      isOpen: true,
      title: 'Remove Item',
      description: 'Are you sure you want to remove this item from your cart?',
      type: 'confirm',
      onConfirm: () => {
        setItems((prev) => {
          const updated = prev.filter((i) => i.product.id !== productId)
          setCart(updated)
          return updated
        })
        setDialogConfig(null)
      }
    })
  }, [])

  const updateQty = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        setDialogConfig({
          isOpen: true,
          title: 'Remove Item',
          description: 'Are you sure you want to remove this item from your cart?',
          type: 'confirm',
          onConfirm: () => {
            setItems((currentPrev) => {
              const updated = currentPrev.filter((i) => i.product.id !== productId)
              setCart(updated)
              return updated
            })
            setDialogConfig(null)
          }
        })
        return prev
      }

      const item = prev.find((i) => i.product.id === productId)
      if (item && quantity > item.product.stock) {
        setDialogConfig({
          isOpen: true,
          title: 'Stock Limit Reached',
          description: `Sorry, you cannot add more of this item. Only ${item.product.stock} left in stock.`,
          type: 'alert'
        })
        quantity = item.product.stock
      }

      const updated = prev.map((i) =>
        i.product.id === productId
          ? { ...i, quantity }
          : i,
      )
      setCart(updated)
      return updated
    })
  }, [])

  const clearAllItems = useCallback(() => {
    clearCart()
    setItems([])
  }, [])

  const count = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => {
    const price = getDiscountedPrice(i.product)
    return sum + price * i.quantity
  }, 0)

  return (
    <CartContext.Provider
      value={{ items, count, subtotal, addItem, removeItem, updateQty, clearAllItems }}
    >
      {children}
      
      <Dialog open={dialogConfig?.isOpen || false} onOpenChange={(isOpen) => !isOpen && setDialogConfig(null)}>
        <DialogContent className="bg-slate-950 border-white/10 text-white sm:max-w-[425px] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-heading tracking-wide">
              {dialogConfig?.type === 'alert' ? <AlertCircle className="text-amber-500 h-5 w-5" /> : <Trash2 className="text-red-500 h-5 w-5" />}
              {dialogConfig?.title}
            </DialogTitle>
            <DialogDescription className="text-slate-400 pt-2 text-base">
              {dialogConfig?.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2 mt-6">
            {dialogConfig?.type === 'confirm' && (
              <Button variant="ghost" className="hover:bg-white/10 text-slate-300 rounded-xl" onClick={() => setDialogConfig(null)}>
                Cancel
              </Button>
            )}
            <Button 
              variant={dialogConfig?.type === 'confirm' ? 'destructive' : 'default'} 
              className={`rounded-xl ${dialogConfig?.type === 'alert' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : ''}`}
              onClick={() => {
                if (dialogConfig?.onConfirm) dialogConfig.onConfirm()
                else setDialogConfig(null)
              }}
            >
              {dialogConfig?.type === 'confirm' ? 'Remove Item' : 'Okay, got it'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

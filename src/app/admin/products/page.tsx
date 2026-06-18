'use client'

import { useState, useEffect } from 'react'
import { getCMSState, updateCMSState, Product } from '@/lib/cms-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const state = getCMSState()
    setProducts(state.products)
  }, [])

  const handleUpdate = (id: string, field: keyof Product, value: string | number) => {
    const newState = getCMSState()
    newState.products = newState.products.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    )
    updateCMSState(newState)
    setProducts(newState.products)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Product Manager</h1>
      <div className="space-y-4">
        {products.map((p) => (
          <div key={p.id} className="grid grid-cols-4 gap-4 p-4 border rounded">
            <Input value={p.name} onChange={(e) => handleUpdate(p.id, 'name', e.target.value)} placeholder="Name" />
            <Input type="number" value={p.price} onChange={(e) => handleUpdate(p.id, 'price', Number(e.target.value))} placeholder="Price" />
            <Input type="number" value={p.stock} onChange={(e) => handleUpdate(p.id, 'stock', Number(e.target.value))} placeholder="Stock" />
            <Button variant="destructive">Delete</Button>
          </div>
        ))}
      </div>
    </div>
  )
}

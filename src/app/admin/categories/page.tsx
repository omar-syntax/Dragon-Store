'use client'

import { useState, useEffect } from 'react'
import { getCMSState, updateCMSState, CMSState } from '@/lib/cms-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CategoriesManager() {
  const [state, setState] = useState<CMSState | null>(null)

  useEffect(() => {
    setState(getCMSState())
  }, [])

  if (!state) return null

  const addType = () => {
    const newType = { id: Date.now().toString(), name: 'New Type' }
    const newState = { ...state, product_types: [...state.product_types, newType] }
    updateCMSState(newState)
    setState(newState)
  }

  const addCategory = () => {
    const newCat = { id: Date.now().toString(), type_id: state.product_types[0]?.id || '', name: 'New Category' }
    const newState = { ...state, categories: [...state.categories, newCat] }
    updateCMSState(newState)
    setState(newState)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Types & Categories Manager</h1>
      
      <h2 className="text-xl font-bold mb-4">Product Types</h2>
      <Button onClick={addType} className="mb-4">Add Type</Button>
      <div className="space-y-4 mb-8">
        {state.product_types.map((type) => (
            <div key={type.id} className="flex gap-4">
                <Input value={type.name} onChange={(e) => {/* Add update logic */}} />
            </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <Button onClick={addCategory} className="mb-4">Add Category</Button>
      <div className="space-y-4">
        {state.categories.map((cat) => (
          <div key={cat.id} className="grid grid-cols-3 gap-4 p-4 border rounded">
            <Input value={cat.name} onChange={(e) => {/* Add update logic */}} />
            <Select value={cat.type_id} onValueChange={(val) => {/* Add update logic */}}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    {state.product_types.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
            </Select>
            <Button variant="destructive">Delete</Button>
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { getCMSState, updateCMSState, CMSState } from '@/lib/cms-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function OffersManager() {
  const [state, setState] = useState<CMSState | null>(null)

  useEffect(() => {
    setState(getCMSState())
  }, [])

  if (!state) return null

  const addOffer = () => {
    const newOffer = {
      id: Date.now().toString(),
      product_id: state.products[0]?.id || '',
      discount: 0,
      start_date: '',
      end_date: ''
    }
    const newState = { ...state, offers: [...state.offers, newOffer] }
    updateCMSState(newState)
    setState(newState)
  }

  const updateOffer = (id: string, field: string, value: any) => {
    const newState = {
      ...state,
      offers: state.offers.map(o => o.id === id ? { ...o, [field]: value } : o)
    }
    updateCMSState(newState)
    setState(newState)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Offers Manager</h1>
      <Button onClick={addOffer} className="mb-4">Add New Offer</Button>
      <div className="space-y-4">
        {state.offers.map((offer) => (
          <div key={offer.id} className="grid grid-cols-5 gap-4 p-4 border rounded">
            <Select value={offer.product_id} onValueChange={(val) => updateOffer(offer.id, 'product_id', val)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    {state.products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
            </Select>
            <Input type="number" value={offer.discount} onChange={(e) => updateOffer(offer.id, 'discount', Number(e.target.value))} placeholder="Discount %" />
            <Input type="date" value={offer.start_date} onChange={(e) => updateOffer(offer.id, 'start_date', e.target.value)} />
            <Input type="date" value={offer.end_date} onChange={(e) => updateOffer(offer.id, 'end_date', e.target.value)} />
            <Button variant="destructive">Delete</Button>
          </div>
        ))}
      </div>
    </div>
  )
}

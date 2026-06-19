'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Calendar, Sparkles, X, CheckSquare, Square } from 'lucide-react'
import { getOffers, saveOffer, deleteOffer, getProducts } from '@/lib/store-engine'
import { Button } from '@/components/ui/button'
import { generateId, formatDate } from '@/lib/utils'
import type { Offer, Product } from '@/types'

export default function OffersManager() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)

  // Form states
  const [label, setLabel] = useState('')
  const [discountPercent, setDiscountPercent] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])
  const [error, setError] = useState('')

  const loadData = () => {
    setOffers(getOffers().sort((a, b) => b.created_at.localeCompare(a.created_at)))
    setProducts(getProducts())
  }

  useEffect(() => {
    loadData()
  }, [])

  const openAddForm = () => {
    setEditingOffer(null)
    setLabel('')
    setDiscountPercent('')
    // Default dates: today and next week
    const now = new Date()
    const nextWeek = new Date()
    nextWeek.setDate(now.getDate() + 7)
    setStartDate(now.toISOString().slice(0, 10))
    setEndDate(nextWeek.toISOString().slice(0, 10))
    setSelectedProductIds([])
    setError('')
    setIsFormOpen(true)
  }

  const openEditForm = (o: Offer) => {
    setEditingOffer(o)
    setLabel(o.label)
    setDiscountPercent(o.discount_percent.toString())
    setStartDate(o.start_date.slice(0, 10))
    setEndDate(o.end_date.slice(0, 10))
    setSelectedProductIds(o.product_ids || [])
    setError('')
    setIsFormOpen(true)
  }

  const handleProductToggle = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    )
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const parsedDiscount = parseFloat(discountPercent)

    if (!label.trim() || isNaN(parsedDiscount) || parsedDiscount <= 0 || parsedDiscount > 100 || !startDate || !endDate) {
      setError('Please fill in all required fields. Discount must be between 1% and 100%.')
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after end date.')
      return
    }

    if (selectedProductIds.length === 0) {
      setError('Please select at least one product for this offer.')
      return
    }

    const newOffer: Offer = {
      id: editingOffer ? editingOffer.id : 'offer-' + generateId(),
      label: label.trim(),
      discount_percent: parsedDiscount,
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
      product_ids: selectedProductIds,
      created_at: editingOffer ? editingOffer.created_at : new Date().toISOString(),
    }

    try {
      saveOffer(newOffer)
      loadData()
      setIsFormOpen(false)
    } catch (err: any) {
      setError(err?.message || 'Failed to save offer.')
    }
  }

  const handleDelete = (id: string, label: string) => {
    if (window.confirm(`Are you sure you want to delete the offer "${label}"?`)) {
      deleteOffer(id)
      loadData()
    }
  }

  const isOfferActive = (offer: Offer) => {
    const now = new Date().toISOString()
    return offer.start_date <= now && offer.end_date >= now
  }

  return (
    <div className="space-y-8 text-slate-100">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-heading">Offers & Campaigns</h1>
          <p className="text-slate-400 text-sm mt-1">Create and manage discounts across store products.</p>
        </div>
        <Button onClick={openAddForm} className="gap-2 bg-primary text-white hover:bg-primary/95">
          <Plus className="h-4 w-4" /> Add Offer
        </Button>
      </div>

      {/* Offers Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {offers.length > 0 ? (
          offers.map((offer) => {
            const active = isOfferActive(offer)
            return (
              <div key={offer.id} className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 shadow-md flex flex-col justify-between hover:border-slate-700 transition-all group">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${
                      active 
                        ? 'bg-green-500/10 border-green-500/25 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.1)]' 
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}>
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="flex gap-1">
                      <Button onClick={() => openEditForm(offer)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-850">
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button onClick={() => handleDelete(offer.id, offer.label)} variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-bold text-lg text-white font-heading">{offer.label}</h3>
                      <span className="text-xs font-bold text-primary">-{offer.discount_percent}% OFF</span>
                    </div>
                    
                    {/* Products details */}
                    <div className="mt-3">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Applicable Products</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {offer.product_ids.map((pId) => {
                          const p = products.find((prod) => prod.id === pId)
                          return (
                            <span key={pId} className="text-xs bg-slate-800/80 border border-slate-700 px-2 py-0.5 rounded text-slate-300">
                              {p ? p.name : 'Unknown Product'}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-800/60 mt-6 pt-4 flex justify-between items-center text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    {formatDate(offer.start_date)} — {formatDate(offer.end_date)}
                  </span>
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                    active 
                      ? 'bg-green-500/10 border-green-500/30 text-green-500' 
                      : 'bg-slate-850 border-slate-800 text-slate-500'
                  }`}>
                    {active ? 'Active' : 'Expired'}
                  </span>
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            No active discount campaigns. Click &quot;Add Offer&quot; to launch one.
          </div>
        )}
      </div>

      {/* Slide-over Form Drawer */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[200] overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-lg bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col justify-between shadow-2xl">
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/90 backdrop-blur-md sticky top-0 z-10">
                <h2 className="text-lg font-bold text-white font-heading">
                  {editingOffer ? 'Edit Discount Campaign' : 'Create Discount Campaign'}
                </h2>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-850" onClick={() => setIsFormOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Form Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {error && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSave} className="space-y-4">
                  {/* Campaign Label */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Campaign Label *</label>
                    <input
                      required
                      type="text"
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      placeholder="e.g. Eid Chronograph Promo, Holiday Sale"
                      className="flex h-10 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-slate-100"
                    />
                  </div>

                  {/* Discount percent */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Discount Percent (%) *</label>
                    <input
                      required
                      type="number"
                      min="1"
                      max="100"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(e.target.value)}
                      placeholder="e.g. 20"
                      className="flex h-10 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-slate-100"
                    />
                  </div>

                  {/* Schedule dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Start Date *</label>
                      <input
                        required
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-slate-800 bg-slate-955 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-slate-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">End Date *</label>
                      <input
                        required
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-slate-800 bg-slate-955 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-slate-200"
                      />
                    </div>
                  </div>

                  {/* Products checklist */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Select Products *</label>
                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 max-h-[200px] overflow-y-auto space-y-2">
                      {products.map((p) => {
                        const checked = selectedProductIds.includes(p.id)
                        return (
                          <div 
                            key={p.id} 
                            onClick={() => handleProductToggle(p.id)}
                            className="flex items-center gap-2.5 py-1.5 px-2.5 rounded-md hover:bg-slate-900 cursor-pointer select-none transition-colors"
                          >
                            {checked ? (
                              <CheckSquare className="h-4.5 w-4.5 text-primary" />
                            ) : (
                              <Square className="h-4.5 w-4.5 text-slate-600" />
                            )}
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-semibold text-white block truncate">{p.name}</span>
                              <span className="text-[10px] text-slate-500 capitalize">{p.category}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer Buttons */}
              <div className="px-6 py-4 border-t border-slate-800 flex gap-3 bg-slate-900/90 backdrop-blur-md sticky bottom-0">
                <Button onClick={handleSave} className="flex-1 bg-primary text-white hover:bg-primary/95 font-bold uppercase tracking-wider h-11">
                  {editingOffer ? 'Save Changes' : 'Create Campaign'}
                </Button>
                <Button variant="outline" className="border-slate-800 bg-transparent text-slate-400 hover:text-white hover:bg-slate-850 h-11" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

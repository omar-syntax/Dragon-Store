'use client'

import { useState, useEffect } from 'react'
import { getCMSState, updateCMSState, CarouselItem } from '@/lib/cms-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function CarouselManager() {
  const [carousel, setCarousel] = useState<CarouselItem[]>([])

  useEffect(() => {
    const state = getCMSState()
    setCarousel(state.carousel)
  }, [])

  const handleUpdate = (id: string, field: keyof CarouselItem, value: string | number) => {
    const newState = getCMSState()
    newState.carousel = newState.carousel.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    )
    updateCMSState(newState)
    setCarousel(newState.carousel)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Carousel Manager</h1>
      <div className="space-y-4">
        {carousel.map((item) => (
          <div key={item.id} className="grid grid-cols-5 gap-4 p-4 border rounded">
            <Input value={item.title} onChange={(e) => handleUpdate(item.id, 'title', e.target.value)} placeholder="Title" />
            <Input value={item.image_url} onChange={(e) => handleUpdate(item.id, 'image_url', e.target.value)} placeholder="Image URL" />
            <Input value={item.button_text} onChange={(e) => handleUpdate(item.id, 'button_text', e.target.value)} placeholder="Button Text" />
            <Input value={item.redirect_url} onChange={(e) => handleUpdate(item.id, 'redirect_url', e.target.value)} placeholder="Redirect URL" />
            <Button variant="destructive" onClick={() => {/* Delete logic */}}>Delete</Button>
          </div>
        ))}
        <Button onClick={() => {
            const newItem: CarouselItem = { id: Date.now().toString(), image_url: '', title: '', button_text: '', redirect_url: '', order: carousel.length };
            const newState = getCMSState();
            newState.carousel.push(newItem);
            updateCMSState(newState);
            setCarousel(newState.carousel);
        }}>Add New Slide</Button>
      </div>
    </div>
  )
}

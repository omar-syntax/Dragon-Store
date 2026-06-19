'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Tag as TagIcon, Eye, Upload, X } from 'lucide-react'
import { getProducts, saveProduct, deleteProduct, getCategories } from '@/lib/store-engine'
import { Button } from '@/components/ui/button'
import { formatPrice, generateId, generateSlug } from '@/lib/utils'
import type { Product, Category } from '@/types'

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [compareAtPrice, setCompareAtPrice] = useState('')
  const [stock, setStock] = useState('')
  const [category, setCategory] = useState('')
  const [imageInput, setImageInput] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [tagsInput, setTagsInput] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  
  const [error, setError] = useState('')

  useEffect(() => {
    setProducts(getProducts())
    setCategories(getCategories())
  }, [])

  const openAddForm = () => {
    setEditingProduct(null)
    setName('')
    setDescription('')
    setPrice('')
    setCompareAtPrice('')
    setStock('')
    setCategory(categories[0]?.id || '')
    setImageInput('')
    setImages([])
    setTagsInput('')
    setIsFeatured(false)
    setError('')
    setIsFormOpen(true)
  }

  const openEditForm = (p: Product) => {
    setEditingProduct(p)
    setName(p.name)
    setDescription(p.description)
    setPrice(p.price.toString())
    setCompareAtPrice(p.compare_at_price?.toString() || '')
    setStock(p.stock.toString())
    setCategory(p.category)
    setImageInput('')
    setImages(p.images || [])
    setTagsInput(p.tags?.join(', ') || '')
    setIsFeatured(p.is_featured || false)
    setError('')
    setIsFormOpen(true)
  }

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setImages((prev) => [...prev, imageInput.trim()])
      setImageInput('')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImages((prev) => [...prev, reader.result as string])
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const parsedPrice = parseFloat(price)
    const parsedStock = parseInt(stock)
    const parsedComparePrice = compareAtPrice ? parseFloat(compareAtPrice) : undefined

    if (!name.trim() || !description.trim() || isNaN(parsedPrice) || isNaN(parsedStock) || !category) {
      setError('Please fill in all required fields.')
      return
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : 'prod-' + generateId(),
      name: name.trim(),
      slug: generateSlug(name.trim()),
      description: description.trim(),
      price: parsedPrice,
      compare_at_price: parsedComparePrice,
      images: images,
      category: category,
      stock: parsedStock,
      is_featured: isFeatured,
      tags: tags,
      created_at: editingProduct ? editingProduct.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    try {
      saveProduct(newProduct)
      setProducts(getProducts())
      setIsFormOpen(false)
    } catch (err: any) {
      setError(err?.message || 'Failed to save product.')
    }
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id)
      setProducts(getProducts())
    }
  }

  return (
    <div className="space-y-8 text-slate-100">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-heading">Products</h1>
          <p className="text-slate-400 text-sm mt-1">Add, update, or remove inventory in your store.</p>
        </div>
        <Button onClick={openAddForm} className="gap-2 bg-primary text-white hover:bg-primary/95">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Datatable */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Featured</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-lg border border-slate-800 bg-slate-900 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="object-cover h-full w-full" />
                      ) : (
                        <div className="text-[10px] text-slate-600 font-bold uppercase">No Img</div>
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-white block">{product.name}</span>
                      <span className="text-xs text-slate-500 font-mono">{product.id}</span>
                    </div>
                  </td>
                  <td className="p-4 capitalize text-slate-300">{product.category}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{formatPrice(product.price)}</span>
                      {product.compare_at_price && (
                        <span className="text-xs text-slate-500 line-through">{formatPrice(product.compare_at_price)}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`font-semibold ${
                      product.stock <= 0 ? 'text-red-400' : product.stock <= 5 ? 'text-amber-400' : 'text-slate-300'
                    }`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="p-4">
                    {product.is_featured ? (
                      <span className="text-xs font-bold text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">Yes</span>
                    ) : (
                      <span className="text-xs text-slate-500">No</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button onClick={() => openEditForm(product)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleDelete(product.id)} variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-500">
                  No products in store inventory. Click &quot;Add Product&quot; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-over Form Drawer */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[200] overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-xl bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col justify-between shadow-2xl">
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/90 backdrop-blur-md sticky top-0 z-10">
                <h2 className="text-lg font-bold text-white font-heading">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800" onClick={() => setIsFormOpen(false)}>
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
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Product Name *</label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dragon GMT Watch"
                      className="flex h-10 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Description *</label>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Product details, dimensions, materials, or features..."
                      rows={4}
                      className="flex w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>

                  {/* Category, Stock, Featured */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Category *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-slate-200"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id} className="bg-slate-900">
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Stock Quantity *</label>
                      <input
                        required
                        type="number"
                        min="0"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="e.g. 15"
                        className="flex h-10 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Price, Compare At Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Price ($) *</label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 299.99"
                        className="flex h-10 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Compare At Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={compareAtPrice}
                        onChange={(e) => setCompareAtPrice(e.target.value)}
                        placeholder="e.g. 350.00"
                        className="flex h-10 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Images Upload / URLs */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Product Images</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={imageInput}
                        onChange={(e) => setImageInput(e.target.value)}
                        placeholder="Paste image URL..."
                        className="flex-1 flex h-10 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      />
                      <Button type="button" onClick={handleAddImage} variant="secondary">Add URL</Button>
                      <div className="relative">
                        <label className="flex items-center gap-1.5 px-4 h-10 border border-slate-800 bg-slate-900 rounded-lg text-sm font-semibold cursor-pointer hover:bg-slate-800 text-slate-200">
                          <Upload className="h-4 w-4" /> Upload
                          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                        </label>
                      </div>
                    </div>

                    {/* Images Preview list */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-4 gap-3 pt-2">
                        {images.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-lg border border-slate-800 bg-slate-950 overflow-hidden group">
                            <img src={img} alt={`Preview ${idx}`} className="object-cover h-full w-full" />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-1 right-1 h-5 w-5 bg-red-500/90 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="e.g. leather, silver, premium, waterproof"
                      className="flex h-10 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>

                  {/* Featured Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/40">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-white">Featured Product</span>
                      <span className="text-xs text-slate-500">Show this product on the home page under Best Sellers.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:after:bg-white peer-checked:after:border-white"></div>
                    </label>
                  </div>
                </form>
              </div>

              {/* Footer Buttons */}
              <div className="px-6 py-4 border-t border-slate-800 flex gap-3 bg-slate-900/90 backdrop-blur-md sticky bottom-0">
                <Button onClick={handleSave} className="flex-1 bg-primary text-white hover:bg-primary/95 font-bold uppercase tracking-wider h-11">
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </Button>
                <Button variant="outline" className="border-slate-800 bg-transparent text-slate-400 hover:text-white hover:bg-slate-800 h-11" onClick={() => setIsFormOpen(false)}>
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

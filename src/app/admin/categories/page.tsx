'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Tag as TagIcon, X } from 'lucide-react'
import { getCategories, saveCategory, deleteCategory, getProducts } from '@/lib/store-engine'
import { Button } from '@/components/ui/button'
import { generateId, generateSlug, formatDate } from '@/lib/utils'
import type { Category } from '@/types'

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [productCounts, setProductCounts] = useState<Record<string, number>>({})

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  
  // Form states
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const loadData = () => {
    const cats = getCategories()
    const products = getProducts()
    
    // Count products per category
    const counts: Record<string, number> = {}
    cats.forEach((c) => {
      counts[c.id] = products.filter((p) => p.category === c.id).length
    })

    setCategories(cats)
    setProductCounts(counts)
  }

  useEffect(() => {
    loadData()
  }, [])

  const openAddForm = () => {
    setEditingCategory(null)
    setName('')
    setError('')
    setIsFormOpen(true)
  }

  const openEditForm = (c: Category) => {
    setEditingCategory(c)
    setName(c.name)
    setError('')
    setIsFormOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Category name is required.')
      return
    }

    const categoryId = editingCategory ? editingCategory.id : generateSlug(name.trim())

    // Prevent duplicate category IDs
    if (!editingCategory && categories.some((c) => c.id === categoryId)) {
      setError('A category with this name already exists.')
      return
    }

    const newCategory: Category = {
      id: categoryId,
      name: name.trim(),
      slug: generateSlug(name.trim()),
      created_at: editingCategory ? editingCategory.created_at : new Date().toISOString(),
    }

    try {
      saveCategory(newCategory)
      loadData()
      setIsFormOpen(false)
    } catch (err: any) {
      setError(err?.message || 'Failed to save category.')
    }
  }

  const handleDelete = (id: string, name: string) => {
    const count = productCounts[id] || 0
    if (count > 0) {
      alert(`Cannot delete category "${name}" because it contains ${count} active product(s). Please reassign or delete the products first.`)
      return
    }

    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      deleteCategory(id)
      loadData()
    }
  }

  return (
    <div className="space-y-8 text-slate-100">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-heading">Categories</h1>
          <p className="text-slate-400 text-sm mt-1">Organize your store products by collections and categories.</p>
        </div>
        <Button onClick={openAddForm} className="gap-2 bg-primary text-white hover:bg-primary/95">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      {/* Categories Grid List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.length > 0 ? (
          categories.map((category) => {
            const count = productCounts[category.id] || 0
            return (
              <div key={category.id} className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 shadow-md flex flex-col justify-between hover:border-slate-700 transition-all group">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="h-10 w-10 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                      <TagIcon className="h-5 w-5" />
                    </div>
                    <div className="flex gap-1">
                      <Button onClick={() => openEditForm(category)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-850">
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button onClick={() => handleDelete(category.id, category.name)} variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-white font-heading">{category.name}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">slug: {category.slug}</p>
                  </div>
                </div>

                <div className="border-t border-slate-800/60 mt-6 pt-4 flex justify-between items-center text-xs text-slate-500">
                  <span>Created: {formatDate(category.created_at)}</span>
                  <span className="font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                    {count} {count === 1 ? 'Product' : 'Products'}
                  </span>
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            No categories defined. Click &quot;Add Category&quot; to build one.
          </div>
        )}
      </div>

      {/* Slide-over Form Drawer */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[200] overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col justify-between shadow-2xl">
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/90 backdrop-blur-md sticky top-0 z-10">
                <h2 className="text-lg font-bold text-white font-heading">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
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
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-heading">Category Name *</label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Leather Goods, Chronographs"
                      className="flex h-10 w-full rounded-lg border border-slate-800 bg-slate-955 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-slate-100"
                    />
                  </div>
                </form>
              </div>

              {/* Footer Buttons */}
              <div className="px-6 py-4 border-t border-slate-800 flex gap-3 bg-slate-900/90 backdrop-blur-md sticky bottom-0">
                <Button onClick={handleSave} className="flex-1 bg-primary text-white hover:bg-primary/95 font-bold uppercase tracking-wider h-11">
                  {editingCategory ? 'Save Changes' : 'Create Category'}
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

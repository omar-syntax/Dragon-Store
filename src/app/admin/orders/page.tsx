'use client'

import { useState, useEffect } from 'react'
import DataTable from '@/components/admin/DataTable'
import { Button } from '@/components/ui/button'
import { Eye, Edit, Trash2, CheckCircle2, X, FileText, ArrowRight, Ban } from 'lucide-react'
import { getOrders, updateOrderStatus } from '@/lib/store-engine'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Order } from '@/types'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const loadOrders = () => {
    const allOrders = getOrders()
    setOrders(allOrders.sort((a, b) => b.created_at.localeCompare(a.created_at)))
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleUpdateStatus = (id: string, status: Order['status']) => {
    updateOrderStatus(id, status)
    loadOrders()
    // Update selected order view in modal if open
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder((prev) => prev ? { ...prev, status, updated_at: new Date().toISOString() } : null)
    }
  }

  const statusColors = {
    pending: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500',
    processing: 'bg-blue-500/10 border-blue-500/20 text-blue-500',
    shipped: 'bg-purple-500/10 border-purple-500/20 text-purple-500',
    delivered: 'bg-green-500/10 border-green-500/30 text-green-500',
    cancelled: 'bg-red-500/10 border-red-500/20 text-red-500',
  }

  const columns = [
    {
      key: 'id',
      label: 'Order ID',
      render: (order: Order) => <span className="font-mono text-xs text-white">{order.id}</span>,
    },
    {
      key: 'user_name',
      label: 'Customer',
      render: (order: Order) => (
        <div>
          <div className="font-bold text-white">{order.user_name}</div>
          <div className="text-xs text-slate-500">{order.user_email}</div>
        </div>
      ),
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (order: Order) => <span className="text-slate-300">{formatDate(order.created_at)}</span>,
    },
    {
      key: 'items',
      label: 'Items',
      render: (order: Order) => {
        const count = order.items.reduce((sum, i) => sum + i.quantity, 0)
        return <span className="text-slate-300">{count} {count === 1 ? 'item' : 'items'}</span>
      },
    },
    {
      key: 'total',
      label: 'Total',
      render: (order: Order) => <span className="font-bold text-primary">{formatPrice(order.total)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (order: Order) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusColors[order.status]}`}>
          {order.status}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (order: Order) => (
        <div className="flex items-center gap-1.5 justify-end">
          {order.status === 'pending' && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-blue-400 border-slate-800 bg-transparent hover:text-white hover:bg-blue-500/20"
              onClick={() => handleUpdateStatus(order.id, 'processing')}
              title="Accept & Process"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          {order.status === 'processing' && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-purple-400 border-slate-800 bg-transparent hover:text-white hover:bg-purple-500/20"
              onClick={() => handleUpdateStatus(order.id, 'shipped')}
              title="Mark as Shipped"
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
          {order.status === 'shipped' && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-green-400 border-slate-800 bg-transparent hover:text-white hover:bg-green-500/20"
              onClick={() => handleUpdateStatus(order.id, 'delivered')}
              title="Mark as Delivered"
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
          {['pending', 'processing'].includes(order.status) && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-red-400 border-slate-800 bg-transparent hover:text-white hover:bg-red-500/20"
              onClick={() => handleUpdateStatus(order.id, 'cancelled')}
              title="Cancel Order"
            >
              <Ban className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={() => setSelectedOrder(order)}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-8 text-slate-100">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white font-heading">Orders</h1>
        <p className="text-slate-400 text-sm mt-1">Manage customer purchases and order fulfillment (Cash on Delivery).</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden shadow-xl p-4">
        <DataTable
          data={orders}
          columns={columns}
          searchKey="user_name"
          searchPlaceholder="Search by customer name..."
        />
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[200] overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-lg bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col justify-between shadow-2xl">
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/90 backdrop-blur-md sticky top-0 z-10">
                <div>
                  <h2 className="text-lg font-bold text-white font-heading">
                    Order Details
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedOrder.id}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-850" onClick={() => setSelectedOrder(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Status card */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950/40">
                  <div className="space-y-0.5">
                    <span className="text-xs text-slate-500 uppercase tracking-wider block">Current Status</span>
                    <span className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full border inline-block ${statusColors[selectedOrder.status]}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  
                  {/* Status update actions */}
                  <div className="flex gap-1.5">
                    {selectedOrder.status === 'pending' && (
                      <Button size="sm" onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}>
                        Accept Order
                      </Button>
                    )}
                    {selectedOrder.status === 'processing' && (
                      <Button size="sm" onClick={() => handleUpdateStatus(selectedOrder.id, 'shipped')}>
                        Ship Order
                      </Button>
                    )}
                    {selectedOrder.status === 'shipped' && (
                      <Button size="sm" onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}>
                        Deliver Order
                      </Button>
                    )}
                    {['pending', 'processing'].includes(selectedOrder.status) && (
                      <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}>
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">Customer Account</h3>
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/20 space-y-1.5 text-sm">
                    <p className="font-bold text-white">{selectedOrder.user_name}</p>
                    <p className="text-xs text-slate-400">{selectedOrder.user_email}</p>
                    <p className="text-xs text-slate-500">Order Placed: {formatDate(selectedOrder.created_at)}</p>
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">Shipping Address (COD)</h3>
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/20 space-y-2 text-sm">
                    <div>
                      <span className="text-slate-500 text-xs block">Contact Name</span>
                      <span className="font-semibold text-white">{selectedOrder.shipping_address.full_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block">Street Address</span>
                      <span className="text-slate-200">{selectedOrder.shipping_address.address_line1}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-slate-500 text-xs block">City</span>
                        <span className="text-slate-200">{selectedOrder.shipping_address.city}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-xs block">State</span>
                        <span className="text-slate-200">{selectedOrder.shipping_address.state}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-xs block">Zip Code</span>
                        <span className="text-slate-200">{selectedOrder.shipping_address.postal_code}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block">Phone Number</span>
                      <span className="font-mono text-white">{selectedOrder.shipping_address.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">Line Items</h3>
                  <div className="divide-y divide-slate-800 p-4 rounded-xl border border-slate-800 bg-slate-950/20">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 py-3.5 first:pt-0 last:pb-0 items-center">
                        <div className="relative h-12 w-12 border border-slate-800 rounded bg-slate-950 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {item.product_image ? (
                            <img src={item.product_image} alt={item.product_name} className="object-cover h-full w-full" />
                          ) : (
                            <div className="text-[8px] text-slate-600 font-bold uppercase">No Img</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-white truncate">{item.product_name}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Qty: {item.quantity} x {formatPrice(item.price)}
                          </p>
                        </div>
                        <span className="font-bold text-white text-sm shrink-0">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Notes */}
                {selectedOrder.notes && (
                  <div className="space-y-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading flex items-center gap-1.5">
                      <FileText className="h-4 w-4" /> Customer Notes
                    </h3>
                    <div className="p-4 rounded-xl border border-amber-500/10 bg-amber-500/5 text-xs text-amber-400 italic leading-relaxed">
                      &ldquo;{selectedOrder.notes}&rdquo;
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Subtotal */}
              <div className="px-6 py-5 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md sticky bottom-0 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Shipping (Flat Rate)</span>
                  <span className="font-semibold text-white">{formatPrice(10)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-heading font-bold text-white">Total Order Value</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

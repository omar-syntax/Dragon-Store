'use client'

import { useState } from 'react'
import DataTable from '@/components/admin/DataTable'
import { Button } from '@/components/ui/button'
import { Eye, Edit, Trash, CheckCircle2 } from 'lucide-react'

interface MockOrder {
  id: string
  customer: string
  email: string
  date: string
  total: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: number
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<MockOrder[]>([
    {
      id: 'ord-8293-hj89',
      customer: 'John Doe',
      email: 'john.doe@example.com',
      date: '2026-06-15',
      total: '$320.00',
      status: 'processing',
      items: 3,
    },
    {
      id: 'ord-1284-pl90',
      customer: 'Jane Smith',
      email: 'jane.smith@example.com',
      date: '2026-06-16',
      total: '$150.00',
      status: 'pending',
      items: 1,
    },
    {
      id: 'ord-5561-ui02',
      customer: 'Michael Brown',
      email: 'michael.brown@example.com',
      date: '2026-06-14',
      total: '$590.00',
      status: 'shipped',
      items: 4,
    },
    {
      id: 'ord-9921-xz34',
      customer: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      date: '2026-06-12',
      total: '$85.00',
      status: 'delivered',
      items: 1,
    },
    {
      id: 'ord-4421-qw88',
      customer: 'David Wilson',
      email: 'david.w@example.com',
      date: '2026-06-10',
      total: '$120.00',
      status: 'cancelled',
      items: 2,
    }
  ])

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  }

  const updateStatus = (id: string, newStatus: MockOrder['status']) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status: newStatus } : order))
    )
  }

  const columns = [
    {
      key: 'id',
      label: 'Order ID',
      render: (order: MockOrder) => <span className="font-mono text-xs">{order.id}</span>,
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (order: MockOrder) => (
        <div>
          <div className="font-medium">{order.customer}</div>
          <div className="text-xs text-muted-foreground">{order.email}</div>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Date',
    },
    {
      key: 'items',
      label: 'ItemsCount',
      render: (order: MockOrder) => <span>{order.items} items</span>,
    },
    {
      key: 'total',
      label: 'Total',
      render: (order: MockOrder) => <span className="font-bold text-primary">{order.total}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (order: MockOrder) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
          {order.status.toUpperCase()}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (order: MockOrder) => (
        <div className="flex items-center gap-1">
          {order.status === 'pending' && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-blue-600 hover:text-blue-700"
              onClick={() => updateStatus(order.id, 'processing')}
              title="Process Order"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {order.status === 'processing' && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-purple-600 hover:text-purple-700"
              onClick={() => updateStatus(order.id, 'shipped')}
              title="Ship Order"
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
          {order.status === 'shipped' && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-green-600 hover:text-green-700"
              onClick={() => updateStatus(order.id, 'delivered')}
              title="Deliver Order"
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">Manage customer purchases and order fulfillment (Cash on Delivery).</p>
      </div>

      <DataTable
        data={orders}
        columns={columns}
        searchKey="customer"
        searchPlaceholder="Search by customer name..."
      />
    </div>
  )
}

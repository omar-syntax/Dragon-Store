'use client'

import { useState } from 'react'
import DataTable from '@/components/admin/DataTable'
import { Button } from '@/components/ui/button'
import { Mail, Shield, User, MoreHorizontal } from 'lucide-react'

interface MockCustomer {
  id: string
  name: string
  email: string
  ordersCount: number
  totalSpent: string
  role: 'customer' | 'admin'
  joinedDate: string
}

export default function AdminCustomersPage() {
  const [customers] = useState<MockCustomer[]>([
    {
      id: 'cust-1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      ordersCount: 5,
      totalSpent: '$1,250.00',
      role: 'customer',
      joinedDate: '2025-12-10',
    },
    {
      id: 'cust-2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      ordersCount: 2,
      totalSpent: '$350.00',
      role: 'customer',
      joinedDate: '2026-01-15',
    },
    {
      id: 'cust-3',
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      ordersCount: 8,
      totalSpent: '$2,450.00',
      role: 'customer',
      joinedDate: '2025-09-04',
    },
    {
      id: 'cust-4',
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      ordersCount: 1,
      totalSpent: '$85.00',
      role: 'customer',
      joinedDate: '2026-04-20',
    },
    {
      id: 'cust-5',
      name: 'Admin User',
      email: 'admin@dragonaccessories.com',
      ordersCount: 0,
      totalSpent: '$0.00',
      role: 'admin',
      joinedDate: '2025-01-01',
    }
  ])

  const columns = [
    {
      key: 'name',
      label: 'Customer Name',
      render: (customer: MockCustomer) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {customer.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold">{customer.name}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" /> {customer.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (customer: MockCustomer) => (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
          customer.role === 'admin' 
            ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400' 
            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
        }`}>
          {customer.role === 'admin' ? (
            <>
              <Shield className="h-3 w-3" /> Admin
            </>
          ) : (
            <>
              <User className="h-3 w-3" /> Customer
            </>
          )}
        </span>
      ),
    },
    {
      key: 'ordersCount',
      label: 'Total Orders',
      render: (customer: MockCustomer) => <span>{customer.ordersCount} orders</span>,
    },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      render: (customer: MockCustomer) => <span className="font-bold text-primary">{customer.totalSpent}</span>,
    },
    {
      key: 'joinedDate',
      label: 'Joined Date',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">Manage your store's customer database and roles.</p>
      </div>

      <DataTable
        data={customers}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search customers by name..."
      />
    </div>
  )
}

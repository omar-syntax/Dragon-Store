'use client'

import { useState, useEffect } from 'react'
import DataTable from '@/components/admin/DataTable'
import { Button } from '@/components/ui/button'
import { Mail, Shield, User as UserIcon, Phone, Calendar } from 'lucide-react'
import { getUsers, getOrders } from '@/lib/store-engine'
import { formatPrice, formatDate } from '@/lib/utils'
import type { User, Order } from '@/types'

interface CustomerStats extends User {
  ordersCount: number
  totalSpent: number
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerStats[]>([])

  useEffect(() => {
    const allUsers = getUsers()
    const allOrders = getOrders()

    const statsList = allUsers.map((user) => {
      const userOrders = allOrders.filter(
        (o) => o.user_id === user.id && o.status !== 'cancelled'
      )
      const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0)

      return {
        ...user,
        ordersCount: userOrders.length,
        totalSpent: totalSpent,
      }
    })

    // Sort by total spent descending
    setCustomers(statsList.sort((a, b) => b.totalSpent - a.totalSpent))
  }, [])

  const columns = [
    {
      key: 'name',
      label: 'Customer Name',
      render: (customer: CustomerStats) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {customer.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-white">{customer.name}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Mail className="h-3 w-3 shrink-0" /> {customer.email}
            </div>
            {customer.phone && (
              <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Phone className="h-3 w-3 shrink-0" /> {customer.phone}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (customer: CustomerStats) => (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
          customer.role === 'admin' 
            ? 'bg-red-500/10 border-red-500/25 text-red-400' 
            : 'bg-slate-800 border-slate-700 text-slate-300'
        }`}>
          {customer.role === 'admin' ? (
            <>
              <Shield className="h-3 w-3" /> Admin
            </>
          ) : (
            <>
              <UserIcon className="h-3 w-3" /> Customer
            </>
          )}
        </span>
      ),
    },
    {
      key: 'ordersCount',
      label: 'Total Orders',
      render: (customer: CustomerStats) => (
        <span className="text-slate-300">{customer.ordersCount} {customer.ordersCount === 1 ? 'order' : 'orders'}</span>
      ),
    },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      render: (customer: CustomerStats) => (
        <span className="font-bold text-primary">{formatPrice(customer.totalSpent)}</span>
      ),
    },
    {
      key: 'created_at',
      label: 'Joined Date',
      render: (customer: CustomerStats) => (
        <span className="text-slate-400 text-xs flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-slate-500" />
          {formatDate(customer.created_at)}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-8 text-slate-100">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white font-heading">Customers</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your store&apos;s customer database and roles.</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden shadow-xl p-4">
        <DataTable
          data={customers}
          columns={columns}
          searchKey="name"
          searchPlaceholder="Search customers by name..."
        />
      </div>
    </div>
  )
}

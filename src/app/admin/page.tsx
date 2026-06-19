'use client'

import { useState, useEffect } from 'react'
import { Package, ShoppingBag, Users, DollarSign, AlertCircle, TrendingUp, Calendar } from 'lucide-react'
import { getStats } from '@/lib/store-engine'
import { formatPrice, formatDate } from '@/lib/utils'
import type { AdminStats } from '@/types'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)

  useEffect(() => {
    setStats(getStats())
  }, [])

  if (!stats) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const cards = [
    { label: 'Total Revenue', value: formatPrice(stats.total_revenue), icon: DollarSign, color: 'text-green-500 bg-green-500/10 border-green-500/20' },
    { label: 'Total Orders', value: stats.total_orders.toString(), icon: ShoppingBag, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
    { label: 'Total Products', value: stats.total_products.toString(), icon: Package, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
    { label: 'Total Customers', value: stats.total_customers.toString(), icon: Users, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
  ]

  // Calculate max revenue for chart scaling
  const maxRevenue = Math.max(...stats.revenue_by_day.map((d) => d.revenue), 1)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white font-heading">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Here is a real-time summary of your store's sales and inventory.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className={`rounded-2xl border bg-slate-900/40 p-6 shadow-md transition-all hover:scale-[1.02] ${card.color}`}>
            <div className="flex items-center justify-between pb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
              <card.icon className="h-5 w-5" />
            </div>
            <div className="text-3xl font-bold text-white font-heading">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-white font-heading">Revenue — Last 7 Days</h2>
          </div>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> Updated Live
          </span>
        </div>

        {/* Visual Bar Chart */}
        <div className="h-64 flex items-end gap-3 md:gap-6 pt-4 border-b border-slate-800">
          {stats.revenue_by_day.map((day) => {
            const pct = (day.revenue / maxRevenue) * 100
            const dayLabel = new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 bg-slate-800 border border-slate-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30 shadow-xl">
                  {formatPrice(day.revenue)}
                  <div className="text-[10px] text-slate-400 font-normal mt-0.5">{day.date}</div>
                </div>

                {/* Bar */}
                <div 
                  style={{ height: `${Math.max(pct, 4)}%` }}
                  className="w-full bg-gradient-to-t from-primary/60 to-primary rounded-t-lg transition-all duration-500 hover:from-primary hover:to-primary-foreground shadow-[0_0_15px_rgba(239,68,68,0.15)] group-hover:shadow-[0_0_25px_rgba(239,68,68,0.3)]"
                />

                {/* X Axis Label */}
                <span className="text-[10px] md:text-xs text-slate-400 mt-2 font-semibold uppercase tracking-wider">{dayLabel}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-7">
        {/* Recent Orders */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/20 p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white font-heading">Recent Orders</h2>
              <Link href="/admin/orders" className="text-xs text-primary hover:underline font-bold uppercase tracking-wider">
                View All Orders
              </Link>
            </div>
            {stats.recent_orders.length > 0 ? (
              <div className="divide-y divide-slate-800">
                {stats.recent_orders.map((order) => (
                  <div key={order.id} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white font-mono">{order.id}</p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{order.user_name} ({order.user_email})</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-bold text-white">{formatPrice(order.total)}</span>
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        order.status === 'delivered' ? 'bg-green-500/10 border-green-500/30 text-green-500' :
                        order.status === 'cancelled' ? 'bg-destructive/10 border-destructive/20 text-destructive' :
                        'bg-amber-500/10 border-amber-500/20 text-amber-500'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">No orders have been placed yet.</p>
            )}
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-800 bg-slate-900/20 p-6 shadow-md">
          <h2 className="text-lg font-bold text-white mb-6 font-heading">Inventory Alerts</h2>
          {stats.low_stock_count > 0 ? (
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-400">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold">Low Stock Warning</p>
                  <p className="text-xs text-slate-400 mt-1">
                    There are <span className="font-bold text-amber-400">{stats.low_stock_count}</span> products with stock quantity of 5 or less.
                  </p>
                  <Link 
                    href="/admin/products" 
                    className="text-[10px] font-bold text-primary hover:underline block uppercase tracking-wider mt-3"
                  >
                    View Products
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-10">
              <div className="h-10 w-10 rounded-full bg-green-500/10 border border-green-500/25 flex items-center justify-center text-green-500 mb-3">
                <DollarSign className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-white">Inventory is Healthy</p>
              <p className="text-xs text-slate-500 mt-1">All products are well stocked above 5 units.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react'

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Revenue', value: '$12,450', icon: DollarSign, color: 'text-green-600' },
    { label: 'Total Orders', value: '142', icon: ShoppingBag, color: 'text-blue-600' },
    { label: 'Total Products', value: '72', icon: Package, color: 'text-orange-600' },
    { label: 'Total Customers', value: '89', icon: Users, color: 'text-purple-600' },
  ]

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, here's what's happening today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">{stat.label}</p>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="md:col-span-4 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Recent Sales</h2>
          <div className="space-y-4">
             {/* Mock sales list */}
             {[1, 2, 3, 4, 5].map((i) => (
               <div key={i} className="flex items-center gap-4">
                 <div className="h-9 w-9 rounded-full bg-muted" />
                 <div className="flex flex-1 flex-col">
                   <p className="text-sm font-medium">Customer {i}</p>
                   <p className="text-xs text-muted-foreground">customer{i}@example.com</p>
                 </div>
                 <div className="text-sm font-bold">+$250.00</div>
               </div>
             ))}
          </div>
        </div>
        <div className="md:col-span-3 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Inventory Alerts</h2>
          <div className="space-y-4">
             <div className="flex flex-col gap-1 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive">
                <p className="text-sm font-bold">Out of Stock</p>
                <p className="text-xs">Dragon Essence No. 5</p>
             </div>
             <div className="flex flex-col gap-1 p-3 rounded-md bg-orange-100 border border-orange-200 text-orange-800">
                <p className="text-sm font-bold">Low Stock (2 remaining)</p>
                <p className="text-xs">Midnight Leather Messenger</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

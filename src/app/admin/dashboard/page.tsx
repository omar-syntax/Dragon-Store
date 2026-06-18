'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AdminDashboard() {
  const sections = [
    { title: "Carousel Manager", href: "/admin/carousel" },
    { title: "Product Management", href: "/admin/products" },
    { title: "Offers Manager", href: "/admin/offers" },
    { title: "Categories Management", href: "/admin/categories" },
  ]

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin CMS Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="hover:bg-slate-50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Manage {section.title.toLowerCase()} content and settings.</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

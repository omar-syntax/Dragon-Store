import ProductCard from '@/components/products/ProductCard'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams

  const filteredProducts = category 
    ? MOCK_PRODUCTS.filter(p => p.category === category)
    : MOCK_PRODUCTS

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight capitalize">
            {category ? `${category}` : 'All Products'}
          </h1>
          <p className="text-muted-foreground">
            Explore our curated selection of premium accessories.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium">No products found.</p>
            <p className="text-muted-foreground">Try adjusting your filters or category selection.</p>
          </div>
        )}
      </div>
    </div>
  )
}

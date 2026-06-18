import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // In a real app, you'd fetch all product slugs here
  const products = [
    { slug: 'dragon-chronograph-silver', lastModified: new Date() },
  ]

  const productUrls = products.map((product) => ({
    url: `https://dragonaccessories.com/products/${product.slug}`,
    lastModified: product.lastModified,
  }))

  return [
    {
      url: 'https://dragonaccessories.com',
      lastModified: new Date(),
    },
    {
      url: 'https://dragonaccessories.com/products',
      lastModified: new Date(),
    },
    ...productUrls,
  ]
}

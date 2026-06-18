import { Product } from '@/types'

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Dragon Chronograph Silver',
    slug: 'dragon-chronograph-silver',
    description: 'A premium stainless steel chronograph watch with a sleek silver finish and sapphire crystal.',
    price: 250,
    images: ['https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1000&auto=format&fit=crop'],
    category: 'watches',
    stock: 10,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    id: '2',
    name: 'Midnight Leather Messenger',
    slug: 'midnight-leather-messenger',
    description: 'Handcrafted genuine leather bag perfect for daily essentials and a 14-inch laptop.',
    price: 180,
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop'],
    category: 'bags',
    stock: 5,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
  },
  {
    id: '3',
    name: 'Dragon Essence No. 5',
    slug: 'dragon-essence-no-5',
    description: 'A signature scent with notes of sandalwood, citrus, and a hint of white musk.',
    price: 95,
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop'],
    category: 'perfumes',
    stock: 15,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString()
  },
  {
    id: '4',
    name: 'Classic Bifold Wallet',
    slug: 'classic-bifold-wallet',
    description: 'Slim, durable bifold wallet made from premium full-grain leather.',
    price: 65,
    images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop'],
    category: 'bags',
    stock: 20,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: '5',
    name: 'Obsidian Matte Watch',
    slug: 'obsidian-matte-watch',
    description: 'All-black minimalist watch with a matte finish and adjustable mesh strap.',
    price: 210,
    images: ['https://images.unsplash.com/photo-1508685096489-7aac29fbd5b3?q=80&w=1000&auto=format&fit=crop'],
    category: 'watches',
    stock: 8,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
  },
  {
    id: '6',
    name: 'Velvet Rose EDP',
    slug: 'velvet-rose-edp',
    description: 'A deep, floral fragrance with a velvety texture and long-lasting sillage.',
    price: 110,
    images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop'],
    category: 'perfumes',
    stock: 12,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  }
]

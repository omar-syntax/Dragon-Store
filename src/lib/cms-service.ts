import { MOCK_PRODUCTS } from './mock-data';

const STORAGE_KEY = 'cms_state';

export interface CarouselItem {
  id: string;
  image_url: string;
  title: string;
  button_text: string;
  redirect_url: string;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category_id: string;
  type_id: string;
  images: string[];
}

export interface CMSState {
  carousel: CarouselItem[];
  product_types: { id: string; name: string }[];
  categories: { id: string; type_id: string; name: string }[];
  products: Product[];
  offers: { id: string; product_id: string; discount: number; start_date: string; end_date: string }[];
}

const DEFAULT_STATE: CMSState = {
  carousel: [
    { id: '1', image_url: '/slide-watches.png', title: 'Premium Watches', button_text: 'Shop Now', redirect_url: '/products?category=watches', order: 0 },
  ],
  product_types: [
    { id: 'watches', name: 'Watches' },
    { id: 'bags', name: 'Bags' },
    { id: 'perfumes', name: 'Perfumes' },
  ],
  categories: [
    { id: 'rolex', type_id: 'watches', name: 'Rolex' },
    { id: 'ap', type_id: 'watches', name: 'AP' },
  ],
  products: MOCK_PRODUCTS.map(p => ({
      ...p,
      type_id: p.category,
      category_id: 'unassigned' // Simplified for initial migration
  })),
  offers: [],
};

export const getCMSState = (): CMSState => {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
    return DEFAULT_STATE;
  }
  return JSON.parse(stored);
};

export const updateCMSState = (newState: CMSState) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
};

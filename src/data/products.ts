export interface ProductSize {
  size: string;
  price: number;
}

export interface Product {
  id: string | number;
  name: string;
  image: string;
  images?: string[];
  description?: string;
  rating: number;
  category: string;
  badge?: string;
  searchTags: string[];
  sizes: ProductSize[];
}

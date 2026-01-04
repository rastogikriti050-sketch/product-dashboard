export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  description?: string;
  createdAt: Date;
}

export type ViewMode = 'list' | 'card';

export interface ProductFormData {
  name: string;
  price: number;
  category: string;
  stock: number;
  description?: string;
}

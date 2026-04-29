export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

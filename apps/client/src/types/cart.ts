import { Product } from "./product";

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
  lineTotal: number;
}

export interface Cart {
  id: string;
  buyerId: string;
  items: CartItem[];
  totalAmount: number;
}

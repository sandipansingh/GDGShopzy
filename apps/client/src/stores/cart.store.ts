import { create } from "zustand";
import { Cart } from "../types/cart";
import { cartApi } from "../features/cart/api";

interface CartState {
  cart: Cart | null;
  setCart: (cart: Cart | null) => void;
  clearCart: () => void;
  addItem: (productId: string, quantity: number) => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  setCart: (cart) => set({ cart }),
  clearCart: () => set({ cart: null }),
  addItem: async (productId, quantity) => {
    await cartApi.addItem({ productId, quantity });
    const updatedCart = await cartApi.getCart();
    set({ cart: updatedCart });
  },
}));

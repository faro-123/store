import { create } from 'zustand';
import { CartItem, User } from '../types';

type StoreState = {
  cart: CartItem[];
  purchased: string[];
  user: User | null;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  login: (user: User) => void;
  logout: () => void;
  completeCheckout: () => void;
};

export const useStore = create<StoreState>((set, get) => ({
  cart: [],
  purchased: [],
  user: null,
  addToCart: (productId) =>
    set((state) => {
      const current = state.cart.find((item) => item.productId === productId);
      if (current) {
        return {
          cart: state.cart.map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
          )
        };
      }
      return { cart: [...state.cart, { productId, quantity: 1 }] };
    }),
  removeFromCart: (productId) =>
    set((state) => ({ cart: state.cart.filter((item) => item.productId !== productId) })),
  clearCart: () => set({ cart: [] }),
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
  completeCheckout: () => {
    const ids = get().cart.map((item) => item.productId);
    set((state) => ({
      purchased: Array.from(new Set([...state.purchased, ...ids])),
      cart: []
    }));
  }
}));

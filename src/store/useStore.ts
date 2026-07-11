import { create } from 'zustand';
import { CartItem, User } from '../types';
import { api } from '../services/api';

const D1_NAME_TO_LOCAL_ID: Record<string, string> = {
  'Aurora UI Kit': 'aurora-kit',
  'Motion Lab': 'motion-lab',
  'Commerce Canvas': 'commerce-canvas',
  'CMS Spark Plugin': 'cms-spark',
  'Chart Foundry': 'chart-foundry',
  'Studio Admin Pro': 'studio-admin',
};

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
  loadPurchased: (productIds: string[]) => void;
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
  login: (user) => {
    set({ user });
    if (user.userId) {
      api.getDownloads(Number(user.userId)).then((data) => {
        const ids = data.map((p: any) => {
          const localId = D1_NAME_TO_LOCAL_ID[p.name];
          return localId || `remote-${p.id}`;
        });
        set({ purchased: ids });
      }).catch(() => {});
    }
  },
  logout: () => set({ user: null, purchased: [] }),
  completeCheckout: () => {
    const ids = get().cart.map((item) => item.productId);
    set((state) => ({
      purchased: Array.from(new Set([...state.purchased, ...ids])),
      cart: []
    }));
  },
  loadPurchased: (productIds) =>
    set((state) => ({
      purchased: Array.from(new Set([...state.purchased, ...productIds]))
    })),
}));

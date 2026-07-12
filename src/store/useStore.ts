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

const STORAGE_KEY_USER = 'atelier_user';
const STORAGE_KEY_PURCHASED = 'atelier_purchased';
const STORAGE_KEY_CART = 'atelier_cart';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

const initialUser = loadFromStorage<User | null>(STORAGE_KEY_USER, null);
const initialPurchased = loadFromStorage<string[]>(STORAGE_KEY_PURCHASED, []);
const initialCart = loadFromStorage<CartItem[]>(STORAGE_KEY_CART, []);

export function restoreSession() {
  const stored = loadFromStorage<User | null>(STORAGE_KEY_USER, null);
  if (stored && stored.userId) {
    useStore.getState().login(stored, true);
  }
}

type StoreState = {
  cart: CartItem[];
  purchased: string[];
  user: User | null;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  login: (user: User, silent?: boolean) => void;
  logout: () => void;
  completeCheckout: () => void;
  loadPurchased: (productIds: string[]) => void;
};

export const useStore = create<StoreState>((set, get) => ({
  cart: initialCart,
  purchased: initialPurchased,
  user: initialUser,

  addToCart: (productId) =>
    set((state) => {
      const current = state.cart.find((item) => item.productId === productId);
      let next: CartItem[];
      if (current) {
        next = state.cart.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        next = [...state.cart, { productId, quantity: 1 }];
      }
      saveToStorage(STORAGE_KEY_CART, next);
      return { cart: next };
    }),

  removeFromCart: (productId) =>
    set((state) => {
      const next = state.cart.filter((item) => item.productId !== productId);
      saveToStorage(STORAGE_KEY_CART, next);
      return { cart: next };
    }),

  clearCart: () => {
    saveToStorage(STORAGE_KEY_CART, []);
    set({ cart: [] });
  },

  login: (user, silent) => {
    saveToStorage(STORAGE_KEY_USER, user);
    set({ user });
    if (user.userId) {
      api.getDownloads(Number(user.userId)).then((data) => {
        const ids = data.map((p: any) => {
          const localId = D1_NAME_TO_LOCAL_ID[p.name];
          return localId || `remote-${p.id}`;
        });
        saveToStorage(STORAGE_KEY_PURCHASED, ids);
        set({ purchased: ids });
        if (!silent) {
          saveToStorage(STORAGE_KEY_CART, []);
          set({ cart: [] });
        }
      }).catch(() => {});
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_PURCHASED);
    localStorage.removeItem(STORAGE_KEY_CART);
    set({ user: null, purchased: [], cart: [] });
  },

  completeCheckout: () => {
    const ids = get().cart.map((item) => item.productId);
    const nextPurchased = Array.from(new Set([...get().purchased, ...ids]));
    saveToStorage(STORAGE_KEY_PURCHASED, nextPurchased);
    saveToStorage(STORAGE_KEY_CART, []);
    set({ purchased: nextPurchased, cart: [] });
  },

  loadPurchased: (productIds) =>
    set((state) => {
      const next = Array.from(new Set([...state.purchased, ...productIds]));
      saveToStorage(STORAGE_KEY_PURCHASED, next);
      return { purchased: next };
    }),
}));

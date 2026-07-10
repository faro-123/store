import { create } from 'zustand';

export interface Product {
  id?: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image_url: string;
  created_at?: string;
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<boolean>;
}

// ⚠️ 請將此處替換為你真實的 Cloudflare Worker 網址
const API_BASE_URL = 'https://atelier-api.xxxx.workers.dev'; 

// 💡 關鍵修正：Zustand v5 嚴格要求使用 create<T>()((set, get) => ...) 雙括號寫法
export const useProductStore = create<ProductState>()((set) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (!response.ok) throw new Error('無法從伺服器獲取數據');
      const data = await response.json();
      set({ products: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || '獲取數據失敗', isLoading: false });
    }
  },

  addProduct: async (newProduct) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) throw new Error('新增產品失敗');
      const savedProduct = await response.json();
      
      set((state) => ({
        products: [...state.products, savedProduct],
        isLoading: false
      }));
      return true;
    } catch (err: any) {
      set({ error: err.message || '添加失敗', isLoading: false });
      return false;
    }
  }
}));
import React, { useEffect } from 'react'; // 👈 1. 修正了第一行的逗號錯誤
import { useProductStore } from '../store/productStore';
import ProductCard from './ProductCard'; // 👈 2. 修正：ProductCard 是預設匯出，去掉了花括號

const SkeletonGrid: React.FC = () => {
  const { products, isLoading, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (isLoading) {
    return (
      <div className="text-center py-20 text-slate-400 font-medium tracking-wide">
        正在跨海調取 Cloudflare D1 雲端數據...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((product) => {
        // 動態將資料庫的 image_url 對接到前端認得的 image 欄位
        const safeProduct = {
          ...product,
          image: product.image_url || (product as any).image 
        };

        return (
          <ProductCard 
            key={product.id || (product as any)._id} 
            product={safeProduct as any} 
          />
        );
      })}
    </div>
  );
};

// 👈 3. 關鍵修正：加上預設匯出，讓 Home.tsx 能夠順利讀取
export default SkeletonGrid;
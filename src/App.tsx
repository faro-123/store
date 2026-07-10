import React, { useState, useEffect } from 'react';
import { useProductStore } from './store/productStore';
import { AdminPanel } from './components/AdminPanel';
import Home from './pages/Home'; // 👈 終極修正：把花括號拿掉，改回正確的預設引入！
import { LayoutDashboard, ShoppingBag } from 'lucide-react';

function App() {
  const { fetchProducts } = useProductStore();
  const [currentTab, setCurrentTab] = useState<'store' | 'admin'>('store');

  // 初始化時加載雲端數據
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-slate-50 antialiased font-sans">
      {/* 頂部全域切換控制條 */}
      <div className="bg-slate-900 text-white px-6 py-2.5 flex justify-between items-center text-xs border-b border-slate-800 z-50 relative">
        <span className="text-indigo-400 font-bold tracking-wider font-mono">ATELIER CORE SYSTEM :</span>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentTab('store')}
            className={`px-3 py-1 rounded-md font-medium transition flex items-center gap-1 ${
              currentTab === 'store' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" /> 進入前台商店
          </button>
          <button 
            onClick={() => setCurrentTab('admin')}
            className={`px-3 py-1 rounded-md font-medium transition flex items-center gap-1 ${
              currentTab === 'admin' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> 雲端數據後台
          </button>
        </div>
      </div>

      {/* 根據模式切換整頁視圖 */}
      {currentTab === 'admin' ? (
        <AdminPanel />
      ) : (
        <Home onAuth={() => console.log('Auth triggered')} />
      )}
    </div>
  );
}

export default App;
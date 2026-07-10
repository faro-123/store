import React, { useState } from 'react';
import { useProductStore } from '../store/productStore';
import { PlusCircle, DollarSign, Package, BarChart3, Loader2 } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { products, addProduct, isLoading } = useProductStore();
  
  // 表單狀態
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Digital Art',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500'
  });

  // 數據統計邏輯
  const totalProducts = products.length;
  const totalPrice = products.reduce((sum, p) => sum + Number(p.price), 0);
  const avgPrice = totalProducts > 0 ? (totalPrice / totalProducts).toFixed(2) : '0';
  
  // 💡 關鍵修正：明確告訴 TypeScript 這個 reduce 的累積器是一個鍵值對物件 Record<string, number>
  const categoryCounts = products.reduce<Record<string, number>>((acc, p) => {
    const cat = p.category || 'Uncategorized';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('請填寫商品名稱和價格！');
      return;
    }

    const success = await addProduct({
      name: formData.name,
      price: Number(formData.price),
      description: formData.description,
      category: formData.category,
      image_url: formData.image_url
    });

    if (success) {
      alert(' 商品成功添加至 Cloudflare D1 數據庫！');
      setFormData({
        name: '',
        price: '',
        description: '',
        category: 'Digital Art',
        image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500'
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen text-slate-800">
      <div className="flex items-center space-x-3 border-b pb-4">
        <BarChart3 className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-extrabold tracking-tight">Atelier 雲端數據管理後台</h1>
      </div>

      {/* 1. 數據可視化小看板 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><Package className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">總商品品項</p>
            <p className="text-2xl font-bold">{totalProducts} 個</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><DollarSign className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">數據庫商品總值</p>
            <p className="text-2xl font-bold">${totalPrice.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600"><BarChart3 className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">平均商品單價</p>
            <p className="text-2xl font-bold">${avgPrice}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. 添加產品表單 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <PlusCircle className="text-indigo-600 w-5 h-5" /> 上架全新商品
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">商品名稱 *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="例如: 賽博朋克 4K 桌布"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">價格 (USD) *</label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="29.99"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">商品分類</label>
              <select
                className="w-full px-3 py-2 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="Digital Art">Digital Art (數位藝術)</option>
                <option value="Code Snippet">Code Snippet (程式碼片段)</option>
                <option value="UI Template">UI Template (界面模板)</option>
                <option value="Wallpapers">Wallpapers (桌布壁紙)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">商品描述</label>
              <textarea
                className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                placeholder="請輸入商品詳情描述..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">圖片 URL</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-xl text-xs text-slate-500"
                value={formData.image_url}
                onChange={e => setFormData({...formData, image_url: e.target.value})}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2 disabled:bg-indigo-400"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : '寫入雲端 D1 數據庫'}
            </button>
          </form>
        </div>

        {/* 3. 數據可視化清單與分類佔比 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-3"> D1 現存商品清單</h2>
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm border-b">
                    <th className="p-3">ID</th>
                    <th className="p-3">名稱</th>
                    <th className="p-3">分類</th>
                    <th className="p-3 text-right">價格</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {products.map((product, idx) => (
                    <tr key={product.id ?? idx} className="hover:bg-slate-50 transition">
                      <td className="p-3 text-slate-400 font-mono">#{product.id ?? (idx + 1)}</td>
                      <td className="p-3 font-semibold">{product.name}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-slate-100 rounded-md text-xs text-slate-600">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-3 text-right font-bold text-indigo-600">${product.price}</td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-slate-400">數據庫目前空空如也，快從左側添加一個吧！</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 分類長條佔比 */}
          <div>
            <h3 className="text-sm font-semibold text-slate-500 mb-3"> 產品分類佔比可視化</h3>
            <div className="space-y-2">
              {Object.entries(categoryCounts).map(([cat, count]) => {
                const percentage = totalProducts > 0 ? (count / totalProducts) * 100 : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{cat}</span>
                      <span className="text-slate-500">{count} 個 ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
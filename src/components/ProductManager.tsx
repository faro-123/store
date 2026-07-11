import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import { api } from '../services/api';

type BackendProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  image_url: string;
  code_preview: string;
  rating: number;
  reviews_count: number;
  tags: string;
  accent: string;
  demo_url: string;
  features: string;
};

const emptyProduct = {
  name: '',
  description: '',
  price: 0,
  category: '',
  image: '',
  code_preview: '',
  rating: 0,
  reviews_count: 0,
  tags: '[]',
  accent: '#14b8a6',
  demo_url: '',
  features: '[]',
};

export default function ProductManager() {
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [editing, setEditing] = useState<BackendProduct | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (e) {
      console.error('Failed to load products', e);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editing) {
        await api.updateProduct(editing.id, form);
      } else {
        await api.addProduct(form as any);
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyProduct);
      await load();
    } catch (e) {
      console.error('Failed to save product', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除此商品？')) return;
    try {
      await api.deleteProduct(id);
      await load();
    } catch (e) {
      console.error('Failed to delete', e);
    }
  };

  const openEdit = (p: BackendProduct) => {
    setEditing(p);
    setForm({
      name: p.name || '',
      description: p.description || '',
      price: p.price || 0,
      category: p.category || '',
      image: p.image || p.image_url || '',
      code_preview: p.code_preview || '',
      rating: p.rating || 0,
      reviews_count: p.reviews_count || 0,
      tags: p.tags || '[]',
      accent: p.accent || '#14b8a6',
      demo_url: p.demo_url || '',
      features: p.features || '[]',
    });
    setShowForm(true);
  };

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="panel">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black">商品管理</h2>
        <button
          onClick={() => { setEditing(null); setForm(emptyProduct); setShowForm(true); }}
          className="flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          <Plus size={16} /> 添加商品
        </button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-2 pr-4 font-bold">名称</th>
              <th className="py-2 pr-4 font-bold">分类</th>
              <th className="py-2 pr-4 font-bold">价格</th>
              <th className="py-2 pr-4 font-bold">评分</th>
              <th className="py-2 pr-4 font-bold">操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-slate-100">
                <td className="py-2 pr-4 font-bold">{p.name}</td>
                <td className="py-2 pr-4 text-slate-500">{p.category}</td>
                <td className="py-2 pr-4 font-bold">¥{p.price}</td>
                <td className="py-2 pr-4">{p.rating || '-'}</td>
                <td className="py-2 pr-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!products.length && (
              <tr><td colSpan={5} className="py-8 text-center text-slate-400">暂无商品</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black">{editing ? '编辑商品' : '添加商品'}</h3>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-full p-1 text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500">名称 *</label>
                <input value={form.name} onChange={(e) => set('name', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">描述</label>
                <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={2} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500">价格 *</label>
                  <input type="number" value={form.price} onChange={(e) => set('price', +e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">分类</label>
                  <input value={form.category} onChange={(e) => set('category', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">图片 URL</label>
                <input value={form.image} onChange={(e) => set('image', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500">评分</label>
                  <input type="number" step="0.1" value={form.rating} onChange={(e) => set('rating', +e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">主题色</label>
                  <input value={form.accent} onChange={(e) => set('accent', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">标签 (JSON array)</label>
                <input value={form.tags} onChange={(e) => set('tags', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">特性 (JSON array)</label>
                <input value={form.features} onChange={(e) => set('features', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600">
                取消
              </button>
              <button onClick={handleSubmit} disabled={loading || !form.name} className="flex-1 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                {loading ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

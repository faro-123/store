import { useState, useEffect, useRef, useMemo } from 'react';
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

const CATEGORIES = [
  { value: 'ui', label: 'UI 组件' },
  { value: 'tools', label: '工具库' },
  { value: 'templates', label: '完整模板' },
  { value: 'plugins', label: '插件扩展' },
];

const emptyProduct = {
  name: '',
  description: '',
  price: 0,
  category: 'tools',
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

  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  const [showFeatureSuggestions, setShowFeatureSuggestions] = useState(false);
  const tagRef = useRef<HTMLDivElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (e) {
      console.error('Failed to load products', e);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (tagRef.current && !tagRef.current.contains(e.target as Node)) {
        setShowTagSuggestions(false);
      }
      if (featureRef.current && !featureRef.current.contains(e.target as Node)) {
        setShowFeatureSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      try {
        const tags: string[] = typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags || [];
        tags.forEach((t) => set.add(t));
      } catch {}
    });
    return Array.from(set).sort();
  }, [products]);

  const allFeatures = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      try {
        const feats: string[] = typeof p.features === 'string' ? JSON.parse(p.features) : p.features || [];
        feats.forEach((f) => set.add(f));
      } catch {}
    });
    return Array.from(set).sort();
  }, [products]);

  const currentTags = useMemo(() => {
    try { return typeof form.tags === 'string' ? JSON.parse(form.tags) : form.tags || []; } catch { return []; }
  }, [form.tags]);

  const currentFeatures = useMemo(() => {
    try { return typeof form.features === 'string' ? JSON.parse(form.features) : form.features || []; } catch { return []; }
  }, [form.features]);

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
      category: p.category || 'tools',
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

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || currentTags.includes(trimmed)) return;
    set('tags', JSON.stringify([...currentTags, trimmed]));
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    set('tags', JSON.stringify(currentTags.filter((t: string) => t !== tag)));
  };

  const addFeature = (feat: string) => {
    const trimmed = feat.trim();
    if (!trimmed || currentFeatures.includes(trimmed)) return;
    set('features', JSON.stringify([...currentFeatures, trimmed]));
    setFeatureInput('');
  };

  const removeFeature = (feat: string) => {
    set('features', JSON.stringify(currentFeatures.filter((f: string) => f !== feat)));
  };

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
                  <select value={form.category} onChange={(e) => set('category', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white">
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">图片 URL</label>
                <input value={form.image} onChange={(e) => set('image', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">代码预览</label>
                <textarea value={form.code_preview} onChange={(e) => set('code_preview', e.target.value)} rows={2} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono" placeholder="export const Button = () => ..." />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">演示链接</label>
                <input value={form.demo_url} onChange={(e) => set('demo_url', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="https://example.com/demo" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">主题色</label>
                <div className="flex gap-2">
                  <input value={form.accent} onChange={(e) => set('accent', e.target.value)} className="mt-1 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                  <div className="mt-1 h-9 w-9 rounded-xl border border-slate-200" style={{ backgroundColor: form.accent }} />
                </div>
              </div>

              <div ref={tagRef}>
                <label className="text-xs font-bold text-slate-500">标签</label>
                <div className="mt-1 flex flex-wrap gap-1 rounded-xl border border-slate-200 px-3 py-2">
                  {currentTags.map((tag: string) => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="text-slate-400 hover:text-slate-700">&times;</button>
                    </span>
                  ))}
                  <input
                    value={tagInput}
                    onChange={(e) => { setTagInput(e.target.value); setShowTagSuggestions(true); }}
                    onFocus={() => setShowTagSuggestions(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); setShowTagSuggestions(false); }
                      if (e.key === 'Backspace' && !tagInput && currentTags.length > 0) {
                        removeTag(currentTags[currentTags.length - 1]);
                      }
                    }}
                    placeholder={currentTags.length === 0 ? '输入标签后按回车...' : ''}
                    className="min-w-[100px] flex-1 border-none bg-transparent px-1 py-0.5 text-sm outline-none"
                  />
                </div>
                {showTagSuggestions && tagInput && (
                  <div className="mt-1 max-h-32 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                    {allTags.filter((t) => t.toLowerCase().includes(tagInput.toLowerCase()) && !currentTags.includes(t)).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => { addTag(tag); setShowTagSuggestions(false); }}
                        className="w-full px-3 py-1.5 text-left text-sm hover:bg-slate-50"
                      >
                        {tag}
                      </button>
                    ))}
                    {!allTags.some((t) => t.toLowerCase().includes(tagInput.toLowerCase()) && !currentTags.includes(t)) && (
                      <div className="px-3 py-1.5 text-xs text-slate-400">按回车添加 "{tagInput}"</div>
                    )}
                  </div>
                )}
              </div>

              <div ref={featureRef}>
                <label className="text-xs font-bold text-slate-500">特性</label>
                <div className="mt-1 flex flex-wrap gap-1 rounded-xl border border-slate-200 px-3 py-2">
                  {currentFeatures.map((feat: string) => (
                    <span key={feat} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                      {feat}
                      <button onClick={() => removeFeature(feat)} className="text-slate-400 hover:text-slate-700">&times;</button>
                    </span>
                  ))}
                  <input
                    value={featureInput}
                    onChange={(e) => { setFeatureInput(e.target.value); setShowFeatureSuggestions(true); }}
                    onFocus={() => setShowFeatureSuggestions(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { e.preventDefault(); addFeature(featureInput); setShowFeatureSuggestions(false); }
                      if (e.key === 'Backspace' && !featureInput && currentFeatures.length > 0) {
                        removeFeature(currentFeatures[currentFeatures.length - 1]);
                      }
                    }}
                    placeholder={currentFeatures.length === 0 ? '输入特性后按回车...' : ''}
                    className="min-w-[100px] flex-1 border-none bg-transparent px-1 py-0.5 text-sm outline-none"
                  />
                </div>
                {showFeatureSuggestions && featureInput && (
                  <div className="mt-1 max-h-32 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                    {allFeatures.filter((f) => f.toLowerCase().includes(featureInput.toLowerCase()) && !currentFeatures.includes(f)).map((feat) => (
                      <button
                        key={feat}
                        type="button"
                        onClick={() => { addFeature(feat); setShowFeatureSuggestions(false); }}
                        className="w-full px-3 py-1.5 text-left text-sm hover:bg-slate-50"
                      >
                        {feat}
                      </button>
                    ))}
                    {!allFeatures.some((f) => f.toLowerCase().includes(featureInput.toLowerCase()) && !currentFeatures.includes(f)) && (
                      <div className="px-3 py-1.5 text-xs text-slate-400">按回车添加 "{featureInput}"</div>
                    )}
                  </div>
                )}
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

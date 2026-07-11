import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Boxes, Layers3, Palette, Plug, Search, SlidersHorizontal, Sparkles, Wand2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import SkeletonGrid from '../components/SkeletonGrid';
import { categories, products as localProducts } from '../data/products';
import { CategoryId, Product } from '../types';
import { api } from '../services/api';

type Props = {
  onAuth: () => void;
};

type ReviewStats = { product_id: number; avg_rating: number; count: number };

const categoryIcons = {
  ui: Palette,
  tools: Wand2,
  templates: Layers3,
  plugins: Plug
};

function mapBackendProduct(raw: any): Product {
  let tags: string[] = [];
  try { tags = typeof raw.tags === 'string' ? JSON.parse(raw.tags) : raw.tags || []; } catch (e) {}
  let features: string[] = [];
  try { features = typeof raw.features === 'string' ? JSON.parse(raw.features) : raw.features || []; } catch (e) {}

  return {
    id: `remote-${raw.id}`,
    title: raw.name || raw.title || '',
    category: (['ui', 'tools', 'templates', 'plugins'] as CategoryId[]).includes(raw.category)
      ? raw.category as CategoryId
      : 'tools',
    description: raw.description || '',
    price: Number(raw.price) || 0,
    rating: Number(raw.rating) || 0,
    reviews: Number(raw.reviews_count) || 0,
    tags,
    accent: raw.accent || '#14b8a6',
    image: raw.image || raw.image_url || '',
    demoUrl: raw.demo_url || '',
    code: raw.code_preview || '',
    features,
  };
}

export default function Home({ onAuth }: Props) {
  const [active, setActive] = useState<CategoryId | 'all'>('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [remoteProducts, setRemoteProducts] = useState<Product[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 720);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    api.getProducts()
      .then((data) => setRemoteProducts(data.map(mapBackendProduct)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    api.getAllReviewStats()
      .then((data) => setReviewStats(data))
      .catch(() => {});
  }, []);

  const products = useMemo(() => {
    const seen = new Set(localProducts.map((p) => p.id));
    const merged = [...localProducts];
    for (const rp of remoteProducts) {
      if (!seen.has(rp.id)) {
        merged.push(rp);
        seen.add(rp.id);
      }
    }
    return merged;
  }, [remoteProducts]);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = active === 'all' || product.category === active;
      const text = `${product.title} ${product.description} ${product.tags.join(' ')}`.toLowerCase();
      return matchesCategory && text.includes(query.toLowerCase());
    });
  }, [active, query, products]);

  const LOCAL_D1_ID_MAP: Record<string, number> = {
    'aurora-kit': 5,
    'motion-lab': 6,
    'commerce-canvas': 7,
    'cms-spark': 8,
    'chart-foundry': 9,
    'studio-admin': 10,
  };

  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_420px] lg:py-14">
        <div className="flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="inline-flex w-fit items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm backdrop-blur">
            <Sparkles size={16} />
          数字产品商店
          </motion.div>
          <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.98] tracking-tight text-slate-950 sm:text-7xl">
            Atelier Store
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            提供 UI 组件、工具库、完整模板和插件扩展
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#catalog" className="primary-button">
              浏览商品 <ArrowRight size={18} />
            </a>
            <button onClick={onAuth} className="secondary-button">
              登录账号
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, rotate: -2, y: 24 }}
          animate={{ opacity: 1, rotate: 0, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="relative min-h-[430px] overflow-hidden rounded-[34px] border border-white/70 bg-slate-950 p-5 text-white shadow-lift"
        >
          <img
            src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80"
            alt="数字产品工作台"
            className="absolute inset-0 h-full w-full object-cover opacity-56"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="ml-auto grid h-16 w-16 place-items-center rounded-3xl bg-white/12 backdrop-blur">
              <Boxes size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-white/70">精选模板</p>
              <h2 className="mt-2 text-3xl font-black">Commerce Canvas</h2>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {['路由动效', '', ''].map((item) => (
                  <div key={item} className="rounded-2xl bg-white/12 p-3 text-sm font-bold backdrop-blur">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="catalog" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-teal-700">Catalog</p>
            <h2 className="mt-2 text-3xl font-black">功能分类区块</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="field w-full pl-11 sm:w-80" placeholder="搜索组件、模板、插件" />
            </label>
            <button className="secondary-button">
              <SlidersHorizontal size={18} />
              智能排序
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <button className={`category-tile ${active === 'all' ? 'is-active' : ''}`} onClick={() => setActive('all')}>
            <Boxes size={21} />
            <span>全部商品</span>
          </button>
          {categories.map((category) => {
            const Icon = categoryIcons[category.id];
            return (
              <button key={category.id} className={`category-tile ${active === category.id ? 'is-active' : ''}`} onClick={() => setActive(category.id)}>
                <Icon size={21} />
                <span>{category.label}</span>
                <small>{category.hint}</small>
              </button>
            );
          })}
        </div>

        {loading ? (
          <SkeletonGrid />
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  reviewStats={product.id.startsWith('remote-')
                    ? reviewStats.find((s) => s.product_id === parseInt(product.id.replace('remote-', '')))
                    : reviewStats.find((s) => s.product_id === LOCAL_D1_ID_MAP[product.id])
                  }
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </section>
    </>
  );
}

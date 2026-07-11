import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, ShoppingBag, Star } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { products } from '../data/products';
import { useStore } from '../store/useStore';
import { currency } from '../utils';
import { api } from '../services/api';

type Review = { id: number; product_id: number; rating: number; comment: string; username: string; created_at: string };

const LOCAL_TO_D1_ID: Record<string, string> = {
  'aurora-kit': '5',
  'motion-lab': '6',
  'commerce-canvas': '7',
  'cms-spark': '8',
  'chart-foundry': '9',
  'studio-admin': '10',
};

function resolveD1Id(productId: string): string {
  if (productId.startsWith('remote-')) {
    return productId.replace('remote-', '');
  }
  return LOCAL_TO_D1_ID[productId] || '1';
}

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((item) => item.id === id) ?? products[0];
  const addToCart = useStore((state) => state.addToCart);
  const user = useStore((state) => state.user);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setReviews([]);
  }, [product.id]);

  const loadReviews = useCallback(async () => {
    const d1Id = resolveD1Id(product.id);
    try {
      const data = await api.getReviews(d1Id);
      setReviews(data);
    } catch {}
  }, [product.id]);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  const displayReviews = reviews.length > 0 ? reviews : [];

  const avgRating = useMemo(() => {
    if (displayReviews.length === 0) return 0;
    const sum = displayReviews.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / displayReviews.length).toFixed(1));
  }, [displayReviews]);

  async function submitReview() {
    if (!user) return;
    setSubmitting(true);
    try {
      const d1Id = resolveD1Id(product.id);
      const commentText = comment.trim() || 'Great product!';
      await api.addReview(d1Id, rating, commentText, user.name);
      setComment('');
      setRating(5);
      setShowForm(false);
      await loadReviews();
    } catch {} finally { setSubmitting(false); }
  }

  function formatDate(dateStr: string) {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateStr;
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-950">
        <ArrowLeft size={17} /> 返回商店
      </Link>
      <div className="grid gap-8 lg:grid-cols-[1.08fr_.92fr]">
        <motion.div layoutId={product.id} className="overflow-hidden rounded-[34px] border border-white/70 bg-white/70 shadow-lift backdrop-blur">
          <img src={product.image} alt={product.title} className="h-[430px] w-full object-cover" />
        </motion.div>
        <div className="rounded-[34px] border border-white/70 bg-white/80 p-6 shadow-material backdrop-blur-xl">
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mt-5 text-4xl font-black">{product.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">{product.description}</p>
          <div className="mt-5 flex items-center gap-2 font-bold text-slate-700">
            <Star size={18} fill={avgRating > 0 ? '#f59e0b' : 'none'} color={avgRating > 0 ? '#f59e0b' : '#d1d5db'} />
            <span>{avgRating > 0 ? avgRating : '-'}</span>
            <span>·</span>
            <span>{displayReviews.length} 条评价</span>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="text-4xl font-black">{currency.format(product.price)}</span>
            <motion.button whileTap={{ scale: 0.94 }} onClick={() => addToCart(product.id)} className="primary-button">
              <ShoppingBag size={18} />
              加入购物车
            </motion.button>
            <a href={product.demoUrl} className="secondary-button" target="_blank" rel="noreferrer">
              在线演示 <ExternalLink size={17} />
            </a>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {product.features.map((feature) => (
              <div key={feature} className="rounded-2xl bg-white/75 p-4 text-sm font-bold shadow-sm">
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px]">
        <section className="rounded-[28px] bg-slate-950 p-5 text-white shadow-lift">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black">代码预览</h2>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">TypeScript</span>
          </div>
          <pre className="overflow-x-auto rounded-2xl bg-black/35 p-5 text-sm leading-7 text-teal-100"><code>{product.code}</code></pre>
        </section>

        <section className="flex flex-col rounded-[28px] border border-white/70 bg-white/75 p-5 shadow-material backdrop-blur">
          <h2 className="text-xl font-black">写评价</h2>
          {user ? (
            <>
              <div className="mt-3 flex gap-1">
                {[1,2,3,4,5].map((s) => (
                  <button key={s} onClick={() => setRating(s)}>
                    <Star size={20} fill={s <= rating ? '#f59e0b' : 'none'} color={s <= rating ? '#f59e0b' : '#d1d5db'} />
                  </button>
                ))}
              </div>
              {showForm ? (
                <>
                  <textarea className="mt-3 w-full rounded-2xl border border-slate-200 p-3 text-sm" rows={2} placeholder="写下你的评价..." value={comment} onChange={(e) => setComment(e.target.value)} />
                  <div className="mt-2 flex gap-2">
                    <button onClick={submitReview} disabled={submitting} className="rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white">
                      {submitting ? '提交中...' : '提交评价'}
                    </button>
                    <button onClick={() => { setShowForm(false); setComment(''); }} className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600">取消</button>
                  </div>
                </>
              ) : (
                <button onClick={() => setShowForm(true)} className="mt-3 self-start rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50">
                  写评价
                </button>
              )}
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-400">登录后可发表评价</p>
          )}
        </section>
      </div>

      <section className="mt-8">
        <h2 className="text-2xl font-black">用户评价 ({displayReviews.length})</h2>
        {displayReviews.length === 0 ? (
          <div className="mt-4 rounded-[24px] border border-dashed border-slate-200 bg-white/50 py-12 text-center">
            <p className="text-sm text-slate-400">暂无评价，成为第一个评价的人吧！</p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {displayReviews.map((review) => (
              <div key={review.id} className="rounded-[20px] border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                      {(review.username || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{review.username || 'anonymous'}</p>
                      <div className="mt-0.5 flex gap-0.5">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} size={13} fill={s <= review.rating ? '#f59e0b' : 'none'} color={s <= review.rating ? '#f59e0b' : '#d1d5db'} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{formatDate(review.created_at)}</span>
                </div>
                {review.comment ? (
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{review.comment}</p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

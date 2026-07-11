import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, ShoppingBag, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { products } from '../data/products';
import { useStore } from '../store/useStore';
import { currency } from '../utils';
import { api } from '../services/api';

type Review = { id: number; product_id: number; rating: number; comment: string; username: string; created_at: string };

const LOCAL_TO_D1_ID: Record<string, string> = {
  'aurora-kit': '4',
  'motion-lab': '5',
  'commerce-canvas': '6',
  'cms-spark': '7',
  'chart-foundry': '8',
  'studio-admin': '9',
};

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((item) => item.id === id) ?? products[0];
  const addToCart = useStore((state) => state.addToCart);
  const user = useStore((state) => state.user);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = useCallback(async () => {
    const d1Id = LOCAL_TO_D1_ID[product.id] || '1';
    try {
      const data = await api.getReviews(d1Id);
      setReviews(data);
    } catch {}
  }, [product.id]);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  const displayReviews = reviews.length > 0 ? reviews : [];

  async function submitReview() {
    if (!user) return;
    setSubmitting(true);
    try {
      const d1Id = LOCAL_TO_D1_ID[product.id] || '1';
      const commentText = comment.trim() || 'Great product!';
      await api.addReview(d1Id, rating, commentText, user.name);
      setComment('');
      setRating(5);
      setShowForm(false);
      await loadReviews();
    } catch {} finally { setSubmitting(false); }
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
            <Star size={18} fill="#f59e0b" color="#f59e0b" />
            {product.rating} · {displayReviews.length || product.reviews} reviews
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

      <div className="mt-8">
        <h2 className="text-center text-3xl font-black">User Rating 😍</h2>
        <div className="mt-4 relative overflow-hidden rounded-[28px] bg-slate-900 p-6 shadow-lift">
          {displayReviews.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">No reviews yet. Be the first to review!</p>
          ) : (
            <>
              <div className="flex flex-col items-center text-center">
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: displayReviews[reviewIdx]?.rating || 5 }).map((_, s) => (
                    <Star key={s} size={24} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-4 max-w-md text-lg text-white/80">{displayReviews[reviewIdx]?.comment || '(no comment)'}</p>
                <p className="mt-4 text-sm font-bold text-amber-300">{displayReviews[reviewIdx]?.username || 'anonymous'}</p>
              </div>
              {displayReviews.length > 1 && (
                <div className="mt-6 flex items-center justify-center gap-3">
                  <button onClick={() => setReviewIdx((i) => (i - 1 + displayReviews.length) % displayReviews.length)} className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/70 hover:bg-white/20">
                    <ChevronLeft size={16} />
                  </button>
                  <div className="flex gap-1.5">
                    {displayReviews.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setReviewIdx(i)}
                        className={`rounded-full transition-all ${i === reviewIdx ? 'h-2 w-6 bg-white' : 'h-2 w-2 bg-white/30'}`}
                      />
                    ))}
                  </div>
                  <button onClick={() => setReviewIdx((i) => (i + 1) % displayReviews.length)} className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/70 hover:bg-white/20">
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

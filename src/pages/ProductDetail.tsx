import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, ShoppingBag, Star } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { products } from '../data/products';
import { useStore } from '../store/useStore';
import { currency } from '../utils';

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((item) => item.id === id) ?? products[0];
  const addToCart = useStore((state) => state.addToCart);

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
            {product.rating} · {product.reviews} 条用户评价
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

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="rounded-[28px] bg-slate-950 p-5 text-white shadow-lift">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black">代码预览</h2>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">TypeScript</span>
          </div>
          <pre className="overflow-x-auto rounded-2xl bg-black/35 p-5 text-sm leading-7 text-teal-100"><code>{product.code}</code></pre>
        </section>
        <section className="rounded-[28px] border border-white/70 bg-white/75 p-5 shadow-material backdrop-blur">
          <h2 className="text-xl font-black">用户评价</h2>
          {['设计质感非常完整，落地到项目里很顺手。', '动效曲线克制，性能也不错。', '分类和文档清晰，适合团队复用。'].map((review, index) => (
            <div key={review} className="mt-4 rounded-2xl bg-slate-50 p-4">
              <div className="flex gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, star) => (
                  <Star key={star} size={15} fill="currentColor" />
                ))}
              </div>
              <p className="mt-2 text-sm text-slate-600">{review}</p>
              <p className="mt-2 text-xs font-bold text-slate-400">用户 #{index + 1}</p>
            </div>
          ))}
        </section>
      </div>
    </section>
  );
}

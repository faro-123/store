import { motion } from 'framer-motion';
import { Eye, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { currency } from '../utils';
import { useStore } from '../store/useStore';

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const addToCart = useStore((state) => state.addToCart);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, rotateX: 3, rotateY: -3 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="group overflow-hidden rounded-[26px] border border-white/70 bg-white/75 shadow-material backdrop-blur-xl"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative h-52 overflow-hidden">
          <img src={product.image} alt={product.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
          <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-black text-slate-800 backdrop-blur">
            {product.tags[0]}
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
            <div>
              <h3 className="text-xl font-black">{product.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-white/80">{product.description}</p>
            </div>
            <span className="rounded-full bg-white px-3 py-2 text-sm font-black text-slate-950">{currency.format(product.price)}</span>
          </div>
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-sm font-bold text-slate-700">
            <Star size={16} fill="#f59e0b" color="#f59e0b" />
            {product.rating} · {product.reviews} 条评价
          </span>
          <div className="flex gap-2">
            <Link to={`/product/${product.id}`} className="icon-button" aria-label="预览" title="预览">
              <Eye size={18} />
            </Link>
            <motion.button
              whileTap={{ scale: 0.88 }}
              className="rounded-full bg-slate-950 p-3 text-white shadow-lg"
              onClick={() => addToCart(product.id)}
              aria-label="加入购物车"
              title="加入购物车"
            >
              <ShoppingBag size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const results = query.trim()
    ? products.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSelect = (id: string) => {
    onClose();
    navigate(`/product/${id}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/40 backdrop-blur-sm pt-24 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl rounded-3xl border border-white/70 bg-white/90 p-5 shadow-2xl backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 rounded-2xl bg-[#f7f5ef] px-4 py-3 ring-1 ring-slate-900/5">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索商品名称..."
                className="flex-1 bg-transparent text-base font-medium text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-900/5 hover:text-slate-700 transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 max-h-80 overflow-y-auto">
              {query.trim() && results.length === 0 && (
                <p className="py-8 text-center text-sm text-slate-400">
                  没有找到匹配的商品
                </p>
              )}
              {results.length > 0 && (
                <ul className="space-y-1">
                  {results.map((product) => (
                    <li key={product.id}>
                      <button
                        onClick={() => handleSelect(product.id)}
                        className="flex w-full items-center gap-4 rounded-2xl px-3 py-3 text-left transition hover:bg-slate-900/5"
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-12 w-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-slate-900">
                            {product.title}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {product.description}
                          </p>
                        </div>
                        <span className="shrink-0 text-sm font-bold text-teal-700">
                          ¥{product.price}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {!query.trim() && (
                <p className="py-8 text-center text-sm text-slate-400">
                  输入商品名称开始搜索
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { cartTotal, currency, getProduct } from '../utils';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({ open, onClose }: Props) {
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const total = cartTotal(cart);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex justify-end bg-slate-950/30 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.aside
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className="flex h-full w-full max-w-md flex-col border-l border-white/60 bg-[#fbfaf6]/90 p-5 shadow-lift backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-rose-600">Cart</p>
                <h2 className="text-2xl font-black">购物车</h2>
              </div>
              <button className="icon-button" onClick={onClose} aria-label="关闭" title="关闭">
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 flex-1 space-y-3 overflow-y-auto pr-1">
              {cart.length === 0 && (
                <div className="rounded-3xl bg-white/70 p-8 text-center shadow-sm">
                  <p className="font-black">购物车是空的</p>
                  <p className="mt-2 text-sm text-slate-500">挑选 UI 组件、工具库或模板后会显示在这里。</p>
                </div>
              )}
              {cart.map((item) => {
                const product = getProduct(item.productId);
                if (!product) return null;
                return (
                  <motion.div
                    layout
                    key={item.productId}
                    initial={{ opacity: 0, x: 30, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 30, scale: 0.96 }}
                    className="flex gap-3 rounded-3xl bg-white/75 p-3 shadow-sm ring-1 ring-white"
                  >
                    <img src={product.image} alt={product.title} className="h-20 w-20 rounded-2xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-black">{product.title}</p>
                      <p className="mt-1 text-sm text-slate-500">数量 {item.quantity}</p>
                      <p className="mt-2 font-black">{currency.format(product.price * item.quantity)}</p>
                    </div>
                    <button className="icon-button" onClick={() => removeFromCart(item.productId)} aria-label="移除" title="移除">
                      <Trash2 size={17} />
                    </button>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-5 rounded-3xl bg-slate-950 p-5 text-white">
              <div className="flex items-center justify-between text-sm text-white/64">
                <span>模拟支付金额</span>
                <span>无需真实支付</span>
              </div>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-3xl font-black">{currency.format(total)}</span>
                <Link to="/checkout" onClick={onClose} className="rounded-full bg-white px-4 py-3 text-sm font-black text-slate-950">
                  结账 <ArrowRight className="inline" size={16} />
                </Link>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

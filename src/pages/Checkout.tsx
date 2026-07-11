import { AnimatePresence, motion } from 'framer-motion';
import { Check, CreditCard, Download, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { cartTotal, currency, getProduct } from '../utils';

type Props = {
  onAuth: () => void;
};

export default function Checkout({ onAuth }: Props) {
  const cart = useStore((state) => state.cart);
  const user = useStore((state) => state.user);
  const completeCheckout = useStore((state) => state.completeCheckout);
  const navigate = useNavigate();
  const total = cartTotal(cart);

  async function pay() {
    if (!user) {
      onAuth();
      return;
    }
    const productIds = cart.map((item) => {
      const p = getProduct(item.productId);
      if (!p) return null;
      if (p.id.startsWith('remote-')) return parseInt(p.id.replace('remote-', ''));
      return p.id;
    }).filter(Boolean) as (number | string)[];

    if (productIds.length > 0) {
      try {
        await fetch('https://atelier-api.farozelmo2436.workers.dev/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: Number(user.userId), productIds }),
        });
      } catch {}
    }
    completeCheckout();
    window.setTimeout(() => navigate('/downloads'), 360);
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-rose-600">Checkout</p>
        <h1 className="mt-2 text-4xl font-black">模拟结账流程</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <section className="panel">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">账号</h2>
              {!user && (
                <button onClick={onAuth} className="secondary-button">
                  登录
                </button>
              )}
            </div>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              {user ? (
                <p className="font-bold">
                  {user.name} <span className="text-slate-400">/ {user.email}</span>
                </p>
              ) : (
                <p className="text-sm text-slate-500">请先登录再购买，购买记录将保存到你的账号。</p>
              )}
            </div>
          </section>

          <section className="panel">
            <h2 className="text-xl font-black">支付方式</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                ['Mock Card', CreditCard],
                ['安全沙盒', ShieldCheck],
                ['加密结算', LockKeyhole]
              ].map(([label, Icon]) => (
                <div key={String(label)} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <Icon className="mb-3 text-teal-600" size={22} />
                  <p className="font-black">{String(label)}</p>
                  <p className="mt-1 text-xs text-slate-500">不会产生真实扣款</p>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <h2 className="text-xl font-black">订单商品</h2>
            <AnimatePresence>
              {cart.map((item) => {
                const product = getProduct(item.productId);
                if (!product) return null;
                return (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="mt-4 flex items-center gap-4 rounded-2xl bg-slate-50 p-3"
                  >
                    <img src={product.image} alt={product.title} className="h-16 w-16 rounded-2xl object-cover" />
                    <div className="flex-1">
                      <p className="font-black">{product.title}</p>
                      <p className="text-sm text-slate-500">数量 {item.quantity}</p>
                    </div>
                    <p className="font-black">{currency.format(product.price * item.quantity)}</p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {cart.length === 0 && <p className="mt-4 rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">购物车为空，请先选择商品。</p>}
          </section>
        </div>

        <aside className="h-fit rounded-[30px] bg-slate-950 p-6 text-white shadow-lift">
          <p className="text-sm font-bold text-white/60">Order Summary</p>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-white/60">合计</span>
            <span className="text-4xl font-black">{currency.format(total)}</span>
          </div>
          <div className="mt-6 space-y-3 text-sm text-white/70">
            {['需登录后购买，记录保存到云端', '购买后可在下载中心查看', '下次登录可重新下载'].map((item) => (
              <p key={item} className="flex items-center gap-2">
                <Check size={16} className="text-teal-300" /> {item}
              </p>
            ))}
          </div>
          <button disabled={cart.length === 0} onClick={pay} className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-4 font-black text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-45">
            <CreditCard size={18} />
            {user ? '模拟支付' : '登录后支付'}
          </button>
          {user && (
            <Link to="/downloads" className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-white/10 px-5 py-4 font-black text-white transition hover:bg-white/20">
              <Download size={18} />
              查看下载中心
            </Link>
          )}
        </aside>
      </div>
    </section>
  );
}

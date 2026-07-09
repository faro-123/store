import { Download, LogIn, PackageCheck, Search, ShoppingBag, Sparkles, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, NavLink } from 'react-router-dom';
import { useStore } from '../store/useStore';

type Props = {
  onCart: () => void;
  onAuth: () => void;
};

export default function Header({ onCart, onAuth }: Props) {
  const cartCount = useStore((state) => state.cart.reduce((sum, item) => sum + item.quantity, 0));
  const user = useStore((state) => state.user);

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-[#f7f5ef]/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="group flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white shadow-material">
            <Sparkles size={20} />
          </span>
          <span>
            <span className="block text-lg font-black tracking-tight">Atelier Store</span>
            <span className="hidden text-xs text-slate-500 sm:block">数字产品素材商店</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center rounded-full border border-white/70 bg-white/60 p-1 shadow-sm md:flex">
          {[
            ['/', '商店'],
            ['/checkout', '结账'],
            ['/downloads', '下载']
          ].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-slate-950 text-white' : 'text-slate-600 hover:text-slate-950'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <a href="/#catalog" className="icon-button" aria-label="搜索商品" title="搜索商品">
            <Search size={18} />
          </a>
          <Link to="/downloads" className="icon-button" aria-label="下载中心" title="下载中心">
            <Download size={18} />
          </Link>
          <button className="icon-button relative" onClick={onCart} aria-label="购物车" title="购物车">
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white"
              >
                {cartCount}
              </motion.span>
            )}
          </button>
          <button className="hidden items-center gap-2 rounded-full bg-white/70 px-3 py-2 text-sm font-bold shadow-sm ring-1 ring-white/80 sm:flex" onClick={onAuth}>
            {user ? <PackageCheck size={17} /> : <LogIn size={17} />}
            <span>{user ? user.name : '登录'}</span>
          </button>
          <button className="icon-button sm:hidden" onClick={onAuth} aria-label="账号" title="账号">
            <UserCircle size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import SearchOverlay from './components/SearchOverlay';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Downloads from './pages/Downloads';
import { useState, lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const isDev = import.meta.env.DEV;

export default function App() {
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-slate-950 bg-mesh">
      <Header onCart={() => setCartOpen(true)} onAuth={() => setAuthOpen(true)} onSearch={() => setSearchOpen(true)} />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home onAuth={() => setAuthOpen(true)} />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout onAuth={() => setAuthOpen(true)} />} />
            <Route path="/downloads" element={<Downloads />} />
            {isDev && (
              <Route path="/dashboard" element={<Suspense fallback={null}><Dashboard /></Suspense>} />
            )}
          </Routes>
        </motion.main>
      </AnimatePresence>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

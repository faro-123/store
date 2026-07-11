import { useEffect, useState, useCallback, useRef } from 'react';
import { BarChart3, ShoppingCart, Users, ShoppingBag } from 'lucide-react';
import { api } from '../services/api';
import StatCard from '../components/StatCard';
import RegChart from '../components/RegChart';
import PurchaseChart from '../components/PurchaseChart';
import ProductManager from '../components/ProductManager';

type Overview = { totalUsers: number; totalOrders: number; totalRevenue: number };
type UserInfo = { id: number; username: string; email: string | null; created_at: string };
type OrderInfo = { id: number; username: string; user_email: string | null; product_name: string; price: number; purchase_date: string };

const REFRESH_INTERVAL = 10000;

export default function Dashboard() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [registrations, setRegistrations] = useState<{ date: string; count: number }[]>([]);
  const [purchases, setPurchases] = useState<{ date: string; orders: number; revenue: number }[]>([]);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadData = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const [ov, r, p, u, o] = await Promise.all([
        api.getOverview(),
        api.getRegistrations(7),
        api.getPurchases(7),
        api.getUsers(),
        api.getOrderDetails(),
      ]);
      setOverview(ov);
      setRegistrations(r);
      setPurchases(p);
      setUsers(u);
      setOrders(o);
    } catch (e) {
      console.error('Dashboard load error', e);
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(true);
    intervalRef.current = setInterval(() => loadData(false), REFRESH_INTERVAL);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [loadData]);

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      await api.simulatePurchase();
      await loadData(true);
      setLoading(false);
    } catch (e) {
      console.error('Simulate error', e);
    } finally {
      setSimulating(false);
    }
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded-xl bg-slate-200" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl bg-slate-100" />)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-teal-600">Dashboard</p>
          <h1 className="mt-2 text-4xl font-black">数据概览</h1>
        </div>
        <button
          onClick={handleSimulate}
          disabled={simulating}
          className="flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600 disabled:opacity-50"
        >
          <ShoppingBag size={16} />
          {simulating ? '模拟中...' : '模拟购买'}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="注册用户" value={overview?.totalUsers ?? 0} accent="#f472b6" />
        <StatCard label="购买订单" value={overview?.totalOrders ?? 0} accent="#f59e0b" />
        <StatCard label="总收入" value={overview?.totalRevenue ?? 0} accent="#a855f7" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="panel">
          <div className="mb-3 flex items-center gap-2">
            <Users size={18} className="text-rose-400" />
            <h2 className="text-lg font-black">注册趋势（近7天）</h2>
          </div>
          <div className="h-[220px]">
            <RegChart data={registrations} />
          </div>
        </div>
        <div className="panel">
          <div className="mb-3 flex items-center gap-2">
            <BarChart3 size={18} className="text-amber-500" />
            <h2 className="text-lg font-black">购买趋势 + 收入（近7天）</h2>
          </div>
          <div className="h-[220px]">
            <PurchaseChart data={purchases} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="panel">
          <div className="flex items-center gap-2 mb-3">
            <Users size={18} className="text-rose-400" />
            <h2 className="text-lg font-black">注册用户列表</h2>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-2 pr-4 font-bold">用户名</th>
                  <th className="py-2 pr-4 font-bold">邮箱</th>
                  <th className="py-2 pr-4 font-bold">注册时间</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100">
                    <td className="py-2 pr-4 font-bold">{u.username}</td>
                    <td className="py-2 pr-4 text-slate-500">{u.email || '-'}</td>
                    <td className="py-2 pr-4 text-slate-500">{new Date(u.created_at).toLocaleString('zh-CN')}</td>
                  </tr>
                ))}
                {!users.length && (
                  <tr><td colSpan={3} className="py-8 text-center text-slate-400">暂无注册用户</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart size={18} className="text-amber-500" />
            <h2 className="text-lg font-black">购买记录</h2>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-2 pr-4 font-bold">用户</th>
                  <th className="py-2 pr-4 font-bold">邮箱</th>
                  <th className="py-2 pr-4 font-bold">商品</th>
                  <th className="py-2 pr-4 font-bold">价格</th>
                  <th className="py-2 pr-4 font-bold">时间</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-slate-100">
                    <td className="py-2 pr-4 font-bold">{o.username}</td>
                    <td className="py-2 pr-4 text-slate-500">{o.user_email || '-'}</td>
                    <td className="py-2 pr-4 text-slate-500">{o.product_name}</td>
                    <td className="py-2 pr-4 font-bold text-amber-600">¥{o.price}</td>
                    <td className="py-2 pr-4 text-xs text-slate-400">{new Date(o.purchase_date).toLocaleString('zh-CN')}</td>
                  </tr>
                ))}
                {!orders.length && (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-400">暂无购买记录，点击上方模拟购买</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <ProductManager />
      </div>
    </section>
  );
}

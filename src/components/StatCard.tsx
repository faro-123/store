import { TrendingUp, TrendingDown } from 'lucide-react';

type Props = {
  label: string;
  value: string | number;
  trend?: number;
  accent: string;
};

export default function StatCard({ label, value, trend, accent }: Props) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black" style={{ color: accent }}>
        {typeof value === 'number' && label.includes('收入') ? `¥${value.toLocaleString()}` : value.toLocaleString()}
      </p>
      {trend !== undefined && (
        <p className="mt-2 flex items-center gap-1 text-xs font-bold">
          {trend >= 0 ? (
            <TrendingUp size={14} className="text-emerald-500" />
          ) : (
            <TrendingDown size={14} className="text-rose-500" />
          )}
          <span className={trend >= 0 ? 'text-emerald-600' : 'text-rose-500'}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-slate-400">vs 上周</span>
        </p>
      )}
    </div>
  );
}

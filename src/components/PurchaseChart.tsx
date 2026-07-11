type DataPoint = { date: string; orders: number; revenue: number };

type Props = {
  data: DataPoint[];
  barColor?: string;
  lineColor?: string;
};

export default function PurchaseChart({ data, barColor = '#f59e0b', lineColor = '#a855f7' }: Props) {
  if (!data.length) return <p className="py-8 text-center text-sm text-slate-400">暂无购买数据</p>;

  const w = 500;
  const h = 200;
  const pad = { top: 20, right: 50, bottom: 30, left: 40 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;

  const maxOrders = Math.max(...data.map((d) => d.orders), 1);
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
  const barW = (innerW / data.length) * 0.6;
  const gap = (innerW / data.length) * 0.4;

  const points = data.map((d, i) => {
    const x = pad.left + i * (innerW / data.length) + gap / 2 + barW / 2;
    const y = pad.top + innerH - (d.revenue / maxRevenue) * innerH;
    return `${x},${y}`;
  });

  const labels = data.map((d) => {
    const d_ = new Date(d.date);
    return `${d_.getMonth() + 1}/${d_.getDate()}`;
  });

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full">
      {Array.from({ length: 4 }).map((_, i) => {
        const y = pad.top + (i / 3) * innerH;
        return (
          <g key={i}>
            <line x1={pad.left} y1={y} x2={w - pad.right} y2={y} stroke="#e2e8f0" strokeWidth="1" />
            <text x={pad.left - 8} y={y + 4} textAnchor="end" className="text-[10px] fill-slate-400">
              {Math.round(maxOrders - (i / 3) * maxOrders)}
            </text>
          </g>
        );
      })}

      {data.map((d, i) => {
        const barH = (d.orders / maxOrders) * innerH;
        const x = pad.left + i * (innerW / data.length) + gap / 2;
        const y = pad.top + innerH - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="3" fill={barColor} fillOpacity="0.7" />
            <text x={x + barW / 2} y={h - 6} textAnchor="middle" className="text-[10px] fill-slate-400">
              {labels[i]}
            </text>
          </g>
        );
      })}

      <polyline points={points.join(' ')} fill="none" stroke={lineColor} strokeWidth="2" strokeLinecap="round" strokeDasharray="5,3" />
      {data.map((d, i) => {
        const x = pad.left + i * (innerW / data.length) + gap / 2 + barW / 2;
        const y = pad.top + innerH - (d.revenue / maxRevenue) * innerH;
        return <circle key={i} cx={x} cy={y} r="3" fill={lineColor} stroke="white" strokeWidth="1.5" />;
      })}

      <rect x={w - pad.right - 90} y={6} width="8" height="8" rx="2" fill={barColor} fillOpacity="0.7" />
      <text x={w - pad.right - 78} y={14} className="text-[10px] fill-slate-500">订单</text>
      <line x1={w - pad.right - 50} y1={10} x2={w - pad.right - 38} y2={10} stroke={lineColor} strokeWidth="2" strokeDasharray="5,3" />
      <text x={w - pad.right - 34} y={14} className="text-[10px] fill-slate-500">收入</text>
    </svg>
  );
}

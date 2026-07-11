type DataPoint = { date: string; count: number };

type Props = {
  data: DataPoint[];
  color?: string;
};

export default function RegChart({ data, color = '#f472b6' }: Props) {
  if (!data.length) return <p className="py-8 text-center text-sm text-slate-400">暂无注册数据</p>;

  const w = 500;
  const h = 200;
  const pad = { top: 20, right: 20, bottom: 30, left: 40 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;

  const maxVal = Math.max(...data.map((d) => d.count), 1);
  const barW = (innerW / data.length) * 0.6;
  const gap = (innerW / data.length) * 0.4;

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
              {Math.round(maxVal - (i / 3) * maxVal)}
            </text>
          </g>
        );
      })}

      {data.map((d, i) => {
        const barH = (d.count / maxVal) * innerH;
        const x = pad.left + i * (innerW / data.length) + gap / 2;
        const y = pad.top + innerH - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="3" fill={color} fillOpacity="0.85" />
            <text x={x + barW / 2} y={h - 6} textAnchor="middle" className="text-[10px] fill-slate-400">
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

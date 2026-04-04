import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { groupByCategory, formatCurrency, CATEGORY_COLORS } from "../../utils/helpers";
import "./SpendingDonut.css";

export default function SpendingDonut() {
  const { state } = useApp();
  const data  = groupByCategory(state.transactions).slice(0, 7);
  const total = data.reduce((s, d) => s + d.amount, 0);
  const [hovered, setHovered] = useState(null);

  if (!data.length) {
    return (
      <div className="card">
        <div className="card-title">Spending Breakdown</div>
        <div className="empty-state"><i className="ri-pie-chart-2-line" /><p>No expense data</p></div>
      </div>
    );
  }

  const R = 72, IR = 46, cx = 100, cy = 100;
  let cumAngle = -90;

  const segments = data.map((d) => {
    const pct   = d.amount / total;
    const sweep = pct * 360 - 1.5;
    const toR   = (deg) => (deg * Math.PI) / 180;
    const s     = cumAngle;
    const e     = s + sweep;
    cumAngle   += pct * 360;

    const x1 = cx + R  * Math.cos(toR(s)), y1 = cy + R  * Math.sin(toR(s));
    const x2 = cx + R  * Math.cos(toR(e)), y2 = cy + R  * Math.sin(toR(e));
    const xi1= cx + IR * Math.cos(toR(e)), yi1= cy + IR * Math.sin(toR(e));
    const xi2= cx + IR * Math.cos(toR(s)), yi2= cy + IR * Math.sin(toR(s));
    const lg  = sweep > 180 ? 1 : 0;
    const path = `M ${x1} ${y1} A ${R} ${R} 0 ${lg} 1 ${x2} ${y2} L ${xi1} ${yi1} A ${IR} ${IR} 0 ${lg} 0 ${xi2} ${yi2} Z`;
    return { path, color: CATEGORY_COLORS[d.category] || "#94a3b8", category: d.category, amount: d.amount, pct };
  });

  const active = hovered !== null ? data[hovered] : null;

  return (
    <div className="card">
      <div className="card-title">Spending Breakdown</div>
      <div className="card-sub">Top categories by expense</div>
      <div className="donut-inner">
        <svg viewBox="0 0 200 200" width={176} height={176}>
          {segments.map((seg, i) => (
            <path
              key={i}
              d={seg.path}
              fill={seg.color}
              opacity={hovered === null || hovered === i ? 1 : 0.35}
              style={{ cursor: "pointer", transition: "opacity .2s" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
          <text x={cx} y={cy - 9} textAnchor="middle" fill="var(--text-3)" fontSize={9.5}
            fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600">
            {active ? active.category : "Total"}
          </text>
          <text x={cx} y={cx + 7} textAnchor="middle" fill="var(--text-1)" fontSize={13.5}
            fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800">
            {active ? `${Math.round(active.pct * 100)}%` : formatCurrency(total)}
          </text>
          {active && (
            <text x={cx} y={cx + 22} textAnchor="middle" fill="var(--text-3)" fontSize={8.5}
              fontFamily="JetBrains Mono, monospace">
              {formatCurrency(active.amount)}
            </text>
          )}
        </svg>

        <div className="donut-legend-list">
          {data.map((d, i) => (
            <div
              key={d.category}
              className="donut-legend-row"
              style={{ opacity: hovered === null || hovered === i ? 1 : .45, transition: "opacity .2s" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="dot" style={{ background: CATEGORY_COLORS[d.category] || "#94a3b8" }} />
              <span className="name">{d.category}</span>
              <span className="pct">{Math.round((d.amount / total) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

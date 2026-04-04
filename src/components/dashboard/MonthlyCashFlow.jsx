import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { groupByMonth, formatCurrency } from "../../utils/helpers";
import "./MonthlyCashFlow.css";

const W = 560, H = 180, PAD = { top: 16, right: 16, bottom: 32, left: 56 };

function scaleX(i, total) {
  const inner = W - PAD.left - PAD.right;
  return PAD.left + (total <= 1 ? inner / 2 : (i / (total - 1)) * inner);
}
function scaleY(val, min, max) {
  const inner = H - PAD.top - PAD.bottom;
  if (max === min) return PAD.top + inner / 2;
  return PAD.top + inner - ((val - min) / (max - min)) * inner;
}
function buildPath(points) {
  if (!points.length) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const cpx = (points[i - 1].x + points[i].x) / 2;
    d += ` C ${cpx} ${points[i - 1].y} ${cpx} ${points[i].y} ${points[i].x} ${points[i].y}`;
  }
  return d;
}
function buildArea(points, baseline) {
  if (!points.length) return "";
  return `${buildPath(points)} L ${points[points.length - 1].x} ${baseline} L ${points[0].x} ${baseline} Z`;
}

export default function MonthlyCashFlow() {
  const { state } = useApp();
  const data = groupByMonth(state.transactions);
  const [tooltip, setTooltip] = useState(null);

  if (!data.length) {
    return (
      <div className="card">
        <div className="card-title">Monthly Cash Flow</div>
        <div className="empty-state"><i className="ri-line-chart-line" /><p>No data yet</p></div>
      </div>
    );
  }

  const allVals = data.flatMap(d => [d.income, d.expense]);
  const minVal  = Math.min(...allVals) * 0.85;
  const maxVal  = Math.max(...allVals) * 1.08;

  const incPts = data.map((d, i) => ({ x: scaleX(i, data.length), y: scaleY(d.income,  minVal, maxVal) }));
  const expPts = data.map((d, i) => ({ x: scaleX(i, data.length), y: scaleY(d.expense, minVal, maxVal) }));

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => ({
    y:     scaleY(minVal + t * (maxVal - minVal), minVal, maxVal),
    label: formatCurrency(minVal + t * (maxVal - minVal)),
  }));

  return (
    <div className="card">
      <div className="card-title">Monthly Cash Flow</div>
      <div className="card-sub">Income vs Expenses over time</div>

      <div className="chart-legend">
        <div className="legend-dot"><span style={{ background: "var(--green)" }} />Income</div>
        <div className="legend-dot"><span style={{ background: "var(--red)" }} />Expenses</div>
      </div>

      <div className="line-chart-wrap" style={{ height: H }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="var(--green)" stopOpacity=".18" />
              <stop offset="100%" stopColor="var(--green)" stopOpacity="0"   />
            </linearGradient>
            <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="var(--red)" stopOpacity=".13" />
              <stop offset="100%" stopColor="var(--red)" stopOpacity="0"   />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line x1={PAD.left} y1={tick.y} x2={W - PAD.right} y2={tick.y}
                stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />
              <text x={PAD.left - 6} y={tick.y + 4} textAnchor="end"
                fill="var(--text-3)" fontSize="9" fontFamily="JetBrains Mono, monospace">
                {tick.label}
              </text>
            </g>
          ))}

          {/* X labels */}
          {data.map((d, i) => (
            <text key={i} x={scaleX(i, data.length)} y={H - 4} textAnchor="middle"
              fill="var(--text-3)" fontSize="9.5"
              fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600">
              {d.label.slice(0, 3)}
            </text>
          ))}

          {/* Areas */}
          <path d={buildArea(incPts, H - PAD.bottom)} fill="url(#incGrad)" />
          <path d={buildArea(expPts, H - PAD.bottom)} fill="url(#expGrad)" />

          {/* Lines */}
          <path d={buildPath(incPts)} fill="none" stroke="var(--green)" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" />
          <path d={buildPath(expPts)} fill="none" stroke="var(--red)" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" strokeOpacity=".85" />

          {/* Dots + hover targets */}
          {data.map((d, i) => (
            <g key={i}>
              <circle cx={incPts[i].x} cy={incPts[i].y} r="4"
                fill="var(--green)" stroke="var(--bg-card)" strokeWidth="2" />
              <circle cx={expPts[i].x} cy={expPts[i].y} r="4"
                fill="var(--red)" stroke="var(--bg-card)" strokeWidth="2" opacity=".85" />
              <rect
                x={scaleX(i, data.length) - 18} y={PAD.top}
                width="36" height={H - PAD.top - PAD.bottom}
                fill="transparent"
                style={{ cursor: "crosshair" }}
                onMouseEnter={() => setTooltip({ data: d, i })}
                onMouseLeave={() => setTooltip(null)}
              />
            </g>
          ))}
        </svg>

        {tooltip && (() => {
          const pct = (scaleX(tooltip.i, data.length) / W) * 100;
          return (
            <div className="chart-tooltip" style={{ left: `${pct}%`, top: "20px" }}>
              <strong>{tooltip.data.label}</strong>
              <div className="tip-income">
                <i className="ri-arrow-down-circle-line" /> {formatCurrency(tooltip.data.income)}
              </div>
              <div className="tip-expense">
                <i className="ri-arrow-up-circle-line" /> {formatCurrency(tooltip.data.expense)}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

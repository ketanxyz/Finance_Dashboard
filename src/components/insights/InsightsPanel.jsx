import { useApp } from "../../context/AppContext";
import {
  groupByMonth, groupByCategory, getSummary,
  formatCurrency, CATEGORY_COLORS, CATEGORY_ICONS,
} from "../../utils/helpers";
import "./InsightsPanel.css";

export default function InsightsPanel() {
  const { state }    = useApp();
  const { transactions } = state;
  const summary      = getSummary(transactions);
  const byMonth      = groupByMonth(transactions);
  const byCategory   = groupByCategory(transactions);

  const topCat      = byCategory[0] || null;
  const savingsRate = summary.income > 0
    ? ((summary.balance / summary.income) * 100).toFixed(1)
    : "0.0";
  const avgMonthExp = byMonth.length
    ? (byMonth.reduce((s, m) => s + m.expense, 0) / byMonth.length)
    : 0;
  const latest      = byMonth[byMonth.length - 1];
  const prev        = byMonth[byMonth.length - 2];
  const momChange   = latest && prev && prev.expense > 0
    ? (((latest.expense - prev.expense) / prev.expense) * 100).toFixed(1)
    : null;

  const maxExp = Math.max(...byMonth.map(m => m.expense), 1);
  const maxInc = Math.max(...byMonth.map(m => m.income),  1);
  const maxCat = byCategory[0]?.amount || 1;

  return (
    <div>
      {/* KPI row */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">
            <i className="ri-trophy-line" style={{ color: "var(--amber)" }} />
            Top Category
          </div>
          {topCat ? (
            <>
              <div className="kpi-val" style={{ color: CATEGORY_COLORS[topCat.category] }}>
                {topCat.category}
              </div>
              <div className="kpi-desc">{formatCurrency(topCat.amount)} spent</div>
            </>
          ) : <div className="kpi-desc">No data</div>}
        </div>

        <div className="kpi-card">
          <div className="kpi-label">
            <i className="ri-percent-line" style={{ color: "var(--brand)" }} />
            Savings Rate
          </div>
          <div className={`kpi-val ${parseFloat(savingsRate) >= 0 ? "green" : "red"}`}>
            {savingsRate}%
          </div>
          <div className="kpi-desc">
            {parseFloat(savingsRate) >= 30 ? "Excellent saving habit 🎉"
              : parseFloat(savingsRate) >= 10 ? "Decent — room to improve"
              : parseFloat(savingsRate) >= 0  ? "Low savings this period"
              : "Overspending — review expenses"}
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">
            <i className="ri-calendar-line" style={{ color: "var(--violet)" }} />
            Avg Monthly Expense
          </div>
          <div className="kpi-val red">{formatCurrency(Math.round(avgMonthExp))}</div>
          <div className="kpi-desc">Across {byMonth.length} month{byMonth.length !== 1 ? "s" : ""}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">
            <i className="ri-arrow-up-down-line" style={{ color: "var(--cyan)" }} />
            MoM Change
          </div>
          {momChange !== null ? (
            <>
              <div className={`kpi-val ${parseFloat(momChange) <= 0 ? "green" : "red"}`}>
                {parseFloat(momChange) > 0 ? "+" : ""}{momChange}%
              </div>
              <div className="kpi-desc">Expense vs previous month</div>
            </>
          ) : <div className="kpi-desc">Need ≥ 2 months of data</div>}
        </div>
      </div>

      {/* Monthly breakdown */}
      <div className="monthly-charts-grid">
        <div className="card">
          <div className="card-title">Monthly Expenses</div>
          <div className="card-sub">Month-by-month view</div>
          {!byMonth.length ? (
            <div className="empty-state" style={{ padding: "24px 0" }}>
              <i className="ri-bar-chart-line" /><p>No data</p>
            </div>
          ) : (
            <div className="progress-list">
              {byMonth.map(m => (
                <div key={m.month}>
                  <div className="progress-row-top">
                    <span className="name">{m.label}</span>
                    <span className="val" style={{ color: "var(--red)" }}>{formatCurrency(m.expense)}</span>
                  </div>
                  <div className="track">
                    <div className="fill"
                      style={{ width: `${(m.expense / maxExp) * 100}%`, background: "var(--red)", opacity: .75 }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title">Monthly Income</div>
          <div className="card-sub">Month-by-month view</div>
          {!byMonth.length ? (
            <div className="empty-state" style={{ padding: "24px 0" }}>
              <i className="ri-bar-chart-line" /><p>No data</p>
            </div>
          ) : (
            <div className="progress-list">
              {byMonth.map(m => (
                <div key={m.month}>
                  <div className="progress-row-top">
                    <span className="name">{m.label}</span>
                    <span className="val" style={{ color: "var(--green)" }}>{formatCurrency(m.income)}</span>
                  </div>
                  <div className="track">
                    <div className="fill"
                      style={{ width: `${(m.income / maxInc) * 100}%`, background: "var(--green)", opacity: .8 }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top categories */}
      <div className="card">
        <div className="card-title">Top Spending Categories</div>
        <div className="card-sub">Ranked by total amount spent</div>
        {!byCategory.length ? (
          <div className="empty-state"><i className="ri-pie-chart-2-line" /><p>No expense data</p></div>
        ) : (
          <div className="top-cat-list">
            {byCategory.slice(0, 8).map((d, i) => (
              <div key={d.category} className="top-cat-row">
                <div className="rank">#{i + 1}</div>
                <div className="cat-name">
                  <i className={CATEGORY_ICONS[d.category] || "ri-more-line"}
                    style={{ marginRight: 5, color: CATEGORY_COLORS[d.category] }} />
                  {d.category}
                </div>
                <div className="cat-track">
                  <div className="cat-fill"
                    style={{ width: `${(d.amount / maxCat) * 100}%`,
                      background: CATEGORY_COLORS[d.category] || "var(--brand)" }} />
                </div>
                <div className="cat-amount">{formatCurrency(d.amount)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

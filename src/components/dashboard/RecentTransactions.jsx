import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { formatCurrency, formatDate, CATEGORY_COLORS, CATEGORY_ICONS } from "../../utils/helpers";
import "./RecentTransactions.css";

export default function RecentTransactions() {
  const { state } = useApp();
  const navigate  = useNavigate();
  const recent    = [...state.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  return (
    <div className="card">
      <div className="recent-header">
        <div>
          <div className="card-title">Recent Transactions</div>
          <div className="card-sub recent-sub">Latest 6 entries</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("/transactions")}>
          View all <i className="ri-arrow-right-line" />
        </button>
      </div>

      {!recent.length ? (
        <div className="empty-state"><i className="ri-inbox-line" /><p>No transactions yet</p></div>
      ) : (
        <div className="recent-list">
          {recent.map((t) => (
            <div key={t.id} className="recent-item">
              <div
                className="recent-icon"
                style={{
                  background: (CATEGORY_COLORS[t.category] || "#94a3b8") + "22",
                  color: CATEGORY_COLORS[t.category] || "#94a3b8",
                }}
              >
                <i className={CATEGORY_ICONS[t.category] || "ri-more-line"} />
              </div>
              <div className="recent-info">
                <div className="desc">{t.description}</div>
                <div className="date">{formatDate(t.date)}</div>
              </div>
              <div className={`recent-amount ${t.type === "income" ? "inc" : "exp"}`}>
                {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useApp } from "../../context/AppContext";
import { getSummary, formatCurrency } from "../../utils/helpers";
import "./SummaryCards.css";

export default function SummaryCards() {
  const { state } = useApp();
  const { income, expense, balance } = getSummary(state.transactions);
  const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;
  const totalCount  = state.transactions.length;
  const incCount    = state.transactions.filter(t => t.type === "income").length;
  const expCount    = state.transactions.filter(t => t.type === "expense").length;

  return (
    <div className="summary-grid">
      {/* Balance */}
      <div className="stat-card">
        <div className="stat-card-top">
          <span className="stat-label">Net Balance</span>
          <span className="stat-icon" style={{ background: "var(--brand-soft)", color: "var(--brand)" }}>
            <i className="ri-wallet-3-line" />
          </span>
        </div>
        <div className="stat-amount" style={{ color: balance >= 0 ? "var(--green)" : "var(--red)" }}>
          {formatCurrency(balance)}
        </div>
        <div className="stat-meta">
          <span>{totalCount} transactions</span>
          <span className={`stat-badge ${savingsRate >= 0 ? "up" : "down"}`}>
            <i className={savingsRate >= 0 ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} />
            {Math.abs(savingsRate)}% saved
          </span>
        </div>
      </div>

      {/* Income */}
      <div className="stat-card">
        <div className="stat-card-top">
          <span className="stat-label">Total Income</span>
          <span className="stat-icon" style={{ background: "var(--green-soft)", color: "var(--green)" }}>
            <i className="ri-arrow-down-circle-line" />
          </span>
        </div>
        <div className="stat-amount" style={{ color: "var(--green)" }}>
          {formatCurrency(income)}
        </div>
        <div className="stat-meta">
          <i className="ri-file-list-3-line" />
          {incCount} income entries
        </div>
      </div>

      {/* Expenses */}
      <div className="stat-card">
        <div className="stat-card-top">
          <span className="stat-label">Total Expenses</span>
          <span className="stat-icon" style={{ background: "var(--red-soft)", color: "var(--red)" }}>
            <i className="ri-arrow-up-circle-line" />
          </span>
        </div>
        <div className="stat-amount" style={{ color: "var(--red)" }}>
          {formatCurrency(expense)}
        </div>
        <div className="stat-meta">
          <i className="ri-file-list-3-line" />
          {expCount} expense entries
        </div>
      </div>
    </div>
  );
}

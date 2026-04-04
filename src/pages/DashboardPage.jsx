import SummaryCards       from "../components/dashboard/SummaryCards";
import MonthlyCashFlow    from "../components/dashboard/MonthlyCashFlow";
import SpendingDonut      from "../components/dashboard/SpendingDonut";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import "./DashboardPage.css";

export default function DashboardPage() {
  return (
    <main className="page">
      <div className="page-header">
        <h2>Overview</h2>
        <p>Your financial summary at a glance</p>
      </div>
      <SummaryCards />
      <div className="charts-grid">
        <MonthlyCashFlow />
        <SpendingDonut />
      </div>
      <RecentTransactions />
    </main>
  );
}

import InsightsPanel from "../components/insights/InsightsPanel";
import "./InsightsPage.css";

export default function InsightsPage() {
  return (
    <main className="page">
      <div className="page-header">
        <h2>Insights</h2>
        <p>Understand your spending patterns and financial health</p>
      </div>
      <InsightsPanel />
    </main>
  );
}

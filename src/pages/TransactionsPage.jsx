import TransactionTable from "../components/transactions/TransactionTable";
import "./TransactionsPage.css";

export default function TransactionsPage() {
  return (
    <main className="page">
      <div className="page-header">
        <h2>Transactions</h2>
        <p>Manage and explore all your financial entries</p>
      </div>
      <TransactionTable />
    </main>
  );
}

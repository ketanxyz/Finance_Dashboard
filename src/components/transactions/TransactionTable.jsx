import { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { formatCurrency, formatDate, CATEGORIES, CATEGORY_ICONS, getMonths } from "../../utils/helpers";
import TransactionModal from "./TransactionModal";
import "./TransactionTable.css";

const PAGE_SIZE = 10;

function exportCSV(transactions) {
  const header = ["Date", "Description", "Category", "Type", "Amount"];
  const rows   = transactions.map(t => [t.date, `"${t.description}"`, t.category, t.type, t.amount]);
  const csv    = [header, ...rows].map(r => r.join(",")).join("\n");
  const url    = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  Object.assign(document.createElement("a"), { href: url, download: "transactions.csv" }).click();
  URL.revokeObjectURL(url);
}

export default function TransactionTable() {
  const { state, setSearch, setFilter, setSort, deleteTransaction } = useApp();
  const { transactions, search, filter, sort, role } = state;
  const isAdmin = role === "admin";

  const [page, setPage]             = useState(1);
  const [modal, setModal]           = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const months = useMemo(() => getMonths(transactions), [transactions]);

  const filtered = useMemo(() => {
    let r = [...transactions];
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(t => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    if (filter.type     !== "all") r = r.filter(t => t.type     === filter.type);
    if (filter.category !== "all") r = r.filter(t => t.category === filter.category);
    if (filter.month    !== "all") r = r.filter(t => t.date.slice(0, 7) === filter.month);

    r.sort((a, b) => {
      const dir = sort.direction === "asc" ? 1 : -1;
      if (sort.field === "date")   return dir * (new Date(a.date) - new Date(b.date));
      if (sort.field === "amount") return dir * (a.amount - b.amount);
      if (sort.field === "desc")   return dir * a.description.localeCompare(b.description);
      return 0;
    });
    return r;
  }, [transactions, search, filter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (field) => {
    setSort({ field, direction: sort.field === field && sort.direction === "asc" ? "desc" : "asc" });
    setPage(1);
  };

  const sortIcon = (field) => {
    if (sort.field !== field)
      return <i className="ri-expand-up-down-fill" style={{ opacity: .35, fontSize: ".7rem" }} />;
    return sort.direction === "asc"
      ? <i className="ri-arrow-up-s-fill"   style={{ color: "var(--brand)", fontSize: ".8rem" }} />
      : <i className="ri-arrow-down-s-fill" style={{ color: "var(--brand)", fontSize: ".8rem" }} />;
  };

  return (
    <div className="card">
      {/* Viewer banner */}
      {!isAdmin && (
        <div className="viewer-banner">
          <i className="ri-eye-line" />
          <span>You're in <strong>Viewer</strong> mode — read-only. Switch to Admin via the avatar to make changes.</span>
        </div>
      )}

      {/* Controls */}
      <div className="txn-controls">
        <div className="search-field">
          <i className="ri-search-2-line" />
          <input
            placeholder="Search description or category…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          {search && (
            <button className="clear-search" onClick={() => setSearch("")}>
              <i className="ri-close-circle-line" />
            </button>
          )}
        </div>

        <select className="filter-select" value={filter.type}
          onChange={e => { setFilter({ type: e.target.value }); setPage(1); }}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select className="filter-select" value={filter.category}
          onChange={e => { setFilter({ category: e.target.value }); setPage(1); }}>
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>

        <select className="filter-select" value={filter.month}
          onChange={e => { setFilter({ month: e.target.value }); setPage(1); }}>
          <option value="all">All Months</option>
          {months.map(m => {
            const lbl = new Date(m + "-01").toLocaleDateString("en-IN", { month: "short", year: "numeric" });
            return <option key={m} value={m}>{lbl}</option>;
          })}
        </select>

        <button className="export-btn" onClick={() => exportCSV(filtered)}>
          <i className="ri-download-2-line" /> Export CSV
        </button>

        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setModal({ mode: "add" })}>
            <i className="ri-add-line" /> Add Transaction
          </button>
        )}
      </div>

      {/* Table */}
      <div className="table-wrap">
        {!paged.length ? (
          <div className="empty-state">
            <i className="ri-file-search-line" />
            <p>No transactions match your filters.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th className={sort.field === "date"   ? "sorted" : ""} onClick={() => handleSort("date")}>
                  Date {sortIcon("date")}
                </th>
                <th className={sort.field === "desc"   ? "sorted" : ""} onClick={() => handleSort("desc")}>
                  Description {sortIcon("desc")}
                </th>
                <th>Category</th>
                <th>Type</th>
                <th className={sort.field === "amount" ? "sorted" : ""}
                  onClick={() => handleSort("amount")} style={{ textAlign: "right" }}>
                  Amount {sortIcon("amount")}
                </th>
                {isAdmin && <th style={{ textAlign: "right" }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paged.map(t => (
                <tr key={t.id}>
                  <td><span className="cell-date">{formatDate(t.date)}</span></td>
                  <td><span className="cell-desc">{t.description}</span></td>
                  <td>
                    <span className="cat-chip">
                      <i className={CATEGORY_ICONS[t.category] || "ri-more-line"} />
                      {t.category}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${t.type}`}>
                      <i className={t.type === "income" ? "ri-arrow-down-s-line" : "ri-arrow-up-s-line"} />
                      {t.type}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <span className={`cell-amt ${t.type === "income" ? "inc" : "exp"}`}>
                      {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                    </span>
                  </td>
                  {isAdmin && (
                    <td>
                      <div className="row-actions">
                        <button className="btn btn-ghost btn-sm btn-icon" title="Edit"
                          onClick={() => setModal({ mode: "edit", transaction: t })}>
                          <i className="ri-edit-2-line" />
                        </button>
                        <button className="btn btn-danger btn-sm btn-icon" title="Delete"
                          onClick={() => setConfirmDel(t.id)}>
                          <i className="ri-delete-bin-6-line" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <span className="page-info">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="page-btns">
            <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <i className="ri-arrow-left-s-line" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`page-btn${p === page ? " active" : ""}`} onClick={() => setPage(p)}>
                {p}
              </button>
            ))}
            <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              <i className="ri-arrow-right-s-line" />
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit modal */}
      {modal && (
        <TransactionModal mode={modal.mode} transaction={modal.transaction} onClose={() => setModal(null)} />
      )}

      {/* Delete confirm */}
      {confirmDel && (
        <div className="modal-overlay" onMouseDown={e => e.target === e.currentTarget && setConfirmDel(null)}>
          <div className="modal modal-sm">
            <div className="modal-header">
              <span className="modal-title">
                <i className="ri-delete-bin-6-line" style={{ marginRight: 7, color: "var(--red)" }} />
                Delete Transaction
              </span>
              <button className="modal-close" onClick={() => setConfirmDel(null)}>
                <i className="ri-close-line" />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: ".9rem", color: "var(--text-2)", lineHeight: 1.6 }}>
                This will permanently delete the transaction. This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setConfirmDel(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => { deleteTransaction(confirmDel); setConfirmDel(null); }}>
                <i className="ri-delete-bin-6-line" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

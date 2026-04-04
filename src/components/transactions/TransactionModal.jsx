import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES, generateId } from "../../utils/helpers";
import "./TransactionModal.css";

const BLANK = {
  date: new Date().toISOString().slice(0, 10),
  description: "",
  amount: "",
  category: "Food",
  type: "expense",
};

export default function TransactionModal({ mode, transaction, onClose }) {
  const { addTransaction, editTransaction } = useApp();
  const [form, setForm]   = useState(BLANK);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "edit" && transaction) {
      setForm({ ...transaction, amount: String(transaction.amount) });
    }
  }, [mode, transaction]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.description.trim())          return setError("Description is required.");
    if (!form.amount || +form.amount <= 0) return setError("Enter a valid positive amount.");
    if (!form.date)                        return setError("Date is required.");
    setError("");
    const t = { ...form, amount: parseFloat(form.amount), id: mode === "edit" ? form.id : generateId() };
    mode === "edit" ? editTransaction(t) : addTransaction(t);
    onClose();
  };

  return (
    <div className="modal-overlay" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">
            <i className={`ri-${mode === "edit" ? "edit-2" : "add-circle"}-line`}
              style={{ marginRight: 7, verticalAlign: "middle" }} />
            {mode === "edit" ? "Edit Transaction" : "New Transaction"}
          </span>
          <button className="modal-close" onClick={onClose}><i className="ri-close-line" /></button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="form-error">
              <i className="ri-error-warning-line" /> {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              className="form-input"
              placeholder="e.g. Monthly salary, Grocery run…"
              value={form.description}
              onChange={e => set("description", e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input
                className="form-input"
                type="number" min="0" placeholder="0"
                value={form.amount}
                onChange={e => set("amount", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                className="form-input"
                type="date" value={form.date}
                onChange={e => set("date", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" value={form.type} onChange={e => set("type", e.target.value)}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={e => set("category", e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            <i className={`ri-${mode === "edit" ? "save" : "add"}-line`} />
            {mode === "edit" ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}

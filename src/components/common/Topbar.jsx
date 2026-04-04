import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import "./Topbar.css";

const TITLES = {
  "/dashboard":    "Dashboard",
  "/transactions": "Transactions",
  "/insights":     "Insights",
};

const ROLES = [
  { id: "admin",  label: "Admin",  desc: "Full access — add, edit, delete", icon: "ri-shield-user-line", color: "var(--brand)", bg: "var(--brand-soft)", initial: "A" },
  { id: "viewer", label: "Viewer", desc: "Read-only access",                icon: "ri-eye-line",         color: "var(--green)", bg: "var(--green-soft)", initial: "V" },
];

export default function Topbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const { state, setRole } = useApp();
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);

  const title   = TITLES[pathname] ?? "Finsight";
  const dateStr = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
  const currentRole = ROLES.find(r => r.id === state.role) || ROLES[0];

  useEffect(() => {
    const handler = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="hamburger" onClick={onMenuClick} aria-label="Open menu">
          <i className="ri-menu-2-line" />
        </button>
        <span className="topbar-title">{title}</span>
      </div>

      <div className="topbar-right">
        <span className="topbar-date">
          <i className="ri-calendar-line" style={{ marginRight: 5, verticalAlign: "middle" }} />
          {dateStr}
        </span>

        <div className="avatar-wrap" ref={popoverRef}>
          <button
            className="topbar-avatar"
            title={`${currentRole.label} — click to switch role`}
            style={{ background: currentRole.color }}
            onClick={() => setOpen(o => !o)}
          >
            {currentRole.initial}
          </button>

          {open && (
            <div className="role-popover">
              <div className="role-popover-header">
                <i className="ri-user-settings-line" /> Switch Role
              </div>
              {ROLES.map(role => (
                <button
                  key={role.id}
                  className={`role-option${state.role === role.id ? " selected" : ""}`}
                  onClick={() => { setRole(role.id); setOpen(false); }}
                >
                  <div className="role-option-icon" style={{ background: role.bg, color: role.color }}>
                    <i className={role.icon} />
                  </div>
                  <div className="role-option-text">
                    <span className="role-option-name">{role.label}</span>
                    <span className="role-option-desc">{role.desc}</span>
                  </div>
                  {state.role === role.id && (
                    <i className="ri-check-line role-check" style={{ color: role.color }} />
                  )}
                </button>
              ))}
              <div className="role-popover-footer">
                <i className="ri-information-line" />
                Current: <strong>{currentRole.label}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

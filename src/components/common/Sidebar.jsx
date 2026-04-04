import { NavLink } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import "./Sidebar.css";

const navItems = [
  { to: "/dashboard",     icon: "ri-dashboard-3-line",    label: "Dashboard"    },
  { to: "/transactions",  icon: "ri-exchange-dollar-line", label: "Transactions" },
  { to: "/insights",      icon: "ri-bar-chart-box-line",   label: "Insights"     },
];

export default function Sidebar({ isOpen, onClose }) {
  const { state, toggleDarkMode } = useApp();

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar${isOpen ? " open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon"><i className="ri-funds-line" /></div>
          <div>
            <div className="logo-name">Finsight</div>
            <div className="logo-tag">Finance Dashboard</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="nav-group-label">Menu</div>
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              onClick={onClose}
            >
              <i className={icon} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="dark-toggle" onClick={toggleDarkMode}>
            <div className="dark-toggle-label">
              <i className={state.darkMode ? "ri-moon-fill" : "ri-sun-line"} />
              {state.darkMode ? "Dark Mode" : "Light Mode"}
            </div>
            <div className={`pill${state.darkMode ? " on" : ""}`}>
              <div className="pill-dot" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

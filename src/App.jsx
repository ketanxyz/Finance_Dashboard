import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import Layout from "./components/common/Layout";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import InsightsPage from "./pages/InsightsPage";
import './App.css';

function AppShell() {
  const { state } = useApp();

  useEffect(() => {
    document.documentElement.setAttribute("data-dark", state.darkMode);
  }, [state.darkMode]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"    element={<DashboardPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="insights"     element={<InsightsPage />} />
        <Route path="*"            element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

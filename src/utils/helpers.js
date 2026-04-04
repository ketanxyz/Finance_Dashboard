export const CATEGORY_COLORS = {
  Income:        "#22c55e",
  Housing:       "#6366f1",
  Food:          "#f59e0b",
  Transport:     "#3b82f6",
  Entertainment: "#ec4899",
  Utilities:     "#8b5cf6",
  Shopping:      "#f97316",
  Health:        "#14b8a6",
  Education:     "#06b6d4",
  Other:         "#94a3b8",
};

export const CATEGORY_ICONS = {
  Income:        "ri-money-dollar-circle-line",
  Housing:       "ri-home-4-line",
  Food:          "ri-restaurant-2-line",
  Transport:     "ri-car-line",
  Entertainment: "ri-movie-2-line",
  Utilities:     "ri-flashlight-line",
  Shopping:      "ri-shopping-bag-3-line",
  Health:        "ri-heart-pulse-line",
  Education:     "ri-book-open-line",
  Other:         "ri-more-line",
};

export const CATEGORIES = [
  "Food","Housing","Transport","Entertainment",
  "Utilities","Shopping","Health","Education","Income","Other",
];

export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(amount);

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

export const getMonthLabel = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", { month: "short", year: "numeric" });

export const groupByMonth = (transactions) => {
  const map = {};
  transactions.forEach((t) => {
    const key = t.date.slice(0, 7);
    if (!map[key]) map[key] = { income: 0, expense: 0, label: getMonthLabel(t.date) };
    if (t.type === "income") map[key].income += t.amount;
    else map[key].expense += t.amount;
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => ({ month: key, ...val }));
};

export const groupByCategory = (transactions) => {
  const map = {};
  transactions.filter((t) => t.type === "expense").forEach((t) => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => ({ category, amount }));
};

export const getSummary = (transactions) => {
  const income  = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  return { income, expense, balance: income - expense };
};

export const getMonths = (transactions) =>
  [...new Set(transactions.map((t) => t.date.slice(0, 7)))].sort();

export const generateId = () =>
  "t" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

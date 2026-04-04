import React, { createContext, useContext, useReducer, useEffect } from "react";
import initialTransactions from "../data/transactions.json";

const AppContext = createContext();

const ACTIONS = {
  ADD_TRANSACTION:    "ADD_TRANSACTION",
  EDIT_TRANSACTION:   "EDIT_TRANSACTION",
  DELETE_TRANSACTION: "DELETE_TRANSACTION",
  SET_FILTER:         "SET_FILTER",
  SET_SEARCH:         "SET_SEARCH",
  SET_SORT:           "SET_SORT",
  TOGGLE_DARK_MODE:   "TOGGLE_DARK_MODE",
  SET_ROLE:           "SET_ROLE",
};

const loadFromStorage = () => {
  try {
    const s = localStorage.getItem("finsight_v3");
    return s ? JSON.parse(s) : null;
  } catch { return null; }
};

const defaultState = {
  transactions: initialTransactions,
  filter: { type: "all", category: "all", month: "all" },
  search: "",
  sort: { field: "date", direction: "desc" },
  darkMode: false,
  role: "admin",
};

const initState = () => {
  const saved = loadFromStorage();
  if (saved) return {
    ...defaultState,
    transactions: saved.transactions ?? initialTransactions,
    darkMode: saved.darkMode ?? false,
    role: saved.role ?? "admin",
  };
  return defaultState;
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_TRANSACTION:    return { ...state, transactions: [payload, ...state.transactions] };
    case ACTIONS.EDIT_TRANSACTION:   return { ...state, transactions: state.transactions.map((t) => t.id === payload.id ? payload : t) };
    case ACTIONS.DELETE_TRANSACTION: return { ...state, transactions: state.transactions.filter((t) => t.id !== payload) };
    case ACTIONS.SET_FILTER:         return { ...state, filter: { ...state.filter, ...payload } };
    case ACTIONS.SET_SEARCH:         return { ...state, search: payload };
    case ACTIONS.SET_SORT:           return { ...state, sort: payload };
    case ACTIONS.TOGGLE_DARK_MODE:   return { ...state, darkMode: !state.darkMode };
    case ACTIONS.SET_ROLE:           return { ...state, role: payload };
    default: return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initState);

  useEffect(() => {
    localStorage.setItem("finsight_v3", JSON.stringify({
      transactions: state.transactions,
      darkMode: state.darkMode,
      role: state.role,
    }));
  }, [state.transactions, state.darkMode, state.role]);

  const value = {
    state,
    addTransaction:    (t)  => dispatch({ type: ACTIONS.ADD_TRANSACTION,    payload: t }),
    editTransaction:   (t)  => dispatch({ type: ACTIONS.EDIT_TRANSACTION,   payload: t }),
    deleteTransaction: (id) => dispatch({ type: ACTIONS.DELETE_TRANSACTION, payload: id }),
    setFilter:         (f)  => dispatch({ type: ACTIONS.SET_FILTER,         payload: f }),
    setSearch:         (s)  => dispatch({ type: ACTIONS.SET_SEARCH,         payload: s }),
    setSort:           (s)  => dispatch({ type: ACTIONS.SET_SORT,           payload: s }),
    toggleDarkMode:    ()   => dispatch({ type: ACTIONS.TOGGLE_DARK_MODE }),
    setRole:           (r)  => dispatch({ type: ACTIONS.SET_ROLE,           payload: r }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);

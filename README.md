# Finsight — Finance Dashboard

A modern finance dashboard built using React to understand how real-world financial data can be structured, visualized, and managed on the frontend.

The main focus of this project was to build a clean UI, handle state properly, and create interactive data visualizations without relying on heavy libraries.

---
# Live: https://finance-dashboard-two-theta.vercel.app/dashboard
---

## Tech Stack

- React 18  
- React Router DOM (v6)  
- Context API + useReducer  
- Vite  
- Remix Icons  
- Custom CSS (no UI frameworks)  
- LocalStorage (for persistence)  

---

## Getting Started

Clone the project and run locally:

```bash
npm install
npm run dev
```

App will run on:
```
http://localhost:5173
```

For production build:

```bash
npm run build
npm run preview
```

---

## Features

### Dashboard

- Summary cards (Balance, Income, Expenses)
- Monthly cash flow chart (custom SVG)
- Category-wise spending donut chart
- Recent transactions preview

---

### Transactions

- Search by description or category
- Filter by type, category, and month
- Sorting (date, amount, etc.)
- Pagination
- Add / Edit / Delete transactions
- Export filtered data as CSV

---

### Insights

- Key metrics like savings rate and top category
- Monthly comparison (income vs expense)
- Category breakdown with visual indicators

---

### UI / UX

- Dark mode (stored in localStorage)
- Fully responsive layout
- Smooth animations (modals, transitions)
- Proper empty states handling

---

## State Management

Used Context API with useReducer to manage:

- Transactions  
- Filters  
- Search  
- Sorting  
- Dark mode  

This keeps state predictable and avoids unnecessary complexity.

---

## Project Structure

```
src/
 ├── components/     # Reusable UI components
 ├── pages/          # Route-based pages
 ├── context/        # Global state management
 ├── utils/          # Helper functions
 ├── data/           # Mock transaction data
```

---

## What I Learned

- Structuring scalable React applications  
- Managing global state without external libraries  
- Building custom charts using SVG  
- Designing clean and responsive UI  

---

## Notes

- This is a frontend-only project  
- Data is mocked but structured realistically  
- No external chart libraries were used  

---

# Personal Expense Tracker

A full-stack, single-user expense tracking application built for a timed Software Engineer practical assessment. The app provides a clean interface to record daily spending, filter transactions, and review monthly totals with category breakdowns—all backed by a lightweight Express API and local JSON persistence.

---

## Features

- Add, edit, and delete expenses with inline validation
- Expense list sorted newest-first (by date, then recency)
- Filter by category, title search, and date range
- Monthly summary with total spent and category breakdown
- Indian Rupee formatting (`en-IN`, e.g. ₹1,250)
- User-friendly validation messages and invalid-field highlighting
- Empty states for no data and no filter matches
- Loading, saving, and delete confirmation states
- Responsive card-based layout (plain CSS)
- Accessibility: semantic HTML, labels, and ARIA attributes where appropriate

---

## Tech Stack

### Frontend

- React 18
- Vite
- Axios
- Plain CSS (no UI framework)

### Backend

- Node.js
- Express 4
- CORS enabled for local development

### Persistence

- Local JSON file (`server/data/expenses.json`)
- Async read/write via `fs/promises`

---

## Project Structure

```
expense-tracker/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── styles.css
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── Summary.jsx
│       │   ├── ExpenseForm.jsx
│       │   ├── Filters.jsx
│       │   ├── ExpenseList.jsx
│       │   └── ExpenseItem.jsx
│       ├── services/
│       │   └── api.js
│       └── utils/
│           ├── category.js
│           ├── date.js
│           ├── format.js
│           └── sortExpenses.js
│
└── server/
    ├── package.json
    ├── data/
    │   └── expenses.json
    └── src/
        ├── index.js
        ├── routes/
        │   └── expenses.js
        └── utils/
            ├── fileStore.js
            └── validate.js
```

---

## Setup Instructions

Run the backend and frontend in separate terminals. The API must be running before using the client.

### Backend

```bash
cd server
npm install
npm run dev
```

API base URL: `http://localhost:3001`

Production start (no file watch):

```bash
npm start
```

### Frontend

```bash
cd client
npm install
npm run dev
```

App URL: `http://localhost:5173`

Production build:

```bash
npm run build
npm run preview
```

---

## API Endpoints

Base URL: `http://localhost:3001`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/expenses` | List all expenses |
| `POST` | `/expenses` | Create a new expense |
| `PUT` | `/expenses/:id` | Update an expense by ID |
| `DELETE` | `/expenses/:id` | Delete an expense by ID |
| `GET` | `/health` | Health check |

### Expense object

```json
{
  "id": "uuid",
  "title": "Groceries",
  "amount": 450,
  "category": "Food",
  "date": "2026-05-26",
  "note": "Weekly shop"
}
```

### Categories

`Food`, `Transport`, `Shopping`, `Bills`, `Entertainment`, `Other`

### Example requests

**Create**

```bash
curl -X POST http://localhost:3001/expenses \
  -H "Content-Type: application/json" \
  -d '{"title":"Coffee","amount":120,"category":"Food","date":"2026-05-26","note":""}'
```

**List**

```bash
curl http://localhost:3001/expenses
```

**Update**

```bash
curl -X PUT http://localhost:3001/expenses/<id> \
  -H "Content-Type: application/json" \
  -d '{"amount":150}'
```

**Delete**

```bash
curl -X DELETE http://localhost:3001/expenses/<id>
```

Responses use a consistent shape: `{ "success": true, "data": ... }` on success; validation errors return `400` with an `errors` array.

---

## Design Decisions and Tradeoffs

**JSON file storage instead of a database**  
Chosen for simplicity and fast local setup within the assessment time constraint. No database installation, migrations, or ORM configuration required. Data remains human-readable on disk at `server/data/expenses.json`.

**Client-side filtering and summary**  
Filtering and monthly aggregation run in the browser. For a single-user app with a small expected dataset, this avoids extra API complexity and keeps the backend focused on CRUD and persistence.

**Plain CSS**  
No component library or utility framework was added to reduce dependency overhead and maintain direct control over layout, spacing, and responsive behavior.

**Centralized utilities on the frontend**  
Shared modules handle currency formatting (`format.js`), date validation (`date.js`), category normalization (`category.js`), and list sorting (`sortExpenses.js`) to keep components readable and behavior consistent.

**ES Modules throughout**  
Both `client` and `server` use `"type": "module"` for a consistent import style across the stack.

---

## Validation and Edge Cases Handled

| Area | Handling |
|------|----------|
| Empty title | Required with a clear message |
| Amount | Must be positive; negative input blocked in the form |
| Category | Required; normalized for case-insensitive matching |
| Invalid dates | Calendar validation (e.g. invalid day/month) |
| Leap years | Specific message for Feb 29 in non-leap years |
| Future dates | Rejected on the expense form |
| Filter date range | “From” cannot be after “To” |
| Empty states | No expenses yet vs no filter matches |
| Double submit | Submit disabled while saving |
| Date reset after add | Form resets to today’s date (local timezone) |
| Sorting ties | Same-day expenses ordered by recency (create/update) |
| API errors | Surfaced in a dismissible error banner |

---

## Known Limitations

- Single-user application; no multi-tenant or user accounts
- No authentication or authorization
- No persistent database; data lives in a local JSON file
- No automated tests (unit or integration)
- No pagination; all expenses load at once
- No deployment or production hardening documented
- CORS restricted to `http://localhost:5173` for development

---

## Future Improvements

- PostgreSQL or MongoDB with a proper data layer
- User authentication and per-user expense isolation
- Charts and spending analytics over time
- Export to CSV or PDF
- Unit and integration test coverage
- Pagination and server-side filtering for larger datasets
- Environment-based configuration and deployment guide

---

## License

This project was built as a practical assessment submission. Use and extend as needed for evaluation or portfolio purposes.

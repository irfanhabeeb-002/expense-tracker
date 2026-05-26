# Expense Tracker – Backend

A minimal Express.js REST API that stores expenses in a local JSON file.

---

## Folder Structure

```
server/
├── data/
│   └── expenses.json          # Flat-file database (auto-created if missing)
├── src/
│   ├── index.js               # Express app entry point
│   ├── routes/
│   │   └── expenses.js        # GET / POST / PUT / DELETE handlers
│   └── utils/
│       ├── fileStore.js       # Async JSON read & write helpers
│       └── validate.js        # Expense payload validation
└── package.json
```

---

## Installation

```bash
cd server
npm install
```

---

## Running the Server

**Development (auto-restarts on file change – Node 18+):**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

The server starts at **http://localhost:3001**

---

## API Reference

### Health Check

```
GET /health
```

---

### List all expenses

```
GET /expenses
```

Response: `200 OK`

```json
{
  "success": true,
  "data": [ ...expenses sorted newest-first... ]
}
```

---

### Create an expense

```
POST /expenses
Content-Type: application/json
```

**Required fields:** `title`, `amount` (> 0), `category`, `date`  
**Optional fields:** `note`

**Valid categories:** `Food`, `Transport`, `Shopping`, `Bills`, `Entertainment`, `Other`

Body example:

```json
{
  "title": "Coffee",
  "amount": 3.50,
  "category": "Food",
  "date": "2024-05-20",
  "note": "Morning latte"
}
```

Response: `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "title": "Coffee",
    "amount": 3.5,
    "category": "Food",
    "date": "2024-05-20",
    "note": "Morning latte"
  }
}
```

---

### Update an expense (partial or full)

```
PUT /expenses/:id
Content-Type: application/json
```

Only send the fields you want to change.

```json
{ "amount": 4.00, "note": "Large latte" }
```

Response: `200 OK` with the updated expense object.

---

### Delete an expense

```
DELETE /expenses/:id
```

Response: `200 OK` with the deleted expense object.

---

## API Testing with curl

```bash
# 1 – Health check
curl http://localhost:3001/health

# 2 – Create an expense
curl -X POST http://localhost:3001/expenses \
  -H "Content-Type: application/json" \
  -d '{"title":"Groceries","amount":45.00,"category":"Food","date":"2024-05-20"}'

# 3 – List all expenses
curl http://localhost:3001/expenses

# 4 – Update (replace <ID> with the id from step 2)
curl -X PUT http://localhost:3001/expenses/<ID> \
  -H "Content-Type: application/json" \
  -d '{"amount":50.00,"note":"Weekly shop"}'

# 5 – Delete
curl -X DELETE http://localhost:3001/expenses/<ID>

# 6 – Validation error (missing title)
curl -X POST http://localhost:3001/expenses \
  -H "Content-Type: application/json" \
  -d '{"amount":10,"category":"Food","date":"2024-05-20"}'
```

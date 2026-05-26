import express from 'express';
import cors from 'cors';
import expensesRouter from './routes/expenses.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────────────────

// Allow requests from the React dev server (localhost:5173) during development
app.use(cors({ origin: 'http://localhost:5173' }));

// Parse incoming JSON request bodies
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/expenses', expensesRouter);

// Health-check — useful to verify the server is up
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 handler (unknown routes) ──────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ── Global error handler ──────────────────────────────────────────────────────
// Express requires exactly 4 arguments to recognise this as an error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[Server Error]', err.message);
  res.status(500).json({
    success: false,
    message: err.message || 'An unexpected error occurred.',
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Expense Tracker API running at http://localhost:${PORT}`);
});

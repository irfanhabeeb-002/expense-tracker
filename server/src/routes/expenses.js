import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readExpenses, writeExpenses } from '../utils/fileStore.js';
import { validateExpense } from '../utils/validate.js';

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /expenses
// Returns the full list of expenses, newest-first.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const expenses = await readExpenses();
    // Sort descending by date so the frontend always gets a sensible order
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json({ success: true, data: expenses });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /expenses
// Creates a new expense and persists it.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const { valid, errors } = validateExpense(req.body);
    if (!valid) {
      return res.status(400).json({ success: false, errors });
    }

    const { title, amount, category, date, note } = req.body;

    const newExpense = {
      id: uuidv4(),
      title: title.trim(),
      amount: Number(amount),
      category,
      date,
      note: note ? String(note).trim() : '',
    };

    const expenses = await readExpenses();
    expenses.push(newExpense);
    await writeExpenses(expenses);

    res.status(201).json({ success: true, data: newExpense });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /expenses/:id
// Partially or fully updates an existing expense.
// ─────────────────────────────────────────────────────────────────────────────
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const expenses = await readExpenses();
    const index = expenses.findIndex((e) => e.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: `Expense with id "${id}" not found.` });
    }

    // isUpdate = true → only validate fields that are actually present
    const { valid, errors } = validateExpense(req.body, true);
    if (!valid) {
      return res.status(400).json({ success: false, errors });
    }

    const { title, amount, category, date, note } = req.body;

    // Merge — only overwrite fields that were provided
    const updated = {
      ...expenses[index],
      ...(title !== undefined && { title: title.trim() }),
      ...(amount !== undefined && { amount: Number(amount) }),
      ...(category !== undefined && { category }),
      ...(date !== undefined && { date }),
      ...(note !== undefined && { note: String(note).trim() }),
    };

    expenses[index] = updated;
    await writeExpenses(expenses);

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /expenses/:id
// Removes an expense by ID.
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const expenses = await readExpenses();
    const index = expenses.findIndex((e) => e.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: `Expense with id "${id}" not found.` });
    }

    const [deleted] = expenses.splice(index, 1);
    await writeExpenses(expenses);

    res.json({ success: true, data: deleted });
  } catch (err) {
    next(err);
  }
});

export default router;

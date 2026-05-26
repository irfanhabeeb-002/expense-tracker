import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import Summary from './components/Summary.jsx';
import ExpenseForm from './components/ExpenseForm.jsx';
import Filters from './components/Filters.jsx';
import ExpenseList from './components/ExpenseList.jsx';
import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from './services/api.js';

const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Other',
];

const DEFAULT_FILTERS = {
  category: '',
  search: '',
  dateFrom: '',
  dateTo: '',
};

function filterExpenses(expenses, filters) {
  return expenses.filter((expense) => {
    if (filters.category && expense.category !== filters.category) return false;

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      if (!expense.title.toLowerCase().includes(q)) return false;
    }

    if (filters.dateFrom && expense.date < filters.dateFrom) return false;
    if (filters.dateTo && expense.date > filters.dateTo) return false;

    return true;
  });
}

function sortNewestFirst(expenses) {
  return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchExpenses();
      setExpenses(sortNewestFirst(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const filteredExpenses = useMemo(
    () => sortNewestFirst(filterExpenses(expenses, filters)),
    [expenses, filters]
  );

  async function handleSubmit(payload, id) {
    setSaving(true);
    setError('');
    try {
      if (id) {
        const updated = await updateExpense(id, payload);
        setExpenses((prev) =>
          sortNewestFirst(prev.map((e) => (e.id === id ? updated : e)))
        );
        setEditingExpense(null);
      } else {
        const created = await createExpense(payload);
        setExpenses((prev) => sortNewestFirst([...prev, created]));
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setDeletingId(id);
    setError('');
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      if (editingExpense?.id === id) setEditingExpense(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  function handleEdit(expense) {
    setEditingExpense(expense);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingExpense(null);
  }

  return (
    <div className="app">
      <Header />

      {error && (
        <div className="banner banner--error" role="alert">
          <p>{error}</p>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setError('')}>
            Dismiss
          </button>
        </div>
      )}

      <main className="app__main">
        <aside className="app__sidebar">
          <Summary expenses={expenses} />
          <ExpenseForm
            categories={CATEGORIES}
            editingExpense={editingExpense}
            onSubmit={handleSubmit}
            onCancelEdit={handleCancelEdit}
            saving={saving}
          />
        </aside>

        <section className="app__content">
          <Filters categories={CATEGORIES} filters={filters} onChange={setFilters} />
          <ExpenseList
            expenses={filteredExpenses}
            loading={loading}
            hasExpenses={expenses.length > 0}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        </section>
      </main>
    </div>
  );
}

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
import {
  sortExpensesNewestFirst,
  buildRecencyMap,
  bumpRecency,
} from './utils/sortExpenses.js';
import { CATEGORIES, normalizeCategory } from './utils/category.js';

const DEFAULT_FILTERS = {
  category: '',
  search: '',
  dateFrom: '',
  dateTo: '',
};

function filterExpenses(expenses, filters) {
  const invalidDateRange =
    filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo;

  if (invalidDateRange) return [];

  return expenses.filter((expense) => {
    if (filters.category && normalizeCategory(expense.category) !== filters.category) {
      return false;
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      if (!expense.title.toLowerCase().includes(q)) return false;
    }

    if (filters.dateFrom && expense.date < filters.dateFrom) return false;
    if (filters.dateTo && expense.date > filters.dateTo) return false;

    return true;
  });
}

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [recencyById, setRecencyById] = useState(() => new Map());

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchExpenses();
      const recency = buildRecencyMap(data);
      setRecencyById(recency);
      setExpenses(sortExpensesNewestFirst(data, recency));
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
    () => sortExpensesNewestFirst(filterExpenses(expenses, filters), recencyById),
    [expenses, filters, recencyById]
  );

  async function handleSubmit(payload, id) {
    setSaving(true);
    setError('');
    try {
      if (id) {
        const updated = await updateExpense(id, payload);
        setRecencyById((prev) => {
          const nextRecency = bumpRecency(prev, updated.id);
          setExpenses((prevExpenses) => {
            const rest = prevExpenses.filter((e) => e.id !== id);
            return sortExpensesNewestFirst([...rest, updated], nextRecency);
          });
          return nextRecency;
        });
        setEditingExpense(null);
      } else {
        const created = await createExpense(payload);
        setRecencyById((prev) => {
          const nextRecency = bumpRecency(prev, created.id);
          setExpenses((prevExpenses) =>
            sortExpensesNewestFirst([...prevExpenses, created], nextRecency)
          );
          return nextRecency;
        });
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
      setRecencyById((prev) => {
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
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
            recencyById={recencyById}
            loading={loading}
            hasExpenses={expenses.length > 0}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
            actionsDisabled={saving || loading}
          />
        </section>
      </main>
    </div>
  );
}

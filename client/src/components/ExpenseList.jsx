import ExpenseItem from './ExpenseItem.jsx';
import { sortExpensesNewestFirst } from '../utils/sortExpenses.js';

export default function ExpenseList({
  expenses,
  recencyById,
  loading,
  hasExpenses,
  onEdit,
  onDelete,
  deletingId,
  actionsDisabled,
}) {
  if (loading) {
    return (
      <section className="card expense-list" aria-live="polite" aria-busy="true">
        <p className="state-message">Loading your expenses…</p>
      </section>
    );
  }

  if (!hasExpenses) {
    return (
      <section className="card expense-list expense-list--empty">
        <div className="empty-state">
          <span className="empty-state__icon" aria-hidden="true">
            ◇
          </span>
          <h2 className="empty-state__title">No expenses added yet</h2>
          <p className="empty-state__text">
            Start by adding your first expense using the form on the left.
          </p>
        </div>
      </section>
    );
  }

  const sortedExpenses = recencyById
    ? sortExpensesNewestFirst(expenses, recencyById)
    : expenses;

  if (sortedExpenses.length === 0) {
    return (
      <section className="card expense-list expense-list--empty">
        <div className="empty-state">
          <span className="empty-state__icon" aria-hidden="true">
            ◇
          </span>
          <h2 className="empty-state__title">No matching expenses</h2>
          <p className="empty-state__text">
            No expenses match your current filters. Try changing or clearing them.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="expense-list" aria-label="Expense list">
      <div className="expense-list__header">
        <h2 className="expense-list__title">Expenses</h2>
        <span className="expense-list__count">
          {sortedExpenses.length} {sortedExpenses.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>
      <ul className="expense-list__items">
        {sortedExpenses.map((expense) => (
          <li key={expense.id}>
            <ExpenseItem
              expense={expense}
              onEdit={onEdit}
              onDelete={onDelete}
              deleting={deletingId === expense.id}
              disabled={actionsDisabled}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

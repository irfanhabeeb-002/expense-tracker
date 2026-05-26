import ExpenseItem from './ExpenseItem.jsx';

export default function ExpenseList({
  expenses,
  loading,
  hasExpenses,
  onEdit,
  onDelete,
  deletingId,
}) {
  if (loading) {
    return (
      <section className="card expense-list" aria-live="polite">
        <p className="state-message">Loading expenses…</p>
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
          <h2 className="empty-state__title">No expenses yet</h2>
          <p className="empty-state__text">
            Add your first expense using the form on the left to start tracking.
          </p>
        </div>
      </section>
    );
  }

  if (expenses.length === 0) {
    return (
      <section className="card expense-list expense-list--empty">
        <div className="empty-state">
          <span className="empty-state__icon" aria-hidden="true">
            ◇
          </span>
          <h2 className="empty-state__title">No expenses found</h2>
          <p className="empty-state__text">
            Try adjusting your filters or search terms.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="expense-list" aria-label="Expense list">
      <p className="expense-list__count">
        {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
      </p>
      <ul className="expense-list__items">
        {expenses.map((expense) => (
          <li key={expense.id}>
            <ExpenseItem
              expense={expense}
              onEdit={onEdit}
              onDelete={onDelete}
              deleting={deletingId === expense.id}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

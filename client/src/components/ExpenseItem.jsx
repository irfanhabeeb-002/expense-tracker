import { useState } from 'react';

function formatMoney(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ExpenseItem({ expense, onEdit, onDelete, deleting }) {
  const [confirming, setConfirming] = useState(false);

  function handleDeleteClick() {
    setConfirming(true);
  }

  function handleConfirm() {
    onDelete(expense.id);
    setConfirming(false);
  }

  function handleCancel() {
    setConfirming(false);
  }

  return (
    <article className="expense-item">
      <div className="expense-item__main">
        <div className="expense-item__top">
          <h3 className="expense-item__title">{expense.title}</h3>
          <span className="expense-item__amount">{formatMoney(expense.amount)}</span>
        </div>

        <div className="expense-item__meta">
          <span className={`badge badge--${expense.category.toLowerCase()}`}>
            {expense.category}
          </span>
          <time className="expense-item__date" dateTime={expense.date}>
            {formatDate(expense.date)}
          </time>
        </div>

        {expense.note && <p className="expense-item__note">{expense.note}</p>}
      </div>

      <div className="expense-item__actions">
        {confirming ? (
          <div className="expense-item__confirm">
            <span className="expense-item__confirm-text">Delete this expense?</span>
            <button
              type="button"
              className="btn btn--danger btn--sm"
              onClick={handleConfirm}
              disabled={deleting}
            >
              {deleting ? 'Deleting…' : 'Yes, delete'}
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={handleCancel}
              disabled={deleting}
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => onEdit(expense)}>
              Edit
            </button>
            <button type="button" className="btn btn--ghost btn--sm btn--danger-text" onClick={handleDeleteClick}>
              Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
}

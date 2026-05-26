import { useState } from 'react';
import { formatINR, formatDateIN } from '../utils/format.js';
import { normalizeCategory } from '../utils/category.js';

export default function ExpenseItem({ expense, onEdit, onDelete, deleting, disabled }) {
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
          <span className="expense-item__amount">{formatINR(expense.amount)}</span>
        </div>

        <div className="expense-item__meta">
          <span className="badge" data-category={normalizeCategory(expense.category)}>
            {normalizeCategory(expense.category)}
          </span>
          <time className="expense-item__date" dateTime={expense.date}>
            {formatDateIN(expense.date)}
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
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => onEdit(expense)}
              disabled={disabled || deleting}
              aria-label={`Edit ${expense.title}`}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm btn--danger-text"
              onClick={handleDeleteClick}
              disabled={disabled || deleting}
              aria-label={`Delete ${expense.title}`}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
}

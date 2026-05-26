import { useEffect, useState } from 'react';

const EMPTY_FORM = {
  title: '',
  amount: '',
  category: 'Food',
  date: '',
  note: '',
};

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function validateForm(fields) {
  const errors = {};

  if (!fields.title?.trim()) {
    errors.title = 'Title is required.';
  }

  const amount = Number(fields.amount);
  if (fields.amount === '' || Number.isNaN(amount) || amount <= 0) {
    errors.amount = 'Amount must be a positive number.';
  }

  if (!fields.category) {
    errors.category = 'Category is required.';
  }

  if (!fields.date) {
    errors.date = 'Date is required.';
  } else if (Number.isNaN(new Date(fields.date).getTime())) {
    errors.date = 'Please enter a valid date.';
  }

  return errors;
}

export default function ExpenseForm({
  categories,
  editingExpense,
  onSubmit,
  onCancelEdit,
  saving,
}) {
  const [fields, setFields] = useState({ ...EMPTY_FORM, date: todayISO() });
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(editingExpense);

  useEffect(() => {
    if (editingExpense) {
      setFields({
        title: editingExpense.title,
        amount: String(editingExpense.amount),
        category: editingExpense.category,
        date: editingExpense.date,
        note: editingExpense.note || '',
      });
    } else {
      setFields({ ...EMPTY_FORM, date: todayISO() });
    }
    setErrors({});
  }, [editingExpense]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateForm(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      title: fields.title.trim(),
      amount: Number(fields.amount),
      category: fields.category,
      date: fields.date,
      note: fields.note.trim(),
    };

    const ok = await onSubmit(payload, isEditing ? editingExpense.id : null);
    if (ok && !isEditing) {
      setFields({ ...EMPTY_FORM, date: todayISO() });
      setErrors({});
    }
  }

  return (
    <section className="card expense-form" aria-labelledby="form-heading">
      <div className="expense-form__header">
        <h2 id="form-heading" className="card__title">
          {isEditing ? 'Edit expense' : 'Add expense'}
        </h2>
        {isEditing && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form__group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={fields.title}
            onChange={handleChange}
            placeholder="e.g. Groceries"
            autoComplete="off"
          />
          {errors.title && <p className="form__error">{errors.title}</p>}
        </div>

        <div className="form__row">
          <div className="form__group">
            <label htmlFor="amount">Amount</label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={fields.amount}
              onChange={handleChange}
              placeholder="0.00"
            />
            {errors.amount && <p className="form__error">{errors.amount}</p>}
          </div>

          <div className="form__group">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={fields.category} onChange={handleChange}>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="form__error">{errors.category}</p>}
          </div>
        </div>

        <div className="form__group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            name="date"
            type="date"
            value={fields.date}
            onChange={handleChange}
          />
          {errors.date && <p className="form__error">{errors.date}</p>}
        </div>

        <div className="form__group">
          <label htmlFor="note">
            Note <span className="form__optional">(optional)</span>
          </label>
          <textarea
            id="note"
            name="note"
            rows={2}
            value={fields.note}
            onChange={handleChange}
            placeholder="Add a short note…"
          />
        </div>

        <button type="submit" className="btn btn--primary btn--full" disabled={saving}>
          {saving ? 'Saving…' : isEditing ? 'Update expense' : 'Add expense'}
        </button>
      </form>
    </section>
  );
}

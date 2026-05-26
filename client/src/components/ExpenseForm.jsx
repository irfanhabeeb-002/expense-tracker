import { useEffect, useState } from 'react';
import { validateISODate, dateInputErrorMessage, todayISO } from '../utils/date.js';

function getDefaultFormFields() {
  return {
    title: '',
    amount: '',
    category: 'Food',
    date: todayISO(),
    note: '',
  };
}

function validateForm(fields, dateBadInput = false) {
  const errors = {};
  const title = fields.title?.trim() ?? '';

  if (!title) {
    errors.title = 'Please enter an expense title';
  }

  const amountRaw = fields.amount;
  if (amountRaw === '' || amountRaw === null || amountRaw === undefined) {
    errors.amount = 'Please enter an amount';
  } else {
    const amount = Number(amountRaw);
    if (Number.isNaN(amount)) {
      errors.amount = 'Please enter a valid number';
    } else if (amount <= 0) {
      errors.amount = 'Amount should be greater than 0';
    }
  }

  if (!fields.category) {
    errors.category = 'Please choose a category';
  }

  if (!fields.date) {
    errors.date = dateBadInput ? 'Please enter a valid date' : 'Please pick a date';
  } else {
    const dateResult = validateISODate(fields.date);
    if (!dateResult.ok) {
      errors.date = dateResult.message;
    } else if (fields.date > todayISO()) {
      errors.date = 'Date cannot be in the future';
    }
  }

  return errors;
}

function fieldGroupClass(hasError) {
  return `form__group${hasError ? ' form__group--invalid' : ''}`;
}

export default function ExpenseForm({
  categories,
  editingExpense,
  onSubmit,
  onCancelEdit,
  saving,
}) {
  const [fields, setFields] = useState(getDefaultFormFields);
  const [errors, setErrors] = useState({});
  const [dateBadInput, setDateBadInput] = useState(false);
  const [formResetKey, setFormResetKey] = useState(0);

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
      setFields(getDefaultFormFields());
      setFormResetKey((key) => key + 1);
    }
    setErrors({});
    setDateBadInput(false);
  }, [editingExpense]);

  function resetAddForm() {
    setFields(getDefaultFormFields());
    setErrors({});
    setDateBadInput(false);
    setFormResetKey((key) => key + 1);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));

    if (name === 'date') {
      const input = e.target;
      setDateBadInput(input.validity.badInput);

      if (input.validity.badInput) {
        setErrors((prev) => ({
          ...prev,
          date: dateInputErrorMessage(value, { badInput: true }),
        }));
        return;
      }
      if (!value) {
        setErrors((prev) => ({ ...prev, date: undefined }));
        return;
      }
      const check = validateISODate(value);
      setErrors((prev) => ({ ...prev, date: check.ok ? undefined : check.message }));
      return;
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleAmountChange(e) {
    const { value } = e.target;
    // Block negative values and non-numeric characters except one decimal point
    if (value !== '' && (value.startsWith('-') || !/^\d*\.?\d*$/.test(value))) {
      return;
    }
    setFields((prev) => ({ ...prev, amount: value }));
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return;

    const validationErrors = validateForm(fields, dateBadInput);
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
      resetAddForm();
    }
  }

  return (
    <section
      className={`card expense-form${isEditing ? ' expense-form--editing' : ''}`}
      aria-labelledby="form-heading"
    >
      <div className="expense-form__header">
        <div>
          <h2 id="form-heading" className="card__title">
            {isEditing ? 'Editing expense' : 'Add expense'}
          </h2>
          {isEditing && (
            <p className="expense-form__editing-label" id="editing-label">
              Updating: <strong>{editingExpense.title}</strong>
            </p>
          )}
        </div>
        {isEditing && (
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={onCancelEdit}
            disabled={saving}
            aria-label="Cancel editing"
          >
            Cancel
          </button>
        )}
      </div>

      <form className="form" onSubmit={handleSubmit} noValidate aria-busy={saving}>
        <div className={fieldGroupClass(errors.title)}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={fields.title}
            onChange={handleChange}
            placeholder="e.g. Groceries"
            autoComplete="off"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
          {errors.title && (
            <p id="title-error" className="form__error" role="alert">
              {errors.title}
            </p>
          )}
        </div>

        <div className="form__row">
          <div className={fieldGroupClass(errors.amount)}>
            <label htmlFor="amount">Amount (₹)</label>
            <input
              id="amount"
              name="amount"
              type="text"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={fields.amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              aria-invalid={Boolean(errors.amount)}
              aria-describedby={errors.amount ? 'amount-error' : undefined}
            />
            {errors.amount && (
              <p id="amount-error" className="form__error" role="alert">
                {errors.amount}
              </p>
            )}
          </div>

          <div className={fieldGroupClass(errors.category)}>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={fields.category}
              onChange={handleChange}
              aria-invalid={Boolean(errors.category)}
              aria-describedby={errors.category ? 'category-error' : undefined}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p id="category-error" className="form__error" role="alert">
                {errors.category}
              </p>
            )}
          </div>
        </div>

        <div className={fieldGroupClass(errors.date)}>
          <label htmlFor="date">Date</label>
          <input
            key={`expense-date-${formResetKey}`}
            id="date"
            name="date"
            type="date"
            value={fields.date}
            max={todayISO()}
            onChange={handleChange}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? 'date-error' : undefined}
          />
          {errors.date && (
            <p id="date-error" className="form__error" role="alert">
              {errors.date}
            </p>
          )}
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

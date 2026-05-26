import { useState } from 'react';
import { validateISODate } from '../utils/date.js';

export default function Filters({ categories, filters, onChange }) {
  const [dateRangeError, setDateRangeError] = useState('');

  function validateDateRange(from, to) {
    if (from) {
      const fromCheck = validateISODate(from);
      if (!fromCheck.ok) return fromCheck.message;
    }
    if (to) {
      const toCheck = validateISODate(to);
      if (!toCheck.ok) return toCheck.message;
    }
    if (from && to && from > to) {
      return '“From” date cannot be after “To” date';
    }
    return '';
  }

  function handleChange(e) {
    const { name, value } = e.target;
    const input = e.target;

    if ((name === 'dateFrom' || name === 'dateTo') && input.validity.badInput) {
      setDateRangeError('Please enter a valid date');
      return;
    }

    const next = { ...filters, [name]: value };
    setDateRangeError(validateDateRange(next.dateFrom, next.dateTo));
    onChange(next);
  }

  function handleClear() {
    setDateRangeError('');
    onChange({
      category: '',
      search: '',
      dateFrom: '',
      dateTo: '',
    });
  }

  const hasActiveFilters =
    filters.category || filters.search || filters.dateFrom || filters.dateTo;

  const invalidDateRange = Boolean(dateRangeError);

  return (
    <section className="card filters" aria-labelledby="filters-heading">
      <div className="filters__header">
        <h2 id="filters-heading" className="card__title">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={handleClear}
            aria-label="Clear all filters"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="filters__grid">
        <div className="form__group">
          <label htmlFor="search">Search title</label>
          <input
            id="search"
            name="search"
            type="search"
            placeholder="Search by title…"
            value={filters.search}
            onChange={handleChange}
            aria-label="Search expenses by title"
          />
        </div>

        <div className="form__group">
          <label htmlFor="filter-category">Category</label>
          <select
            id="filter-category"
            name="category"
            value={filters.category}
            onChange={handleChange}
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className={`form__group${invalidDateRange ? ' form__group--invalid' : ''}`}>
          <label htmlFor="dateFrom">From</label>
          <input
            id="dateFrom"
            name="dateFrom"
            type="date"
            value={filters.dateFrom}
            max={filters.dateTo || undefined}
            onChange={handleChange}
            aria-invalid={invalidDateRange}
            aria-describedby={invalidDateRange ? 'date-range-error' : undefined}
          />
        </div>

        <div className={`form__group${invalidDateRange ? ' form__group--invalid' : ''}`}>
          <label htmlFor="dateTo">To</label>
          <input
            id="dateTo"
            name="dateTo"
            type="date"
            value={filters.dateTo}
            min={filters.dateFrom || undefined}
            onChange={handleChange}
            aria-invalid={invalidDateRange}
            aria-describedby={invalidDateRange ? 'date-range-error' : undefined}
          />
        </div>
      </div>

      {dateRangeError && (
        <p id="date-range-error" className="form__error filters__date-error" role="alert">
          {dateRangeError}
        </p>
      )}
    </section>
  );
}

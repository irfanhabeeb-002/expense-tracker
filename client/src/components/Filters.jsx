export default function Filters({ categories, filters, onChange }) {
  function handleChange(e) {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  }

  function handleClear() {
    onChange({
      category: '',
      search: '',
      dateFrom: '',
      dateTo: '',
    });
  }

  const hasActiveFilters =
    filters.category || filters.search || filters.dateFrom || filters.dateTo;

  return (
    <section className="card filters" aria-labelledby="filters-heading">
      <div className="filters__header">
        <h2 id="filters-heading" className="card__title">
          Filters
        </h2>
        {hasActiveFilters && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={handleClear}>
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
          />
        </div>

        <div className="form__group">
          <label htmlFor="filter-category">Category</label>
          <select
            id="filter-category"
            name="category"
            value={filters.category}
            onChange={handleChange}
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form__group">
          <label htmlFor="dateFrom">From</label>
          <input
            id="dateFrom"
            name="dateFrom"
            type="date"
            value={filters.dateFrom}
            onChange={handleChange}
          />
        </div>

        <div className="form__group">
          <label htmlFor="dateTo">To</label>
          <input
            id="dateTo"
            name="dateTo"
            type="date"
            value={filters.dateTo}
            onChange={handleChange}
          />
        </div>
      </div>
    </section>
  );
}

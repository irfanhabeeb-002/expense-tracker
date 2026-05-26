const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function isCurrentMonth(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

function formatMoney(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export default function Summary({ expenses }) {
  const now = new Date();
  const monthLabel = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;

  const monthExpenses = expenses.filter((e) => isCurrentMonth(e.date));
  const total = monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const byCategory = monthExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
    return acc;
  }, {});

  const breakdown = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

  return (
    <section className="card summary" aria-labelledby="summary-heading">
      <h2 id="summary-heading" className="card__title">
        Monthly summary
      </h2>
      <p className="summary__period">{monthLabel}</p>

      <div className="summary__total">
        <span className="summary__total-label">Total spent</span>
        <span className="summary__total-value">{formatMoney(total)}</span>
      </div>

      {breakdown.length === 0 ? (
        <p className="summary__empty">No expenses recorded this month yet.</p>
      ) : (
        <ul className="summary__breakdown">
          {breakdown.map(([category, amount]) => (
            <li key={category} className="summary__row">
              <span className={`badge badge--${category.toLowerCase()}`}>{category}</span>
              <span className="summary__amount">{formatMoney(amount)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

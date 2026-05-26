import { formatINR } from '../utils/format.js';
import { CATEGORIES, normalizeCategory } from '../utils/category.js';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Compare YYYY-MM-DD to current month without UTC timezone shifts. */
function isCurrentMonth(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const [year, month] = dateStr.split('-').map(Number);
  if (!year || !month) return false;
  const now = new Date();
  return year === now.getFullYear() && month === now.getMonth() + 1;
}

function aggregateByCategory(monthExpenses) {
  const totals = {};

  for (const expense of monthExpenses) {
    const category = normalizeCategory(expense.category);
    totals[category] = (totals[category] || 0) + Number(expense.amount);
  }

  return totals;
}

export default function Summary({ expenses }) {
  const now = new Date();
  const monthLabel = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;

  const monthExpenses = expenses.filter((e) => isCurrentMonth(e.date));
  const total = monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const byCategory = aggregateByCategory(monthExpenses);

  // Always derive breakdown from the canonical category list so none are skipped
  const breakdown = CATEGORIES.map((category) => [category, byCategory[category] || 0])
    .filter(([, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <section className="card summary" aria-labelledby="summary-heading">
      <h2 id="summary-heading" className="card__title">
        Monthly summary
      </h2>
      <p className="summary__period">{monthLabel}</p>

      <div className="summary__total">
        <span className="summary__total-label">Total spent this month</span>
        <span className="summary__total-value">{formatINR(total)}</span>
      </div>

      {breakdown.length === 0 ? (
        <p className="summary__empty">No expenses recorded this month yet.</p>
      ) : (
        <>
        <h3 className="summary__breakdown-title">By category</h3>
        <ul className="summary__breakdown">
          {breakdown.map(([category, amount]) => (
            <li key={category} className="summary__row">
              <span className="badge" data-category={category}>
                {category}
              </span>
              <span className="summary__amount">{formatINR(amount)}</span>
            </li>
          ))}
        </ul>
        </>
      )}
    </section>
  );
}

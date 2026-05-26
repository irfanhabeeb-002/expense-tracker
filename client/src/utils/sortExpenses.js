/** Assign stable recency ranks from array order (later index = newer). */
export function buildRecencyMap(expenses) {
  const map = new Map();
  expenses.forEach((expense, index) => {
    map.set(expense.id, index);
  });
  return map;
}

/** Mark an expense as the most recently created/updated. */
export function bumpRecency(map, id) {
  const next = new Map(map);
  let maxRank = -1;
  for (const rank of next.values()) {
    if (rank > maxRank) maxRank = rank;
  }
  next.set(id, maxRank + 1);
  return next;
}

/**
 * Newest first: date descending, then higher recency rank first.
 * @param {Array} expenses
 * @param {Map<string, number>} recencyById
 */
export function sortExpensesNewestFirst(expenses, recencyById) {
  return [...expenses].sort((a, b) => {
    const byDate = b.date.localeCompare(a.date);
    if (byDate !== 0) return byDate;

    const rankA = recencyById.get(a.id) ?? 0;
    const rankB = recencyById.get(b.id) ?? 0;
    return rankB - rankA;
  });
}

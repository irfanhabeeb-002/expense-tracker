export const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Other',
];

const CANONICAL_BY_KEY = Object.fromEntries(
  CATEGORIES.map((cat) => [cat.toLowerCase(), cat])
);

/** Map any casing/spacing to the canonical category label. */
export function normalizeCategory(category) {
  if (!category || typeof category !== 'string') return 'Other';
  const trimmed = category.trim();
  return CANONICAL_BY_KEY[trimmed.toLowerCase()] || trimmed;
}

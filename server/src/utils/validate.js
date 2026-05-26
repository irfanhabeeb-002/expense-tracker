const VALID_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

/**
 * Validate an expense payload.
 * Returns { valid: true } or { valid: false, errors: [...] }
 *
 * @param {object} data - Raw request body
 * @param {boolean} isUpdate - When true, every field is optional
 */
export function validateExpense(data, isUpdate = false) {
  const errors = [];

  // ── title ─────────────────────────────────────────────────
  if (!isUpdate || data.title !== undefined) {
    if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
      errors.push('title is required and must be a non-empty string.');
    }
  }

  // ── amount ────────────────────────────────────────────────
  if (!isUpdate || data.amount !== undefined) {
    const amount = Number(data.amount);
    if (data.amount === undefined || data.amount === null || isNaN(amount) || amount <= 0) {
      errors.push('amount is required and must be a positive number.');
    }
  }

  // ── category ──────────────────────────────────────────────
  if (!isUpdate || data.category !== undefined) {
    if (!data.category || !VALID_CATEGORIES.includes(data.category)) {
      errors.push(
        `category is required and must be one of: ${VALID_CATEGORIES.join(', ')}.`
      );
    }
  }

  // ── date ──────────────────────────────────────────────────
  if (!isUpdate || data.date !== undefined) {
    if (!data.date) {
      errors.push('date is required.');
    } else {
      const parsed = new Date(data.date);
      if (isNaN(parsed.getTime())) {
        errors.push('date must be a valid ISO 8601 date string (e.g. 2024-05-20).');
      }
    }
  }

  if (errors.length > 0) return { valid: false, errors };
  return { valid: true };
}

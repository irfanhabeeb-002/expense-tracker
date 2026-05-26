/** Today's date in local YYYY-MM-DD (no UTC drift). */
export function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Validate YYYY-MM-DD as a real calendar date (local).
 * Returns { ok: true } or { ok: false, message }.
 */
export function validateISODate(value) {
  if (!value || typeof value !== 'string') {
    return { ok: false, message: 'Please pick a date' };
  }

  const trimmed = value.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);

  if (!match) {
    return { ok: false, message: 'Please enter a valid date' };
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (month === 2 && day === 29 && !isLeapYear(year)) {
    return { ok: false, message: 'February 29 is only valid in leap years' };
  }

  const parsed = new Date(year, month - 1, day);
  const isRealDate =
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day;

  if (!isRealDate) {
    return { ok: false, message: 'Please enter a valid date' };
  }

  return { ok: true };
}

/** Message when the browser reports a malformed date input (e.g. 29/02/2026). */
export function dateInputErrorMessage(value, { badInput = false } = {}) {
  if (value) {
    const result = validateISODate(value);
    if (!result.ok) return result.message;
  }
  if (badInput) {
    return 'Please enter a valid date';
  }
  return 'Please pick a date';
}

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '../../data/expenses.json');

/**
 * Read all expenses from the JSON file.
 * Returns an empty array if the file is missing or corrupt.
 */
export async function readExpenses() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    // If file doesn't exist yet, start with an empty list
    if (err.code === 'ENOENT') return [];
    throw new Error('Failed to read expenses data.');
  }
}

/**
 * Overwrite the JSON file with the given array of expenses.
 * @param {Array} expenses
 */
export async function writeExpenses(expenses) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(expenses, null, 2), 'utf-8');
  } catch {
    throw new Error('Failed to save expenses data.');
  }
}

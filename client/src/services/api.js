import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
});

function getErrorMessage(error) {
  const data = error.response?.data;
  if (data?.errors?.length) return data.errors.join(' ');
  if (data?.message) return data.message;
  if (error.message) return error.message;
  return 'Something went wrong. Please try again.';
}

export async function fetchExpenses() {
  try {
    const { data } = await api.get('/expenses');
    return data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createExpense(expense) {
  try {
    const { data } = await api.post('/expenses', expense);
    return data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateExpense(id, expense) {
  try {
    const { data } = await api.put(`/expenses/${id}`, expense);
    return data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteExpense(id) {
  try {
    const { data } = await api.delete(`/expenses/${id}`);
    return data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

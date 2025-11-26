import {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpensesByCategory,
  getMonthlySummary,
} from '#services/expense.service.js';
import { success, error } from '#utils/responseHandler.js';

const create = async (req, res) => {
  const { amount, category, description, date } = req.body;

  if (!amount || !category || !date) {
    return error(res, 'Amount, category, and date are required', 400);
  }

  try {
    const expense = await createExpense(
      req.user.id,
      amount,
      category,
      description,
      date
    );
    success(res, { expense }, 'Expense created', 201);
  } catch {
    error(res, 'Failed to create expense', 500);
  }
};

const getAll = async (req, res) => {
  try {
    const expenses = await getAllExpenses(req.user.id);
    success(res, { expenses }, 'Expenses retrieved');
  } catch {
    error(res, 'Failed to fetch expenses', 500);
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await getExpenseById(id, req.user.id);

    if (!expense) {
      return error(res, 'Expense not found', 404);
    }

    success(res, { expense }, 'Expense retrieved');
  } catch {
    error(res, 'Failed to fetch expense', 500);
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { amount, category, description, date } = req.body;

  try {
    const expense = await updateExpense(
      id,
      req.user.id,
      amount,
      category,
      description,
      date
    );

    if (!expense) {
      return error(res, 'Expense not found', 404);
    }

    success(res, { expense }, 'Expense updated');
  } catch {
    error(res, 'Failed to update expense', 500);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await deleteExpense(id, req.user.id);

    if (!expense) {
      return error(res, 'Expense not found', 404);
    }

    success(res, null, 'Expense deleted');
  } catch {
    error(res, 'Failed to delete expense', 500);
  }
};

const getByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const expenses = await getExpensesByCategory(req.user.id, category);
    success(res, { expenses }, 'Expenses retrieved');
  } catch {
    error(res, 'Failed to fetch expenses', 500);
  }
};

const getSummary = async (req, res) => {
  const { year, month } = req.query;

  try {
    const summary = await getMonthlySummary(req.user.id, year, month);
    success(res, summary, 'Summary retrieved');
  } catch {
    error(res, 'Failed to fetch summary', 500);
  }
};

export { create, getAll, getOne, update, remove, getByCategory, getSummary };

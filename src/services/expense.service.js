import { pool } from '#config/database.config.js';

const createExpense = async (userId, amount, category, description, date) => {
  const result = await pool.query(
    'INSERT INTO expenses (user_id, amount, category, description, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userId, amount, category, description || null, date]
  );
  return result.rows[0];
};

const getAllExpenses = async userId => {
  const result = await pool.query(
    'SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC',
    [userId]
  );
  return result.rows;
};

const getExpenseById = async (expenseId, userId) => {
  const result = await pool.query(
    'SELECT * FROM expenses WHERE id = $1 AND user_id = $2',
    [expenseId, userId]
  );
  return result.rows[0];
};

const updateExpense = async (
  expenseId,
  userId,
  amount,
  category,
  description,
  date
) => {
  const result = await pool.query(
    'UPDATE expenses SET amount = COALESCE($1, amount), category = COALESCE($2, category), description = COALESCE($3, description), date = COALESCE($4, date) WHERE id = $5 AND user_id = $6 RETURNING *',
    [amount, category, description, date, expenseId, userId]
  );
  return result.rows[0];
};

const deleteExpense = async (expenseId, userId) => {
  const result = await pool.query(
    'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *',
    [expenseId, userId]
  );
  return result.rows[0];
};

const getExpensesByCategory = async (userId, category) => {
  const result = await pool.query(
    'SELECT * FROM expenses WHERE user_id = $1 AND category = $2 ORDER BY date DESC',
    [userId, category]
  );
  return result.rows;
};

const getMonthlySummary = async (userId, year, month) => {
  const categoryResult = await pool.query(
    `SELECT 
      category,
      SUM(amount) as total,
      COUNT(*) as count
    FROM expenses
    WHERE user_id = $1 
      AND EXTRACT(YEAR FROM date) = $2 
      AND EXTRACT(MONTH FROM date) = $3
    GROUP BY category
    ORDER BY total DESC`,
    [userId, year, month]
  );

  const totalResult = await pool.query(
    `SELECT SUM(amount) as total
    FROM expenses
    WHERE user_id = $1 
      AND EXTRACT(YEAR FROM date) = $2 
      AND EXTRACT(MONTH FROM date) = $3`,
    [userId, year, month]
  );

  return {
    year,
    month,
    total: totalResult.rows[0].total || 0,
    byCategory: categoryResult.rows,
  };
};

export {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpensesByCategory,
  getMonthlySummary,
};

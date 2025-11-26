import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '#config/database.config.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '#config/jwt.config.js';

const registerUser = async (username, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
    [username, email, hashedPassword]
  );

  return result.rows[0];
};

const loginUser = async (username, password) => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [
    username,
  ]);

  if (result.rowCount === 0) {
    throw new Error('Invalid credentials');
  }

  const user = result.rows[0];
  const validPassword = await bcrypt.compare(password, user.password_hash);

  if (!validPassword) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    token,
    user: { id: user.id, username: user.username, email: user.email },
  };
};

export { registerUser, loginUser };

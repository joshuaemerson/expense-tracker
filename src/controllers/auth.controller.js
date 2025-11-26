import { registerUser, loginUser } from '#services/auth.service.js';
import { success, error } from '#utils/responseHandler.js';

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return error(res, 'All fields are required', 400);
  }

  try {
    const user = registerUser(username, email, password);
    success(res, { user }, 'User registered successfully', 201);
  } catch (err) {
    if (err.code === '23505') {
      return error(res, 'Username or email already exists', 409);
    }
    error(res, 'Registration failed', 500);
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return error(res, 'Username and password required', 400);
  }

  try {
    const result = await loginUser(username, password);
    success(res, result, 'Login successful');
  } catch (err) {
    error(res, err.message, 401);
  }
};

export { register, login };

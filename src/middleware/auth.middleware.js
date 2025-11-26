import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '#config/jwt.config.js';
import { error } from '#utils/responseHandler.js';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return error(res, 'Access token required', 401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return error(res, 'Invalid or expired token', 403);
    }
    ((req.user = user), next());
  });
};

export { authenticateToken };

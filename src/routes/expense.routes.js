import express from 'express';
import { authenticateToken } from '#middleware/auth.middleware.js';
import {
  create,
  getAll,
  getOne,
  update,
  remove,
  getByCategory,
  getSummary,
} from '#controllers/expense.controller.js';

const router = express.Router();

// All expense routes require authentication
router.use(authenticateToken);

router.post('/', create);
router.get('/', getAll);
router.get('/summary/monthly', getSummary);
router.get('/category/:category', getByCategory);
router.get('/:id', getOne);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;

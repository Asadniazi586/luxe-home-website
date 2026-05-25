import express from 'express';
import {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryCount,
} from '../controllers/categoryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', getCategoryById);

// Admin only routes
router.post('/', protect, admin, createCategory);
router.put('/:id', protect, admin, updateCategory);
router.put('/:id/count', protect, admin, updateCategoryCount);
router.delete('/:id', protect, admin, deleteCategory);

export default router;
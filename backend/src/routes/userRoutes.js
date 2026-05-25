import express from 'express';
import { getUsers, getUserById, deleteUser, updateUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router
  .route('/:id')
  .get(protect, admin, getUserById)
  .delete(protect, admin, deleteUser)
  .put(protect, admin, updateUser);

export default router;
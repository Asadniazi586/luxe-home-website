import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getNotifications);
router.route('/read-all').put(protect, admin, markAllAsRead);
router.route('/:id/read').put(protect, admin, markAsRead);
router.route('/:id').delete(protect, admin, deleteNotification);

export default router;
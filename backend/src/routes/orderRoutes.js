// backend/routes/orderRoutes.js
import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus, // Add this import
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, admin, getAllOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
// Add this new route for general status update
router.route('/:id/status').put(protect, admin, updateOrderStatus);

export default router;
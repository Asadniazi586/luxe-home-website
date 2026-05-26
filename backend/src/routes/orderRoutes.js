import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  getOrderByLastEight,
  getOrderByNumber,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, admin, getAllOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/last-eight/:lastEight').get(protect, getOrderByLastEight);
router.route('/by-number/:orderNumber').get(protect, getOrderByNumber);

export default router;
import express from 'express';
import { 
  registerUser, 
  loginUser, 
  adminLogin, 
  adminLogout,
  logout,
  refreshAccessToken,
  getCurrentUser,
  getUserProfile, 
  updateUserProfile 
} from '../controllers/authController.js';
import { forgotPassword, resetPassword } from '../controllers/passwordController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logout);
router.get('/me', getCurrentUser);
router.post('/admin/login', adminLogin);
router.post('/admin/logout', adminLogout);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
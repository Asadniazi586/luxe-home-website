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
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshAccessToken); // NEW: Refresh token endpoint
router.post('/logout', logout); // NEW: Unified logout
router.get('/me', getCurrentUser); // NEW: Get current user from cookie
router.post('/admin/login', adminLogin);
router.post('/admin/logout', adminLogout);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

export default router;
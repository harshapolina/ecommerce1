import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/userController.js';
import { sendOTP, verifyOTP } from '../controllers/otpController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter, otpLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/send-otp', otpLimiter, sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/signup', registerUser);
router.post('/login', authLimiter, loginUser);
router.get('/profile', protect, getUserProfile);

export default router;

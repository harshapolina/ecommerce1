import express from 'express';
import { createOrder, verifyPayment, getUserOrders } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { paymentLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/create-order', paymentLimiter, createOrder);
router.post('/verify-payment', paymentLimiter, verifyPayment);
router.get('/orders', protect, getUserOrders);

export default router;


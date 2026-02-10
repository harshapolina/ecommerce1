import express from 'express';
import { createOrder, verifyPayment, getUserOrders, getAllOrders } from '../controllers/paymentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { paymentLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/create-order', paymentLimiter, createOrder);
router.post('/verify-payment', paymentLimiter, protect, verifyPayment);
router.get('/orders', protect, getUserOrders);
router.get('/admin/orders', protect, admin, getAllOrders);

export default router;
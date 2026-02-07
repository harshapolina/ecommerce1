import express from 'express';
import { createOrder, verifyPayment, getUserOrders } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);
router.get('/orders', protect, getUserOrders);

export default router;


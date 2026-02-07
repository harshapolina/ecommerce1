import express from 'express';
import { createOrder, verifyPayment, getUserOrders } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create Razorpay order (requires authentication)
router.post('/create-order', protect, createOrder);

// Verify payment after successful transaction
router.post('/verify-payment', protect, verifyPayment);

// Get user's orders
router.get('/orders', protect, getUserOrders);

export default router;


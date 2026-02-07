import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/orderModel.js';

// Initialize Razorpay instance with key and secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
export const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', items, shippingAddress } = req.body;
    
    // Validate required fields
    if (!amount || !items || items.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Amount and items are required' 
      });
    }
    
    // Convert amount to paise (Razorpay expects amount in smallest currency unit)
    // For INR, 1 rupee = 100 paise
    const amountInPaise = Math.round(amount * 100);
    
    // Create order options for Razorpay
    const options = {
      amount: amountInPaise,
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        itemsCount: items.length.toString()
      }
    };
    
    // Create order in Razorpay
    const razorpayOrder = await razorpay.orders.create(options);
    
    // Save order to database with pending status
    const order = new Order({
      user: req.user._id,
      orderItems: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        product: item._id
      })),
      shippingAddress: shippingAddress || {
        fullName: req.user.name,
        address: 'Not provided',
        city: 'Not provided',
        postalCode: '000000',
        country: 'India',
        phone: '0000000000'
      },
      razorpayOrderId: razorpayOrder.id,
      itemsPrice: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      shippingPrice: amount - items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      totalPrice: amount,
      isPaid: false
    });
    
    await order.save();
    
    // Return order details to frontend
    res.status(200).json({
      success: true,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt
      },
      orderId: order._id
    });
    
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Verify payment and update order
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    
    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification data is missing'
      });
    }
    
    // Find the order in database
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Verify the payment signature
    // Razorpay sends a signature that we need to verify using our secret
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');
    
    // Compare signatures
    const isSignatureValid = generatedSignature === razorpay_signature;
    
    if (!isSignatureValid) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed - Invalid signature'
      });
    }
    
    // Update order with payment details
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.isPaid = true;
    order.paidAt = new Date();
    
    await order.save();
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order: {
        _id: order._id,
        totalPrice: order.totalPrice,
        isPaid: order.isPaid,
        paidAt: order.paidAt
      }
    });
    
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('orderItems.product', 'name image');
    
    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};


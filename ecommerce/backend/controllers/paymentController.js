import Razorpay from 'razorpay';
import crypto from 'crypto';
import mongoose from 'mongoose';
import Order from '../models/orderModel.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_SBjgUiAL2qDOF8',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'iP25EvoBTClrR3lJchcbXbsc'
});

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderItems,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment details are required' });
    }

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Order items are required' });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'iP25EvoBTClrR3lJchcbXbsc')
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const mappedOrderItems = orderItems.map(item => {
      let productId = null;
      
      if (item._id && mongoose.Types.ObjectId.isValid(item._id)) {
        productId = new mongoose.Types.ObjectId(item._id);
      } else if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
        productId = new mongoose.Types.ObjectId(item.product);
      }

      const orderItem = {
        name: item.name || 'Product',
        quantity: item.quantity || 1,
        price: item.price || 0,
        image: item.image || 'https://via.placeholder.com/300'
      };

      if (productId) {
        orderItem.product = productId;
      }

      return orderItem;
    });

    const order = new Order({
      user: req.user._id,
      orderItems: mappedOrderItems,
      shippingAddress: {
        fullName: shippingAddress?.fullName || req.user.name || 'Customer',
        address: shippingAddress?.address || 'Address not provided',
        city: shippingAddress?.city || 'City not provided',
        postalCode: shippingAddress?.postalCode || '000000',
        country: shippingAddress?.country || 'India',
        phone: shippingAddress?.phone || '0000000000'
      },
      paymentMethod: 'Razorpay',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      itemsPrice: itemsPrice || 0,
      shippingPrice: shippingPrice || 0,
      totalPrice: totalPrice || 0,
      isPaid: true,
      paidAt: new Date()
    });

    await order.save();

    res.json({ 
      success: true, 
      message: 'Order placed successfully',
      orderId: order._id 
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process order'
    });
  }
};

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
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('orderItems.product', 'name image');

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};


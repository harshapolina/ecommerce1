import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/orderModel.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', items, shippingAddress } = req.body;
    
    if (!amount || !items || items.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Amount and items are required' 
      });
    }
    
    const amountInPaise = Math.round(amount * 100);
    
    const orderOptions = {
      amount: amountInPaise,
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        itemsCount: items.length.toString()
      }
    };
    
    const razorpayOrder = await razorpay.orders.create(orderOptions);
    
    const newOrder = new Order({
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
    
    await newOrder.save();
    
    res.status(200).json({
      success: true,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt
      },
      orderId: newOrder._id
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Payment data missing'
      });
    }
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');
    
    if (generatedSig !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid signature'
      });
    }
    
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.isPaid = true;
    order.paidAt = new Date();
    
    await order.save();
    
    res.status(200).json({
      success: true,
      message: 'Payment verified',
      order: {
        _id: order._id,
        totalPrice: order.totalPrice,
        isPaid: order.isPaid,
        paidAt: order.paidAt
      }
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Verification failed'
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
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};


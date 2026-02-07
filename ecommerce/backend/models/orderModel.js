import mongoose from 'mongoose';

// Order schema to store order details in MongoDB
const orderSchema = new mongoose.Schema({
  // User who placed the order
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Order items with product details
  orderItems: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    }
  }],
  
  // Shipping address
  shippingAddress: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true }
  },
  
  // Payment information
  paymentMethod: {
    type: String,
    required: true,
    default: 'Razorpay'
  },
  
  // Razorpay payment details
  razorpayOrderId: {
    type: String,
    required: true
  },
  
  razorpayPaymentId: {
    type: String
  },
  
  razorpaySignature: {
    type: String
  },
  
  // Pricing breakdown
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  
  // Order status
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  
  paidAt: {
    type: Date
  },
  
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  
  deliveredAt: {
    type: Date
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;


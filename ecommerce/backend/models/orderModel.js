import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  orderItems: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: false
    }
  }],
  
  shippingAddress: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true }
  },
  
  paymentMethod: {
    type: String,
    required: true,
    default: 'Razorpay'
  },
  
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
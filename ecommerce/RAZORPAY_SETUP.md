# Razorpay Payment Gateway Integration Guide

This guide explains how to set up and use Razorpay payment gateway in the furniture e-commerce app.

## Prerequisites

1. Razorpay account (Sign up at https://razorpay.com)
2. Node.js and MongoDB installed
3. Backend and frontend servers running

## Setup Steps

### 1. Get Razorpay API Keys

1. Log in to your Razorpay Dashboard: https://dashboard.razorpay.com
2. Go to **Settings** → **API Keys**
3. Generate **Test Keys** (for development) or **Live Keys** (for production)
4. Copy your **Key ID** and **Key Secret**

### 2. Backend Configuration

Add these environment variables to `ecommerce/backend/.env`:

```env
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

### 3. Frontend Configuration

Create `ecommerce/frontend/.env` file and add:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
```

**Note:** In Vite, environment variables must be prefixed with `VITE_` to be accessible in the frontend.

### 4. Install Dependencies

Backend already has Razorpay installed. If needed, run:
```bash
cd ecommerce/backend
npm install razorpay
```

## How It Works

### Payment Flow

1. **User clicks "Proceed to Checkout"** in the cart
2. **Backend creates Razorpay order** via `/api/payments/create-order`
3. **Frontend opens Razorpay checkout** modal
4. **User completes payment** in Razorpay modal
5. **Backend verifies payment** via `/api/payments/verify-payment`
6. **Order saved to MongoDB** with payment details
7. **User redirected to profile** to view order

### API Endpoints

#### Create Order
- **POST** `/api/payments/create-order`
- **Auth:** Required (Bearer token)
- **Body:**
  ```json
  {
    "amount": 1000,
    "currency": "INR",
    "items": [...],
    "shippingAddress": {...}
  }
  ```

#### Verify Payment
- **POST** `/api/payments/verify-payment`
- **Auth:** Required (Bearer token)
- **Body:**
  ```json
  {
    "razorpay_order_id": "...",
    "razorpay_payment_id": "...",
    "razorpay_signature": "...",
    "orderId": "..."
  }
  ```

#### Get User Orders
- **GET** `/api/payments/orders`
- **Auth:** Required (Bearer token)

## Security Features

1. **Payment Signature Verification:** All payments are verified using HMAC SHA256 signature
2. **Authentication Required:** All payment endpoints require user authentication
3. **Order Validation:** Orders are validated before creating Razorpay order
4. **Secure Token Storage:** JWT tokens used for authentication

## Testing

### Test Cards (Razorpay Test Mode)

- **Success:** 4111 1111 1111 1111
- **Failure:** 4000 0000 0000 0002
- **CVV:** Any 3 digits
- **Expiry:** Any future date

### Test UPI IDs

- `success@razorpay`
- `failure@razorpay`

## Production Checklist

- [ ] Switch to Live API keys
- [ ] Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in production `.env`
- [ ] Update `VITE_RAZORPAY_KEY_ID` in frontend `.env`
- [ ] Enable webhook for payment status updates (optional)
- [ ] Test with real payment methods
- [ ] Set up proper error logging and monitoring

## Troubleshooting

### Payment modal not opening
- Check if Razorpay script is loaded
- Verify `VITE_RAZORPAY_KEY_ID` is set correctly
- Check browser console for errors

### Payment verification fails
- Verify `RAZORPAY_KEY_SECRET` matches the key used
- Check if order exists in database
- Verify signature calculation

### Order not saving
- Check MongoDB connection
- Verify user authentication token
- Check backend logs for errors

## Support

For Razorpay-specific issues, refer to:
- Razorpay Documentation: https://razorpay.com/docs/
- Razorpay Support: support@razorpay.com


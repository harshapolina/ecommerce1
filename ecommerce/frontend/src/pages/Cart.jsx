import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { CartContext, AuthContext } from '../App';
import toast from 'react-hot-toast';
import './Cart.css';

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;
  const [processing, setProcessing] = useState(false);

  // Handle checkout and Razorpay payment
  const handleCheckout = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    // Check if cart has items
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setProcessing(true);
    setIsOrdered(true);

    try {
      // Load Razorpay script
      const razorpayLoaded = await loadRazorpayScript();
      
      if (!razorpayLoaded) {
        toast.error('Failed to load payment gateway');
        setProcessing(false);
        setIsOrdered(false);
        return;
      }

      // Prepare order data
      const orderData = {
        amount: total,
        currency: 'INR',
        items: cartItems.map(item => ({
          _id: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        shippingAddress: {
          fullName: user.name,
          address: 'Not provided',
          city: 'Not provided',
          postalCode: '000000',
          country: 'India',
          phone: '0000000000'
        }
      };

      // Create order on backend
      const createOrderResponse = await fetch('http://localhost:5000/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(orderData)
      });

      const createOrderData = await createOrderResponse.json();

      if (!createOrderResponse.ok || !createOrderData.success) {
        throw new Error(createOrderData.message || 'Failed to create order');
      }

      // Razorpay checkout options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag', // Replace with your Razorpay key
        amount: createOrderData.order.amount,
        currency: createOrderData.order.currency,
        name: 'Furniture Store',
        description: `Order for ${cartItems.length} item(s)`,
        order_id: createOrderData.order.id,
        handler: async function (response) {
          // Payment successful - verify payment on backend
          try {
            const verifyResponse = await fetch('http://localhost:5000/api/payments/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: createOrderData.orderId
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.success) {
              // Payment verified successfully
              toast.success('Payment successful! Order placed.');
              clearCart();
              
              // Navigate to profile after a delay
              setTimeout(() => {
                navigate('/profile');
              }, 2000);
            } else {
              // Payment verification failed
              toast.error(verifyData.message || 'Payment verification failed');
              setIsOrdered(false);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
            setIsOrdered(false);
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: '0000000000'
        },
        theme: {
          color: '#1B6B3A'
        },
        modal: {
          ondismiss: function() {
            // User closed the payment modal
            toast.error('Payment cancelled');
            setIsOrdered(false);
            setProcessing(false);
          }
        }
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to process payment');
      setIsOrdered(false);
      setProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page page-enter">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <FiShoppingBag />
            </div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page-enter">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <span className="cart-count">{cartItems.length} items</span>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            <div className="cart-table-header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span></span>
            </div>

            {cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <div className="item-product">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <Link to={`/products/${item._id}`} className="item-name">
                      {item.name}
                    </Link>
                    <span className="item-category">{item.category}</span>
                  </div>
                </div>

                <div className="item-price">
                  ₹{item.price.toFixed(2)}
                </div>

                <div className="item-quantity">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  >
                    <FiMinus />
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    <FiPlus />
                  </button>
                </div>

                <div className="item-total">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item._id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}

            <div className="cart-actions">
              <Link to="/products" className="btn btn-secondary">
                <FiArrowLeft /> Continue Shopping
              </Link>
              <button className="btn btn-secondary" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
            </div>

            {subtotal < 100 && (
              <div className="free-shipping-notice">
                Add ₹{(100 - subtotal).toFixed(2)} more for free shipping!
              </div>
            )}

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <button 
              className="btn btn-primary checkout-btn"
              onClick={handleCheckout}
              disabled={isOrdered}
            >
              {isOrdered ? 'Processing...' : 'Proceed to Checkout'}
            </button>

            {!user && (
              <div className="login-prompt">
                <p>Please <Link to="/login">login</Link> to place an order</p>
              </div>
            )}

            <div className="payment-methods">
              <p>We accept:</p>
              <div className="payment-icons">
                <span>💳 Visa</span>
                <span>💳 Mastercard</span>
                <span>💳 PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;


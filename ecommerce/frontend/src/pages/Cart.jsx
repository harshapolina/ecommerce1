import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { CartContext, AuthContext } from '../App';
import toast from 'react-hot-toast';
import './Cart.css';

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

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setProcessing(true);
    setIsOrdered(true);

    try {
      const razorpayLoaded = await loadRazorpayScript();
      
      if (!razorpayLoaded) {
        toast.error('Failed to load payment gateway');
        setProcessing(false);
        setIsOrdered(false);
        return;
      }

      const res = await fetch('http://localhost:5000/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: total })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create order');
      }

      const order = await res.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SBjgUiAL2qDOF8',
        amount: order.amount,
        currency: order.currency,
        name: 'Furniture Store',
        description: `Order for ${cartItems.length} item(s)`,
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('http://localhost:5000/api/payments/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderItems: cartItems,
                shippingAddress: {
                  fullName: user.name,
                  address: 'Address not provided',
                  city: 'City not provided',
                  postalCode: '000000',
                  country: 'India',
                  phone: '0000000000'
                },
                itemsPrice: subtotal,
                shippingPrice: shipping,
                totalPrice: total
              })
            });

            if (!verifyRes.ok) {
              const errorData = await verifyRes.json().catch(() => ({}));
              throw new Error(errorData.message || 'Payment verification failed');
            }

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              toast.success('Payment successful! Order placed.');
              clearCart();
              setTimeout(() => {
                navigate('/profile');
              }, 2000);
            } else {
              toast.error(verifyData.message || 'Payment verification failed');
              setIsOrdered(false);
            }
          } catch (error) {
            toast.error(error.message || 'Payment verification failed');
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
            toast.error('Payment cancelled');
            setIsOrdered(false);
            setProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
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


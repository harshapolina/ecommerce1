import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { CartContext, AuthContext } from '../App';
import toast from 'react-hot-toast';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

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
                  ${item.price.toFixed(2)}
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
                  ${(item.price * item.quantity).toFixed(2)}
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
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>

            {subtotal < 100 && (
              <div className="free-shipping-notice">
                Add ${(100 - subtotal).toFixed(2)} more for free shipping!
              </div>
            )}

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button 
              className="btn btn-primary checkout-btn"
              onClick={() => {
                if (!user) {
                  toast.error('Please login to place an order');
                  navigate('/login');
                  return;
                }
                
                // Save order to localStorage
                const order = {
                  orderId: `ORD-${Date.now()}`,
                  date: new Date().toISOString(),
                  items: cartItems,
                  total: total,
                  subtotal: subtotal,
                  shipping: shipping,
                  status: 'completed',
                  userId: user._id || user.email
                };
                
                const existingOrders = localStorage.getItem(`orders_${user._id || user.email}`);
                const orders = existingOrders ? JSON.parse(existingOrders) : [];
                orders.unshift(order);
                localStorage.setItem(`orders_${user._id || user.email}`, JSON.stringify(orders));
                
                setIsOrdered(true);
                toast.success('Order placed successfully!');
                clearCart();
                
                // Navigate to profile after a delay
                setTimeout(() => {
                  navigate('/profile');
                }, 2000);
              }}
            >
              Proceed to Shop
            </button>

            {!user && (
              <div className="login-prompt">
                <p>Please <Link to="/login">login</Link> to place an order</p>
              </div>
            )}

            {isOrdered && (
              <div className="ordered-tab">
                <span className="ordered-text">Ordered</span>
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


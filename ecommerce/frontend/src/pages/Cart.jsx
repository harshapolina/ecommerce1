import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { CartContext } from '../App';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);

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

            <button className="btn btn-primary checkout-btn">
              Proceed to Checkout
            </button>

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


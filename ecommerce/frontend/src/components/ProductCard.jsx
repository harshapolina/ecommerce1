import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { FiHeart, FiMaximize2, FiStar, FiPlus, FiMinus } from 'react-icons/fi';
import { CartContext, WishlistContext } from '../App';
import toast from 'react-hot-toast';
import './ProductCard.css';

const ProductCard = ({ product, showTimer = false }) => {
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 12,
    mins: 30,
    secs: 25
  });

  const isInWishlist = wishlistItems.some(item => item._id === product._id);

  useEffect(() => {
    if (!showTimer) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, mins, secs } = prev;
        
        if (secs > 0) {
          secs--;
        } else {
          secs = 59;
          if (mins > 0) {
            mins--;
          } else {
            mins = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              }
            }
          }
        }
        
        return { days, hours, mins, secs };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showTimer]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, quantity);
    toast.success(`${quantity} x ${product.name} added to cart`);
    navigate('/cart');
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(product._id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  const incrementQuantity = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity(prev => Math.min(prev + 1, product.stock || 99));
  };

  const decrementQuantity = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-link">
        <div className="product-image-wrapper">
          <img 
            src={product.image} 
            alt={product.name} 
            className="product-image"
          />
          
          {discount > 0 && (
            <span className="discount-badge">{discount}% off</span>
          )}

          <div className="product-actions">
            <button 
              className={`action-btn ${isInWishlist ? 'active' : ''}`} 
              onClick={handleWishlistToggle}
            >
              <FiHeart />
            </button>
            <Link 
              to={`/products/${product._id}`}
              className="action-btn"
              onClick={(e) => e.stopPropagation()}
            >
              <FiMaximize2 />
            </Link>
          </div>

          {showTimer && (
            <div className="countdown-timer">
              <div className="timer-block">
                <span className="timer-value">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="timer-label">Days</span>
              </div>
              <span className="timer-separator">:</span>
              <div className="timer-block">
                <span className="timer-value">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="timer-label">Hours</span>
              </div>
              <span className="timer-separator">:</span>
              <div className="timer-block">
                <span className="timer-value">{String(timeLeft.mins).padStart(2, '0')}</span>
                <span className="timer-label">Mins</span>
              </div>
              <span className="timer-separator">:</span>
              <div className="timer-block">
                <span className="timer-value">{String(timeLeft.secs).padStart(2, '0')}</span>
                <span className="timer-label">Sec</span>
              </div>
            </div>
          )}
        </div>
      </Link>
      
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link to={`/products/${product._id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <div className="product-footer">
          <div className="product-price-wrapper">
            <span className="product-price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="original-price">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <div className="product-rating">
            <FiStar className="star-icon" />
            <span>{product.rating?.toFixed(1) || '4.5'}</span>
          </div>
        </div>
        
        <div className="product-quantity-section">
          <div className="quantity-selector-card">
            <button 
              className="qty-btn-card" 
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              <FiMinus />
            </button>
            <span className="qty-value-card">{quantity}</span>
            <button 
              className="qty-btn-card" 
              onClick={incrementQuantity}
              disabled={quantity >= (product.stock || 99)}
            >
              <FiPlus />
            </button>
          </div>
          <button 
            className="btn-add-to-cart-card"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

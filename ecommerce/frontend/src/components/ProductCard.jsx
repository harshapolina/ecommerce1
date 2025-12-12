import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { FiHeart, FiMaximize2, FiStar } from 'react-icons/fi';
import { CartContext } from '../App';
import toast from 'react-hot-toast';
import './ProductCard.css';

const ProductCard = ({ product, showTimer = false }) => {
  const { addToCart } = useContext(CartContext);
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 12,
    mins: 30,
    secs: 25
  });

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
    addToCart(product);
    toast.success(`${product.name} added to cart`);
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
            <button className="action-btn" onClick={(e) => e.preventDefault()}>
              <FiHeart />
            </button>
            <button className="action-btn" onClick={(e) => e.preventDefault()}>
              <FiMaximize2 />
            </button>
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
      </div>
    </div>
  );
};

export default ProductCard;

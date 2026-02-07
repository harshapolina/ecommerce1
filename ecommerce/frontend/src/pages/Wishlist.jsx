import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import { WishlistContext, CartContext } from '../App';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page page-enter">
        <div className="container">
          <div className="empty-wishlist">
            <div className="empty-wishlist-icon">
              <FiHeart />
            </div>
            <h2>Your wishlist is empty</h2>
            <p>Start adding products you love to your wishlist</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page page-enter">
      <div className="container">
        <div className="wishlist-header">
          <h1>My Wishlist</h1>
          <span className="wishlist-count">{wishlistItems.length} items</span>
        </div>

        <div className="wishlist-grid">
          {wishlistItems.map(product => (
            <div key={product._id} className="wishlist-item-card">
              <ProductCard product={product} />
              <div className="wishlist-item-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => handleAddToCart(product)}
                >
                  <FiShoppingBag /> Add to Cart
                </button>
                <button
                  className="btn btn-secondary remove-wishlist-btn"
                  onClick={() => handleRemoveFromWishlist(product._id)}
                >
                  <FiTrash2 /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="wishlist-footer">
          <Link to="/products" className="btn btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;


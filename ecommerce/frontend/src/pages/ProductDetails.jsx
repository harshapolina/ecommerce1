import { useState, useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiHeart, FiShare2, FiTruck, FiShield, FiRefreshCw, FiStar } from 'react-icons/fi';
import { CartContext, WishlistContext } from '../App';
import toast from 'react-hot-toast';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  const mockProducts = {
    '1': {
      _id: '1',
      name: 'Wooden Sofa Chair',
      category: 'Chair',
      price: 80.0,
      originalPrice: 160.0,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      rating: 4.9,
      stock: 15,
      description:
        'A beautiful wooden sofa chair perfect for your living room. Made with premium quality wood and comfortable cushioning.',
    },
    '2': {
      _id: '2',
      name: 'Circular Sofa Chair',
      category: 'Chair',
      price: 108.0,
      originalPrice: 120.0,
      image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
      rating: 5.0,
      stock: 10,
      description:
        'Modern circular sofa chair with elegant design. Perfect for contemporary homes.',
    },
    '3': {
      _id: '3',
      name: 'Wooden Nightstand',
      category: 'Table',
      price: 54.0,
      originalPrice: 60.0,
      image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800',
      rating: 4.8,
      stock: 20,
      description:
        'Compact wooden nightstand with drawer storage. Ideal bedside companion.',
    },
    '4': {
      _id: '4',
      name: 'Bean Bag Chair',
      category: 'Chair',
      price: 72.0,
      originalPrice: 80.0,
      image: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800',
      rating: 4.6,
      stock: 8,
      description:
        'Comfortable bean bag chair for casual seating. Available in multiple colors.',
    },
  };

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);

      const isMongoId = id && id.length === 24;

      if (isMongoId) {
        try {
          const res = await fetch(`http://localhost:5000/api/products/products/${id}`);
          const data = await res.json();

          if (res.ok && data && data._id) {
            setProduct(data);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Failed to load product from server, falling back to demo products.');
        }
      }

      // Fallback to static demo products for original items
      setProduct(mockProducts[id] || mockProducts['1']);
      setLoading(false);
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart`);
  };

  const isInWishlist = product && wishlistItems.some(item => item._id === product._id);

  const handleWishlistToggle = () => {
    if (!product) return;
    if (isInWishlist) {
      removeFromWishlist(product._id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(q => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <div className="container">
          <div className="loading-skeleton">
            <div className="skeleton-gallery"></div>
            <div className="skeleton-info">
              <div className="skeleton-text large"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text short"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <div className="container">
          <div className="not-found">
            <h2>Product not found</h2>
            <Link to="/products" className="btn btn-primary">Back to Shop</Link>
          </div>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="product-details-page page-enter">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Shop</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className="product-details-grid">
          {/* Product Gallery */}
          <div className="product-gallery">
            <div className="main-image">
              <img src={product.image} alt={product.name} />
              {discount > 0 && <span className="discount-badge">{discount}% OFF</span>}
            </div>
            <div className="thumbnail-list">
              {[...Array(4)].map((_, i) => (
                <button 
                  key={i}
                  className={`thumbnail ${selectedImage === i ? 'active' : ''}`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img src={product.image} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <span className="product-category">{product.category}</span>
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-rating-row">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FiStar 
                    key={i} 
                    className={`star ${i < Math.floor(product.rating) ? 'filled' : ''}`}
                  />
                ))}
              </div>
              <span className="rating-text">{product.rating} (120 Reviews)</span>
            </div>

            <div className="product-price-section">
              <span className="current-price">₹{product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="original-price">₹{product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <p className="product-description">{product.description}</p>

            <div className="product-actions-section">
              <div className="quantity-selector">
                <button onClick={decrementQuantity} className="qty-btn">
                  <FiMinus />
                </button>
                <span className="qty-value">{quantity}</span>
                <button onClick={incrementQuantity} className="qty-btn">
                  <FiPlus />
                </button>
              </div>
              <button className="btn btn-primary add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button 
                className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
                onClick={handleWishlistToggle}
              >
                <FiHeart />
              </button>
              <button className="share-btn">
                <FiShare2 />
              </button>
            </div>

            <div className="stock-info">
              {product.stock > 0 ? (
                <span className="in-stock">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            <div className="product-features">
              <div className="feature">
                <FiTruck className="feature-icon" />
                <div>
                  <strong>Free Shipping</strong>
                  <span>On orders over ₹100</span>
                </div>
              </div>
              <div className="feature">
                <FiShield className="feature-icon" />
                <div>
                  <strong>2 Year Warranty</strong>
                  <span>Quality guaranteed</span>
                </div>
              </div>
              <div className="feature">
                <FiRefreshCw className="feature-icon" />
                <div>
                  <strong>30 Day Returns</strong>
                  <span>Easy returns policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="product-tabs">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews (120)
            </button>
            <button 
              className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
              onClick={() => setActiveTab('shipping')}
            >
              Shipping Info
            </button>
          </div>
          <div className="tabs-content">
            {activeTab === 'description' && (
              <div className="tab-panel">
                <h3>Product Description</h3>
                <p>{product.description}</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="tab-panel">
                <h3>Customer Reviews</h3>
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="tab-panel">
                <h3>Shipping Information</h3>
                <p>Free standard shipping on orders over ₹100. Express shipping available at checkout.</p>
                <p>Delivery typically takes 5-7 business days.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;


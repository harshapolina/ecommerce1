import { Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { FiShoppingCart, FiUser, FiSearch, FiHeart, FiPhone, FiMenu, FiX } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { CartContext, AuthContext, WishlistContext } from '../App';
import './Navbar.css';

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-bar-content container">
          <div className="top-bar-left">
            <FiPhone className="phone-icon" />
            <span>Call Us : +123-456-789</span>
          </div>
          <div className="top-bar-center">
            {!user ? (
              <>
                <span>Sign up and <strong>GET 25% OFF</strong> for your first order. </span>
                <Link to="/signup" className="signup-link">Sign up now</Link>
              </>
            ) : (
              <span>Welcome back, {user.name || 'User'}! 🎉</span>
            )}
          </div>
          <div className="top-bar-right">
            <a href="#" className="social-icon"><FaFacebookF /></a>
            <a href="#" className="social-icon"><FaTwitter /></a>
            <a href="#" className="social-icon"><FaInstagram /></a>
            <a href="#" className="social-icon"><FaYoutube /></a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar">
        <div className="navbar-container container">
          <Link to="/" className="logo">
            <div className="logo-icon">
              <span>F</span>
            </div>
            <span className="logo-text">Furniture</span>
          </Link>

          <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link 
              to="/categories" 
              className={`nav-link ${location.pathname === '/categories' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link 
              to="/about" 
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link 
              to="/blog" 
              className={`nav-link ${location.pathname === '/blog' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
          </div>

          <div className="nav-actions">
            <button className="nav-icon">
              <FiSearch />
            </button>
            <Link to="/wishlist" className="nav-icon wishlist-btn">
              <FiHeart />
              {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
            </Link>
            <Link to="/cart" className="nav-icon cart-btn">
              <FiShoppingCart />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>
            {user ? (
              <Link to="/profile" className="nav-icon" title="Profile">
                <FiUser />
              </Link>
            ) : (
              <Link to="/login" className="nav-icon">
                <FiUser />
              </Link>
            )}
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

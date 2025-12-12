import { Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { FiShoppingCart, FiUser, FiSearch, FiHeart, FiPhone, FiMenu, FiX } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { CartContext, AuthContext } from '../App';
import './Navbar.css';

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

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
            <span>Sign up and <strong>GET 25% OFF</strong> for your first order. </span>
            <Link to="/signup" className="signup-link">Sign up now</Link>
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
            <Link to="/products" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Categories
            </Link>
            <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              About Us
            </Link>
            <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Contact Us
            </Link>
            <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Blog
            </Link>
          </div>

          <div className="nav-actions">
            <button className="nav-icon">
              <FiSearch />
            </button>
            <button className="nav-icon">
              <FiHeart />
            </button>
            <Link to="/cart" className="nav-icon cart-btn">
              <FiShoppingCart />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>
            {user ? (
              <div className="user-menu">
                <button onClick={logout} className="nav-icon">
                  <FiUser />
                </button>
              </div>
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

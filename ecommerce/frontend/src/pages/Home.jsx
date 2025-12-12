import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiCreditCard, FiHeadphones, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const [activeTab, setActiveTab] = useState('latest');

  const features = [
    { icon: <FiTruck />, title: 'Free Shipping', desc: 'Free shipping for order above $180' },
    { icon: <FiCreditCard />, title: 'Flexible Payment', desc: 'Multiple secure payment options' },
    { icon: <FiHeadphones />, title: '24×7 Support', desc: 'We support online all days.' },
  ];

  const chairTypes = ['Gaming Chair', 'Lounge Chair', 'Folding Chair', 'Dining Chair', 'Office Chair', 'Armchair', 'Bar Stool', 'Club Chair'];
  const sofaTypes = ['Reception Sofa', 'Sectional Sofa', 'Armless Sofa', 'Curved Sofa'];
  const lightingTypes = ['Table Lights', 'Floor Lights', 'Ceiling Lights', 'Wall Lights'];

  const products = [
    {
      _id: '1',
      name: 'Wooden Sofa Chair',
      category: 'Chair',
      price: 80.00,
      originalPrice: 160.00,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      rating: 4.9,
      stock: 15
    },
    {
      _id: '2',
      name: 'Circular Sofa Chair',
      category: 'Chair',
      price: 108.00,
      originalPrice: 120.00,
      image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
      rating: 5.0,
      stock: 10
    },
    {
      _id: '3',
      name: 'Wooden Nightstand',
      category: 'Nightstand',
      price: 54.00,
      originalPrice: 60.00,
      image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800',
      rating: 4.8,
      stock: 20
    },
    {
      _id: '4',
      name: 'Bean Bag Chair',
      category: 'Chair',
      price: 72.00,
      originalPrice: 80.00,
      image: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800',
      rating: 4.6,
      stock: 8
    },
  ];

  const tabs = [
    { id: 'all', label: 'All Products' },
    { id: 'latest', label: 'Latest Products' },
    { id: 'best', label: 'Best Sellers' },
    { id: 'featured', label: 'Featured Products' },
  ];

  return (
    <div className="home page-enter">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content container">
          <div className="hero-left">
            <div className="hero-badge">
              <span className="badge-icon">🛋️</span>
              <span>The Best Online Furniture Store</span>
            </div>
            <h1 className="hero-title">
              Explore Our <span className="highlight">Modern Furniture</span> Collection
            </h1>
            <p className="hero-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
              sed do eiusmod tempor incididunt ut labore et dolore.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary">
                Shop Now <FiArrowRight />
              </Link>
              <Link to="/products" className="btn btn-secondary">
                View All Products
              </Link>
            </div>
            <div className="hero-stats">
              <div className="customer-avatars">
                <img src="https://i.pravatar.cc/40?img=1" alt="Customer" className="avatar" />
                <img src="https://i.pravatar.cc/40?img=2" alt="Customer" className="avatar" />
                <img src="https://i.pravatar.cc/40?img=3" alt="Customer" className="avatar" />
                <span className="avatar-more">+</span>
              </div>
              <div className="rating-info">
                <span className="rating-number">4.9 Ratings+</span>
                <span className="rating-text">Trusted by 50k+ Customers</span>
              </div>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-grid">
              <div className="hero-main-image">
                <img 
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800" 
                  alt="Living Room Furniture" 
                />
                <span className="price-tag">$1,500</span>
              </div>
              <div className="hero-category-cards">
                <div className="category-card">
                  <img 
                    src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400" 
                    alt="Living Room" 
                  />
                  <div className="category-info">
                    <h4>Living Room</h4>
                    <span>2,500+ Items</span>
                  </div>
                  <button className="category-arrow"><FiArrowRight /></button>
                </div>
                <div className="category-card">
                  <img 
                    src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400" 
                    alt="Bed Room" 
                  />
                  <div className="category-info">
                    <h4>Bed Room</h4>
                    <span>1,500+ Items</span>
                  </div>
                  <button className="category-arrow"><FiArrowRight /></button>
                </div>
              </div>
            </div>
            <div className="hero-nav-arrows">
              <button className="nav-arrow"><FiChevronLeft /></button>
              <button className="nav-arrow"><FiChevronRight /></button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-content container">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <div className="feature-text">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section container">
        <div className="categories-grid">
          {/* Chairs Category */}
          <div className="category-block chairs">
            <div className="category-content">
              <span className="item-count"><span className="count-number">1500+</span> Items</span>
              <h2 className="category-title">Chairs</h2>
              <p className="category-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
              <ul className="category-list">
                {chairTypes.map((type, index) => (
                  <li key={index}><Link to="/products">{type}</Link></li>
                ))}
              </ul>
            </div>
            <div className="category-image">
              <img src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600" alt="Chair" />
            </div>
          </div>

          {/* Sofa & Lighting */}
          <div className="category-side">
            <div className="category-block sofa">
              <div className="category-content">
                <span className="item-count"><span className="count-number">750+</span> Items</span>
                <h2 className="category-title">Sofa</h2>
                <ul className="category-list">
                  {sofaTypes.map((type, index) => (
                    <li key={index}><Link to="/products">{type}</Link></li>
                  ))}
                </ul>
              </div>
              <div className="category-image small">
                <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400" alt="Sofa" />
              </div>
            </div>

            <div className="category-block lighting">
              <div className="category-content">
                <span className="item-count"><span className="count-number">450+</span> Items</span>
                <h2 className="category-title">Lighting</h2>
                <ul className="category-list">
                  {lightingTypes.map((type, index) => (
                    <li key={index}><Link to="/products">{type}</Link></li>
                  ))}
                </ul>
              </div>
              <div className="category-image small">
                <img src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400" alt="Lighting" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section container">
        <div className="section-header">
          <div className="section-title-wrapper">
            <span className="section-badge">Our Products</span>
            <h2 className="section-title">Our Products Collections</h2>
          </div>
        </div>

        <div className="products-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {products.map((product, index) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              showTimer={index === 0}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content container">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon">
                <span>F</span>
              </div>
              <span className="logo-text">Furniture</span>
            </div>
            <p className="footer-tagline">The best online furniture store for quality and affordable furniture.</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Shop</h4>
              <a href="#">All Products</a>
              <a href="#">New Arrivals</a>
              <a href="#">Best Sellers</a>
              <a href="#">Sale</a>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <a href="#">Contact Us</a>
              <a href="#">FAQs</a>
              <a href="#">Shipping</a>
              <a href="#">Returns</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Blog</a>
              <a href="#">Press</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom container">
          <p>&copy; 2024 Furniture. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

import { Link } from 'react-router-dom';
import { FiAward, FiUsers, FiTruck, FiHeadphones } from 'react-icons/fi';
import './About.css';

const About = () => {
  const features = [
    {
      icon: <FiAward />,
      title: 'Premium Quality',
      description: 'We source only the finest materials for our furniture'
    },
    {
      icon: <FiUsers />,
      title: 'Expert Team',
      description: 'Our skilled craftsmen bring years of experience'
    },
    {
      icon: <FiTruck />,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to your doorstep'
    },
    {
      icon: <FiHeadphones />,
      title: '24/7 Support',
      description: 'Our customer service team is always here to help'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Happy Customers' },
    { number: '10K+', label: 'Products Sold' },
    { number: '500+', label: '5 Star Reviews' },
    { number: '15+', label: 'Years Experience' }
  ];

  return (
    <div className="about-page page-enter">
      <div className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <h1>About Furniture Store</h1>
            <p>
              We are passionate about creating beautiful, functional furniture that transforms 
              your living spaces. With over 15 years of experience, we've been helping customers 
              find the perfect pieces for their homes.
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        <section className="about-story">
          <div className="story-content">
            <h2>Our Story</h2>
            <p>
              Founded in 2008, Furniture Store began as a small family business with a simple mission: 
              to provide high-quality furniture at affordable prices. What started as a local shop has 
              grown into a trusted online destination for furniture lovers across the country.
            </p>
            <p>
              We believe that furniture should be more than just functional—it should reflect your 
              personality and enhance your daily life. That's why we carefully curate every piece 
              in our collection, ensuring it meets our high standards for quality, design, and value.
            </p>
          </div>
          <div className="story-image">
            <img 
              src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800" 
              alt="Our Story" 
            />
          </div>
        </section>

        <section className="about-features">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-stats">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-cta">
          <h2>Ready to Transform Your Space?</h2>
          <p>Explore our collection and find the perfect furniture for your home</p>
          <div className="cta-buttons">
            <Link to="/products" className="btn btn-primary">
              Shop Now
            </Link>
            <Link to="/categories" className="btn btn-secondary">
              Browse Categories
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;


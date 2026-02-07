import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi';
import './Blog.css';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['All', 'Interior Design', 'Furniture Tips', 'Home Decor', 'Trends'];

  const blogPosts = [
    {
      id: 1,
      title: '10 Modern Living Room Ideas for 2024',
      excerpt: 'Discover the latest trends in living room design and how to create a space that reflects your personality.',
      image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800',
      category: 'Interior Design',
      author: 'Sarah Johnson',
      date: 'March 15, 2024',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'How to Choose the Perfect Sofa for Your Home',
      excerpt: 'A comprehensive guide to selecting the right sofa that combines comfort, style, and functionality.',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      category: 'Furniture Tips',
      author: 'Michael Chen',
      date: 'March 12, 2024',
      readTime: '7 min read'
    },
    {
      id: 3,
      title: 'Small Space Furniture Solutions',
      excerpt: 'Maximize your living space with these clever furniture arrangements and storage solutions.',
      image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800',
      category: 'Home Decor',
      author: 'Emily Davis',
      date: 'March 10, 2024',
      readTime: '6 min read'
    },
    {
      id: 4,
      title: 'Sustainable Furniture: A Guide to Eco-Friendly Choices',
      excerpt: 'Learn how to make environmentally conscious decisions when furnishing your home.',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
      category: 'Trends',
      author: 'David Wilson',
      date: 'March 8, 2024',
      readTime: '8 min read'
    },
    {
      id: 5,
      title: 'Mixing Vintage and Modern Furniture',
      excerpt: 'Create a unique aesthetic by blending vintage pieces with contemporary designs.',
      image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800',
      category: 'Interior Design',
      author: 'Sarah Johnson',
      date: 'March 5, 2024',
      readTime: '6 min read'
    },
    {
      id: 6,
      title: 'The Art of Choosing the Right Lighting',
      excerpt: 'Illuminate your space effectively with our guide to selecting the perfect lighting fixtures.',
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800',
      category: 'Home Decor',
      author: 'Michael Chen',
      date: 'March 3, 2024',
      readTime: '5 min read'
    }
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="blog-page page-enter">
      <div className="page-header">
        <div className="container">
          <h1>Our Blog</h1>
          <p>Tips, trends, and inspiration for your home</p>
        </div>
      </div>

      <div className="container">
        <div className="blog-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category.toLowerCase() ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.toLowerCase())}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="blog-grid">
          {filteredPosts.map(post => (
            <article key={post.id} className="blog-card">
              <div className="blog-image-wrapper">
                <img src={post.image} alt={post.title} />
                <span className="blog-category-badge">{post.category}</span>
              </div>
              <div className="blog-content">
                <div className="blog-meta">
                  <span>
                    <FiCalendar /> {post.date}
                  </span>
                  <span>
                    <FiUser /> {post.author}
                  </span>
                  <span>{post.readTime}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <Link to={`/blog/${post.id}`} className="blog-link">
                  Read More <FiArrowRight />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="no-posts">
            <h3>No posts found in this category</h3>
            <p>Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;


import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import './Categories.css';

const Categories = () => {
  const categories = [
    {
      id: 'chair',
      name: 'Chairs',
      description: 'Comfortable and stylish chairs for every room',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      count: 24
    },
    {
      id: 'sofa',
      name: 'Sofas',
      description: 'Luxurious sofas for your living space',
      image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800',
      count: 18
    },
    {
      id: 'table',
      name: 'Tables',
      description: 'Functional and elegant tables',
      image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800',
      count: 32
    },
    {
      id: 'lighting',
      name: 'Lighting',
      description: 'Illuminate your space beautifully',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
      count: 15
    },
    {
      id: 'storage',
      name: 'Storage',
      description: 'Smart storage solutions',
      image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800',
      count: 21
    },
    {
      id: 'decor',
      name: 'Decor',
      description: 'Beautiful decorative pieces',
      image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800',
      count: 28
    }
  ];

  return (
    <div className="categories-page page-enter">
      <div className="page-header">
        <div className="container">
          <h1>Shop by Category</h1>
          <p>Explore our wide range of furniture categories</p>
        </div>
      </div>

      <div className="container">
        <div className="categories-grid">
          {categories.map(category => (
            <Link 
              key={category.id} 
              to={`/products?category=${category.id}`}
              className="category-card"
            >
              <div className="category-image-wrapper">
                <img src={category.image} alt={category.name} />
                <div className="category-overlay">
                  <span className="category-count">{category.count} Products</span>
                </div>
              </div>
              <div className="category-info">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <span className="category-link">
                  Shop Now <FiArrowRight />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="categories-cta">
          <h2>Can't find what you're looking for?</h2>
          <p>Browse our complete collection of premium furniture</p>
          <Link to="/products" className="btn btn-primary">
            View All Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Categories;


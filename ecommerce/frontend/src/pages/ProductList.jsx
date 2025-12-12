import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiGrid, FiList, FiFilter, FiX } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import './ProductList.css';

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('latest');

  const categories = ['All', 'Chair', 'Sofa', 'Table', 'Lighting', 'Storage', 'Decor'];

  // Mock products data
  const mockProducts = [
    { _id: '1', name: 'Wooden Sofa Chair', category: 'Chair', price: 80.00, originalPrice: 160.00, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', rating: 4.9, stock: 15 },
    { _id: '2', name: 'Circular Sofa Chair', category: 'Chair', price: 108.00, originalPrice: 120.00, image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800', rating: 5.0, stock: 10 },
    { _id: '3', name: 'Wooden Nightstand', category: 'Table', price: 54.00, originalPrice: 60.00, image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800', rating: 4.8, stock: 20 },
    { _id: '4', name: 'Bean Bag Chair', category: 'Chair', price: 72.00, originalPrice: 80.00, image: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800', rating: 4.6, stock: 8 },
    { _id: '5', name: 'Modern Pendant Light', category: 'Lighting', price: 95.00, originalPrice: 120.00, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800', rating: 4.7, stock: 12 },
    { _id: '6', name: 'Leather Sofa Set', category: 'Sofa', price: 450.00, originalPrice: 550.00, image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800', rating: 4.9, stock: 5 },
    { _id: '7', name: 'Coffee Table', category: 'Table', price: 120.00, originalPrice: 150.00, image: 'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800', rating: 4.5, stock: 18 },
    { _id: '8', name: 'Floor Lamp', category: 'Lighting', price: 85.00, originalPrice: 100.00, image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800', rating: 4.4, stock: 22 },
    { _id: '9', name: 'Bookshelf', category: 'Storage', price: 180.00, originalPrice: 220.00, image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800', rating: 4.6, stock: 7 },
    { _id: '10', name: 'Wall Mirror', category: 'Decor', price: 65.00, originalPrice: 80.00, image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800', rating: 4.8, stock: 25 },
    { _id: '11', name: 'Office Chair', category: 'Chair', price: 199.00, originalPrice: 250.00, image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800', rating: 4.7, stock: 14 },
    { _id: '12', name: 'Dining Table Set', category: 'Table', price: 380.00, originalPrice: 450.00, image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800', rating: 4.9, stock: 6 },
  ];

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      let filtered = [...mockProducts];
      
      if (selectedCategory !== 'all' && selectedCategory !== 'All') {
        filtered = filtered.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
      }
      
      filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
      
      if (sortBy === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      }
      
      setProducts(filtered);
      setLoading(false);
    }, 500);
  }, [selectedCategory, priceRange, sortBy]);

  return (
    <div className="product-list-page page-enter">
      <div className="page-header">
        <div className="container">
          <h1>Shop All Products</h1>
          <p>Discover our collection of premium furniture</p>
        </div>
      </div>

      <div className="container">
        <div className="shop-layout">
          {/* Filters Sidebar */}
          <aside className={`filters-sidebar ${showFilters ? 'active' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              <button className="close-filters" onClick={() => setShowFilters(false)}>
                <FiX />
              </button>
            </div>

            <div className="filter-group">
              <h4>Categories</h4>
              <div className="category-filters">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`category-btn ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.toLowerCase())}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="input"
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="input"
                />
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="products-container">
            <div className="products-toolbar">
              <div className="toolbar-left">
                <button 
                  className="filter-toggle btn btn-secondary"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FiFilter /> Filters
                </button>
                <span className="results-count">{products.length} products found</span>
              </div>
              <div className="toolbar-right">
                <select 
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="latest">Latest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Best Rating</option>
                </select>
                <div className="view-toggles">
                  <button 
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <FiGrid />
                  </button>
                  <button 
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <FiList />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="loading-grid">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="skeleton-card">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text short"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={`products-grid ${viewMode}`}>
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;


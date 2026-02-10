import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiGrid, FiList, FiFilter, FiX } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import './ProductList.css';

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const baseCategories = ['All', 'Chair', 'Sofa', 'Table', 'Lighting', 'Storage', 'Decor'];
  const [categories, setCategories] = useState(baseCategories);

  // Mock products data - existing demo products
  const mockProducts = [
    // Chairs
    { _id: '1', name: 'Wooden Sofa Chair', category: 'Chair', price: 80.00, originalPrice: 160.00, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', rating: 4.9, stock: 15 },
    { _id: '2', name: 'Circular Sofa Chair', category: 'Chair', price: 108.00, originalPrice: 120.00, image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800', rating: 5.0, stock: 10 },
    { _id: '4', name: 'Bean Bag Chair', category: 'Chair', price: 72.00, originalPrice: 80.00, image: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800', rating: 4.6, stock: 8 },
    { _id: '11', name: 'Office Chair', category: 'Chair', price: 199.00, originalPrice: 250.00, image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800', rating: 4.7, stock: 14 },
    { _id: '13', name: 'Modern Accent Chair', category: 'Chair', price: 125.00, originalPrice: 150.00, image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800', rating: 4.8, stock: 12 },
    { _id: '14', name: 'Recliner Chair', category: 'Chair', price: 320.00, originalPrice: 400.00, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', rating: 4.9, stock: 6 },
    { _id: '15', name: 'Dining Chair Set (4)', category: 'Chair', price: 180.00, originalPrice: 220.00, image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800', rating: 4.6, stock: 8 },
    { _id: '16', name: 'Rocking Chair', category: 'Chair', price: 145.00, originalPrice: 180.00, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', rating: 4.7, stock: 9 },
    { _id: '17', name: 'Bar Stool', category: 'Chair', price: 95.00, originalPrice: 120.00, image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800', rating: 4.5, stock: 15 },
    { _id: '18', name: 'Wingback Chair', category: 'Chair', price: 280.00, originalPrice: 350.00, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', rating: 4.8, stock: 7 },
    
    // Sofas
    { _id: '6', name: 'Leather Sofa Set', category: 'Sofa', price: 450.00, originalPrice: 550.00, image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800', rating: 4.9, stock: 5 },
    { _id: '19', name: 'Sectional Sofa', category: 'Sofa', price: 680.00, originalPrice: 850.00, image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800', rating: 4.9, stock: 4 },
    { _id: '20', name: 'Loveseat Sofa', category: 'Sofa', price: 320.00, originalPrice: 400.00, image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800', rating: 4.7, stock: 8 },
    { _id: '21', name: 'Fabric Sofa', category: 'Sofa', price: 420.00, originalPrice: 520.00, image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800', rating: 4.8, stock: 6 },
    { _id: '22', name: 'Convertible Sofa Bed', category: 'Sofa', price: 550.00, originalPrice: 680.00, image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800', rating: 4.6, stock: 5 },
    { _id: '23', name: 'Modern Sofa', category: 'Sofa', price: 380.00, originalPrice: 480.00, image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800', rating: 4.7, stock: 7 },
    { _id: '24', name: 'Chaise Lounge', category: 'Sofa', price: 290.00, originalPrice: 360.00, image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800', rating: 4.8, stock: 6 },
    
    // Tables
    { _id: '3', name: 'Wooden Nightstand', category: 'Table', price: 54.00, originalPrice: 60.00, image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800', rating: 4.8, stock: 20 },
    { _id: '7', name: 'Coffee Table', category: 'Table', price: 120.00, originalPrice: 150.00, image: 'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800', rating: 4.5, stock: 18 },
    { _id: '12', name: 'Dining Table Set', category: 'Table', price: 380.00, originalPrice: 450.00, image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800', rating: 4.9, stock: 6 },
    { _id: '25', name: 'Console Table', category: 'Table', price: 165.00, originalPrice: 200.00, image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800', rating: 4.6, stock: 12 },
    { _id: '26', name: 'Side Table', category: 'Table', price: 75.00, originalPrice: 95.00, image: 'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800', rating: 4.5, stock: 16 },
    { _id: '27', name: 'End Table', category: 'Table', price: 88.00, originalPrice: 110.00, image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800', rating: 4.7, stock: 14 },
    { _id: '28', name: 'Dining Table (6 Seater)', category: 'Table', price: 450.00, originalPrice: 550.00, image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800', rating: 4.8, stock: 5 },
    { _id: '29', name: 'Round Coffee Table', category: 'Table', price: 135.00, originalPrice: 170.00, image: 'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800', rating: 4.6, stock: 11 },
    { _id: '30', name: 'Kitchen Island', category: 'Table', price: 520.00, originalPrice: 650.00, image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800', rating: 4.9, stock: 4 },
    
    // Lighting
    { _id: '5', name: 'Modern Pendant Light', category: 'Lighting', price: 95.00, originalPrice: 120.00, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800', rating: 4.7, stock: 12 },
    { _id: '8', name: 'Floor Lamp', category: 'Lighting', price: 85.00, originalPrice: 100.00, image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800', rating: 4.4, stock: 22 },
    { _id: '31', name: 'Table Lamp', category: 'Lighting', price: 45.00, originalPrice: 60.00, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800', rating: 4.5, stock: 25 },
    { _id: '32', name: 'Chandelier', category: 'Lighting', price: 280.00, originalPrice: 350.00, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800', rating: 4.8, stock: 8 },
    { _id: '33', name: 'Wall Sconce', category: 'Lighting', price: 65.00, originalPrice: 85.00, image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800', rating: 4.6, stock: 18 },
    { _id: '34', name: 'Desk Lamp', category: 'Lighting', price: 55.00, originalPrice: 70.00, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800', rating: 4.7, stock: 20 },
    { _id: '35', name: 'String Lights', category: 'Lighting', price: 35.00, originalPrice: 45.00, image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800', rating: 4.4, stock: 30 },
    { _id: '36', name: 'Track Lighting', category: 'Lighting', price: 120.00, originalPrice: 150.00, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800', rating: 4.6, stock: 10 },
    
    // Storage
    { _id: '9', name: 'Bookshelf', category: 'Storage', price: 180.00, originalPrice: 220.00, image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800', rating: 4.6, stock: 7 },
    { _id: '37', name: 'Wardrobe', category: 'Storage', price: 420.00, originalPrice: 520.00, image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800', rating: 4.8, stock: 5 },
    { _id: '38', name: 'Chest of Drawers', category: 'Storage', price: 250.00, originalPrice: 320.00, image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800', rating: 4.7, stock: 8 },
    { _id: '39', name: 'TV Stand', category: 'Storage', price: 195.00, originalPrice: 240.00, image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800', rating: 4.6, stock: 10 },
    { _id: '40', name: 'Storage Cabinet', category: 'Storage', price: 220.00, originalPrice: 280.00, image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800', rating: 4.5, stock: 9 },
    { _id: '41', name: 'Shoe Rack', category: 'Storage', price: 75.00, originalPrice: 95.00, image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800', rating: 4.4, stock: 15 },
    { _id: '42', name: 'Display Cabinet', category: 'Storage', price: 320.00, originalPrice: 400.00, image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800', rating: 4.8, stock: 6 },
    { _id: '43', name: 'Storage Bench', category: 'Storage', price: 145.00, originalPrice: 180.00, image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800', rating: 4.6, stock: 11 },
    
    // Decor
    { _id: '10', name: 'Wall Mirror', category: 'Decor', price: 65.00, originalPrice: 80.00, image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800', rating: 4.8, stock: 25 },
    { _id: '44', name: 'Decorative Vase', category: 'Decor', price: 45.00, originalPrice: 60.00, image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800', rating: 4.5, stock: 20 },
    { _id: '45', name: 'Wall Art Set', category: 'Decor', price: 85.00, originalPrice: 110.00, image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800', rating: 4.7, stock: 18 },
    { _id: '46', name: 'Throw Pillows (Set of 4)', category: 'Decor', price: 55.00, originalPrice: 70.00, image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800', rating: 4.6, stock: 22 },
    { _id: '47', name: 'Area Rug', category: 'Decor', price: 180.00, originalPrice: 230.00, image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800', rating: 4.8, stock: 12 },
    { _id: '48', name: 'Curtains Set', category: 'Decor', price: 95.00, originalPrice: 120.00, image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800', rating: 4.5, stock: 16 },
    { _id: '49', name: 'Decorative Cushions', category: 'Decor', price: 35.00, originalPrice: 45.00, image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800', rating: 4.4, stock: 28 },
    { _id: '50', name: 'Plant Stand', category: 'Decor', price: 65.00, originalPrice: 85.00, image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800', rating: 4.6, stock: 19 },
  ];

  useEffect(() => {
    const fetchAndMergeProducts = async () => {
      setLoading(true);
      setCurrentPage(1);

      try {
        const res = await fetch('http://localhost:5000/api/products/products');
        let dbProducts = [];
        if (res.ok) {
          const data = await res.json();
          dbProducts = Array.isArray(data) ? data : [];
        }

        const merged = [...mockProducts, ...dbProducts];

        const catSet = new Set(baseCategories);
        merged.forEach(p => {
          if (p.category && p.category.trim()) {
            catSet.add(p.category.trim());
          }
        });
        setCategories(Array.from(catSet));

        let filtered = [...merged];

        if (selectedCategory !== 'all' && selectedCategory !== 'All') {
          filtered = filtered.filter(
            p =>
              p.category &&
              p.category.toLowerCase() === selectedCategory.toLowerCase()
          );
        }

        filtered = filtered.filter(
          p => p.price >= priceRange[0] && p.price <= priceRange[1]
        );

        if (sortBy === 'price-low') {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
          filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating') {
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }

        setAllProducts(filtered);
        setDisplayedProducts(filtered.slice(0, productsPerPage));
      } catch (error) {
        console.error('Failed to load products from server, using defaults only:', error);
        let filtered = [...mockProducts];

        if (selectedCategory !== 'all' && selectedCategory !== 'All') {
          filtered = filtered.filter(
            p =>
              p.category &&
              p.category.toLowerCase() === selectedCategory.toLowerCase()
          );
        }

        filtered = filtered.filter(
          p => p.price >= priceRange[0] && p.price <= priceRange[1]
        );

        if (sortBy === 'price-low') {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
          filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating') {
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }

        setAllProducts(filtered);
        setDisplayedProducts(filtered.slice(0, productsPerPage));
      } finally {
        setLoading(false);
      }
    };

    fetchAndMergeProducts();
  }, [selectedCategory, priceRange, sortBy]);

  // Load more products when page changes
  useEffect(() => {
    const endIndex = currentPage * productsPerPage;
    setDisplayedProducts(allProducts.slice(0, endIndex));
  }, [currentPage, allProducts]);

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const hasMoreProducts = displayedProducts.length < allProducts.length;

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
                <span className="results-count">{allProducts.length} products found</span>
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
            ) : displayedProducts.length > 0 ? (
              <>
                <div className={`products-grid ${viewMode}`}>
                  {displayedProducts.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                
                {hasMoreProducts && (
                  <div className="load-more-container">
                    <button className="btn btn-secondary load-more-btn" onClick={handleLoadMore}>
                      Load More Products
                    </button>
                    <p className="load-more-info">
                      Showing {displayedProducts.length} of {allProducts.length} products
                    </p>
                  </div>
                )}
              </>
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


import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import toast from 'react-hot-toast';
import './Profile.css';

const Admin = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: ''
  });
  const [savingProduct, setSavingProduct] = useState(false);

  const baseCategories = ['Chair', 'Sofa', 'Table', 'Lighting', 'Storage', 'Decor'];

  useEffect(() => {
    if (!user || !user.isAdmin) {
      toast.error('You are not authorized to view this page');
      navigate('/');
    }
  }, [user, navigate]);

  const fetchUsers = async () => {
    if (!user) return;
    setLoadingUsers(true);
    try {
      const res = await fetch('http://localhost:5000/api/users/admin/users', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;
    setLoadingOrders(true);
    try {
      const res = await fetch('http://localhost:5000/api/payments/admin/orders', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(data.orders || []);
      } else {
        throw new Error(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchProducts = async () => {
    if (!user) return;
    setLoadingProducts(true);
    try {
      const res = await fetch('http://localhost:5000/api/products/products', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchUsers();
      fetchOrders();
      fetchProducts();
    }
  }, [user]);

  const handleProductChange = (field, value) => {
    setProductForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!productForm.name || !productForm.description || !productForm.price || !productForm.image || !productForm.category || !productForm.stock) {
      toast.error('Please fill all product fields');
      return;
    }

    setSavingProduct(true);
    try {
      const res = await fetch('http://localhost:5000/api/products/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          name: productForm.name,
          description: productForm.description,
          price: Number(productForm.price),
          image: productForm.image,
          category: productForm.category,
          stock: Number(productForm.stock)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add product');
      }

      toast.success('Product added successfully');
      setProductForm({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        stock: ''
      });
      fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Failed to add product');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!user || !productId) return;

    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete product');
      }

      toast.success('Product deleted successfully');
      setProducts(prev => prev.filter(p => p._id !== productId));
    } catch (error) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="profile-page page-enter">
      <div className="container">
        <div className="profile-header">
          <h1>Admin Dashboard</h1>
          <p>Manage users, products and orders</p>
        </div>

        <div className="profile-layout">
          <div className="profile-card">
            <div className="profile-card-header">
              <div className="profile-avatar">
                <span>AD</span>
              </div>
              <h2>{user.name}</h2>
              <p className="profile-email">{user.email}</p>
            </div>

            <div className="profile-info">
              <div className="info-item">
                <div>
                  <span className="info-label">Role</span>
                  <span className="info-value">Administrator</span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <div className="orders-header">
                <h2>Admin Sections</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveTab('users')}
                >
                  All Users
                </button>
                <button
                  className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveTab('products')}
                >
                  Products
                </button>
                <button
                  className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveTab('orders')}
                >
                  All Orders
                </button>
              </div>
            </div>
          </div>

          <div className="orders-section">
            {activeTab === 'users' && (
              <>
                <div className="orders-header">
                  <h2>All Users</h2>
                </div>
                {loadingUsers ? (
                  <p>Loading users...</p>
                ) : users.length === 0 ? (
                  <p>No users found.</p>
                ) : (
                  <div className="orders-list">
                    {users.map(u => (
                      <div key={u._id} className="order-card">
                        <div className="order-header">
                          <div>
                            <h3>{u.name}</h3>
                            <p className="order-date">{u.email}</p>
                          </div>
                          <span className={`order-status ${u.isAdmin ? 'paid' : 'pending'}`}>
                            {u.isAdmin ? 'Admin' : 'Customer'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'products' && (
              <>
                <div className="orders-header">
                  <h2>Manage Products</h2>
                </div>
                <form onSubmit={handleAddProduct} className="auth-form" style={{ marginBottom: '24px' }}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      id="name"
                      type="text"
                      className="input"
                      value={productForm.name}
                      onChange={e => handleProductChange('name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      className="input"
                      rows="3"
                      value={productForm.description}
                      onChange={e => handleProductChange('description', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                      id="price"
                      type="number"
                      className="input"
                      value={productForm.price}
                      onChange={e => handleProductChange('price', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="image">Image URL</label>
                    <input
                      id="image"
                      type="text"
                      className="input"
                      value={productForm.image}
                      onChange={e => handleProductChange('image', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      className="input"
                      value={productForm.category || ''}
                      onChange={e => {
                        const value = e.target.value;
                        if (value === '__custom__') {
                          handleProductChange('category', '');
                        } else {
                          handleProductChange('category', value);
                        }
                      }}
                    >
                      <option value="">Select category</option>
                      {baseCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="__custom__">Custom...</option>
                    </select>
                    {productForm.category === '' && (
                      <input
                        type="text"
                        className="input"
                        style={{ marginTop: '8px' }}
                        placeholder="Enter custom category"
                        value={productForm.category}
                        onChange={e => handleProductChange('category', e.target.value)}
                      />
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="stock">Stock</label>
                    <input
                      id="stock"
                      type="number"
                      className="input"
                      value={productForm.stock}
                      onChange={e => handleProductChange('stock', e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={savingProduct}
                  >
                    {savingProduct ? 'Saving...' : 'Add Product'}
                  </button>
                </form>

                <div className="orders-header" style={{ marginTop: '8px' }}>
                  <h2>All Products</h2>
                </div>

                {loadingProducts ? (
                  <p>Loading products...</p>
                ) : products.length === 0 ? (
                  <p>No products found.</p>
                ) : (
                  <div className="orders-list">
                    {products.map(product => (
                      <div key={product._id} className="order-card">
                        <div className="order-header">
                          <div>
                            <h3>{product.name}</h3>
                            <p className="order-date">
                              {product.category || 'Uncategorized'} • ₹{Number(product.price || 0).toFixed(2)}
                            </p>
                          </div>
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'orders' && (
              <>
                <div className="orders-header">
                  <h2>All Orders</h2>
                </div>
                {loadingOrders ? (
                  <p>Loading orders...</p>
                ) : orders.length === 0 ? (
                  <p>No orders found.</p>
                ) : (
                  <div className="orders-list">
                    {orders.map(order => (
                      <div key={order._id} className="order-card">
                        <div className="order-header">
                          <div>
                            <h3>Order #{order.razorpayOrderId?.slice(-8) || order._id?.slice(-8)}</h3>
                            <p className="order-date">
                              {order.user?.name} ({order.user?.email})
                            </p>
                          </div>
                          <span className={`order-status ${order.isPaid ? 'paid' : 'pending'}`}>
                            {order.isPaid ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                        <div className="order-items">
                          {order.orderItems?.map((item, idx) => (
                            <div key={idx} className="order-item">
                              <img src={item.image} alt={item.name} />
                              <div className="order-item-details">
                                <h4>{item.name}</h4>
                                <p>Quantity: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                              </div>
                              <span className="order-item-total">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="order-footer">
                          <div className="order-total">
                            <span>Total:</span>
                            <strong>₹{order.totalPrice?.toFixed(2) || '0.00'}</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;



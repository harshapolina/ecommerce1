import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiCalendar, FiShoppingBag, FiLogOut } from 'react-icons/fi';
import { AuthContext } from '../App';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error('Please login to view your profile');
      navigate('/login');
      return;
    }
    
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/payments/orders', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setOrders(data.orders || []);
          }
        } else {
          setOrders([]);
        }
      } catch (error) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page page-enter">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account and view your orders</p>
        </div>

        <div className="profile-layout">
          <div className="profile-card">
            <div className="profile-card-header">
              <div className="profile-avatar">
                <FiUser />
              </div>
              <h2>{user.name}</h2>
              <p className="profile-email">{user.email}</p>
            </div>

            <div className="profile-info">
              <div className="info-item">
                <FiUser className="info-icon" />
                <div>
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{user.name}</span>
                </div>
              </div>

              <div className="info-item">
                <FiMail className="info-icon" />
                <div>
                  <span className="info-label">Email Address</span>
                  <span className="info-value">{user.email}</span>
                </div>
              </div>

              <div className="info-item">
                <FiCalendar className="info-icon" />
                <div>
                  <span className="info-label">Member Since</span>
                  <span className="info-value">
                    {user.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString() 
                      : 'Recently joined'}
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <button className="btn btn-secondary" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            </div>
          </div>

          <div className="orders-section">
            <div className="orders-header">
              <h2>
                <FiShoppingBag /> Order History
              </h2>
            </div>

            {loading ? (
              <div className="loading-state">
                <p>Loading orders...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order._id || order.razorpayOrderId} className="order-card">
                    <div className="order-header">
                      <div>
                        <h3>Order #{order.razorpayOrderId?.slice(-8) || order._id?.slice(-8) || 'N/A'}</h3>
                        <p className="order-date">
                          {order.createdAt 
                            ? new Date(order.createdAt).toLocaleString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : order.paidAt
                            ? new Date(order.paidAt).toLocaleString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : 'Date not available'}
                        </p>
                      </div>
                      <span className={`order-status ${order.isPaid ? 'paid' : 'pending'}`}>
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </div>

                    <div className="order-items">
                      {order.orderItems && order.orderItems.length > 0 ? (
                        order.orderItems.map((item, idx) => (
                          <div key={idx} className="order-item">
                            <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name || 'Product'} />
                            <div className="order-item-details">
                              <h4>{item.name || 'Product'}</h4>
                              <p>Quantity: {item.quantity || 1} × ₹{(item.price || 0).toFixed(2)}</p>
                            </div>
                            <span className="order-item-total">
                              ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p style={{ padding: '16px', color: '#666' }}>No items found in this order</p>
                      )}
                    </div>

                    <div className="order-footer">
                      <div className="order-total">
                        <span>Total:</span>
                        <strong>₹{order.totalPrice?.toFixed(2) || '0.00'}</strong>
                      </div>
                      {order.isPaid && order.paidAt && (
                        <p className="paid-date">
                          Paid on: {new Date(order.paidAt).toLocaleString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-orders">
                <FiShoppingBag className="no-orders-icon" />
                <h3>No orders yet</h3>
                <p>Start shopping to see your orders here</p>
                <Link to="/products" className="btn btn-primary">
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


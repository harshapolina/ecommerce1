import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiCalendar, FiShoppingBag, FiLogOut, FiEdit2 } from 'react-icons/fi';
import { AuthContext } from '../App';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
  const { user, logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error('Please login to view your profile');
      navigate('/login');
      return;
    }
    // Load user orders from localStorage or API
    const savedOrders = localStorage.getItem(`orders_${user._id || user.email}`);
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
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
          {/* Profile Info Card */}
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

          {/* Orders Section */}
          <div className="orders-section">
            <div className="orders-header">
              <h2>
                <FiShoppingBag /> Order History
              </h2>
            </div>

            {orders.length > 0 ? (
              <div className="orders-list">
                {orders.map((order, index) => (
                  <div key={index} className="order-card">
                    <div className="order-header">
                      <div>
                        <h3>Order #{order.orderId || `ORD-${Date.now()}-${index + 1}`}</h3>
                        <p className="order-date">
                          {order.date || new Date().toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`order-status ${order.status || 'completed'}`}>
                        {order.status || 'Completed'}
                      </span>
                    </div>

                    <div className="order-items">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="order-item">
                          <img src={item.image} alt={item.name} />
                          <div className="order-item-details">
                            <h4>{item.name}</h4>
                            <p>Quantity: {item.quantity} × ${item.price.toFixed(2)}</p>
                          </div>
                          <span className="order-item-total">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="order-footer">
                      <div className="order-total">
                        <span>Total:</span>
                        <strong>${order.total?.toFixed(2) || '0.00'}</strong>
                      </div>
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


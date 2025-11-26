import { useState, useEffect } from 'react';
import './AdminHome.css';

function AdminHome() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalDishes: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    pendingOrders: 0,
    todayOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('hotel_jwt');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        );
        const userData = JSON.parse(jsonPayload);
        setUser(userData);
        
        if (userData.role !== 'ADMIN') {
          window.location.href = '/';
          return;
        }
        fetchDashboardData();
      } catch (err) {
        console.error('Error parsing token:', err);
        window.location.href = '/';
      }
    } else {
      window.location.href = '/';
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('hotel_jwt');
      
      // Fetch dishes
      const dishRes = await fetch('http://localhost:8080/api/dishes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dishData = await dishRes.json();

      // Fetch orders
      const orderRes = await fetch('http://localhost:8080/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const orderData = await orderRes.json();

      // Calculate stats
      const totalRevenue = orderData.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const pendingOrders = orderData.filter(o => o.status === 'PENDING').length;
      const today = new Date().toDateString();
      const todayOrders = orderData.filter(o => 
        new Date(o.orderDate || Date.now()).toDateString() === today
      ).length;

      setStats({
        totalDishes: dishData.length,
        totalOrders: orderData.length,
        totalRevenue: totalRevenue,
        totalUsers: 150,
        pendingOrders: pendingOrders,
        todayOrders: todayOrders
      });

      // Set recent orders (last 5)
      setRecentOrders(orderData.slice(0, 5));

      // Mock recent activity
      setRecentActivity([
        { id: 1, action: 'New order placed', user: 'John Doe', time: '2 min ago', icon: '📦', color: '#10b981' },
        { id: 2, action: 'Dish updated', dish: 'Butter Chicken', time: '15 min ago', icon: '✏️', color: '#f59e0b' },
        { id: 3, action: 'Order delivered', user: 'Jane Smith', time: '1 hour ago', icon: '✓', color: '#059669' },
        { id: 4, action: 'New user registered', user: 'Mike Wilson', time: '2 hours ago', icon: '👤', color: '#3b82f6' },
        { id: 5, action: 'Payment received', amount: '₹850', time: '3 hours ago', icon: '💰', color: '#8b5cf6' }
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hotel_jwt');
    window.location.href = '/';
  };

  const navigateToDashboard = () => {
    window.location.href = '/admin/dashboard';
  };

  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-home">
      {/* Header */}
      <header className="admin-home-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-section">
              <span className="logo-icon">🍽️</span>
              <div>
                <h1 className="site-title">FreshCart Admin</h1>
                <p className="site-tagline">Restaurant Management Portal</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <div className="welcome-section">
              <span className="welcome-text">Welcome back,</span>
              <span className="admin-name">{user?.sub || 'Admin'}</span>
            </div>
            <button className="dashboard-btn" onClick={navigateToDashboard}>
              🛠️ Dashboard
            </button>
            <button className="header-logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="admin-hero">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        <div className="hero-content">
          <h2 className="hero-title">Control Center</h2>
          <p className="hero-subtitle">Manage your restaurant operations with ease</p>
          <div className="hero-time">
            <span className="time-icon">🕐</span>
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </section>

      {/* Quick Stats Grid */}
      <section className="quick-stats">
        <div className="stats-container">
          <div className="stat-card stat-primary">
            <div className="stat-header">
              <span className="stat-icon">💰</span>
              <span className="stat-label">Total Revenue</span>
            </div>
            <h3 className="stat-value">₹{stats.totalRevenue.toFixed(2)}</h3>
            <p className="stat-change positive">↗ +12.5% from last month</p>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-header">
              <span className="stat-icon">📦</span>
              <span className="stat-label">Total Orders</span>
            </div>
            <h3 className="stat-value">{stats.totalOrders}</h3>
            <p className="stat-change positive">↗ +8.3% from last week</p>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-header">
              <span className="stat-icon">⏳</span>
              <span className="stat-label">Pending Orders</span>
            </div>
            <h3 className="stat-value">{stats.pendingOrders}</h3>
            <p className="stat-change neutral">Requires attention</p>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-header">
              <span className="stat-icon">🍽️</span>
              <span className="stat-label">Menu Items</span>
            </div>
            <h3 className="stat-value">{stats.totalDishes}</h3>
            <p className="stat-change positive">Active and available</p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="main-content">
        <div className="content-grid">
          {/* Recent Orders */}
          <div className="content-card recent-orders-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="title-icon">📋</span>
                Recent Orders
              </h3>
              <button className="view-all-btn" onClick={navigateToDashboard}>View All →</button>
            </div>
            <div className="card-content">
              {recentOrders.length > 0 ? (
                <div className="orders-list">
                  {recentOrders.map(order => (
                    <div key={order.id} className="order-item">
                      <div className="order-info">
                        <span className="order-id">#{order.id}</span>
                        <span className={`order-status status-${(order.status || 'PENDING').toLowerCase()}`}>
                          {order.status || 'PENDING'}
                        </span>
                      </div>
                      <div className="order-details">
                        <span className="order-amount">₹{order.totalAmount?.toFixed(2) || '0.00'}</span>
                        <span className="order-time">
                          {new Date(order.orderDate || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">📦</span>
                  <p>No orders yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="content-card activity-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="title-icon">⚡</span>
                Recent Activity
              </h3>
            </div>
            <div className="card-content">
              <div className="activity-list">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon" style={{ background: activity.color }}>
                      {activity.icon}
                    </div>
                    <div className="activity-details">
                      <p className="activity-action">{activity.action}</p>
                      <span className="activity-meta">
                        {activity.user || activity.dish || activity.amount}
                      </span>
                    </div>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h3 className="section-heading">Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-card" onClick={() => window.location.href = '/admin/dashboard'}>
            <span className="action-icon">➕</span>
            <span className="action-label">Add New Dish</span>
          </button>
          <button className="action-card" onClick={() => window.location.href = '/admin/dashboard'}>
            <span className="action-icon">📊</span>
            <span className="action-label">View Reports</span>
          </button>
          <button className="action-card" onClick={() => window.location.href = '/admin/dashboard'}>
            <span className="action-icon">⚙️</span>
            <span className="action-label">Settings</span>
          </button>
          <button className="action-card" onClick={() => window.location.href = '/admin/dashboard'}>
            <span className="action-icon">👥</span>
            <span className="action-label">Manage Users</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="admin-footer">
        <div className="footer-content">
          <p>&copy; 2024 FreshCart Admin. All rights reserved.</p>
          <div className="footer-links">
            <a href="/help">Help</a>
            <a href="/docs">Documentation</a>
            <a href="/support">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AdminHome;
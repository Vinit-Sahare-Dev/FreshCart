import { useState, useEffect } from 'react';

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dishes');
  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalDishes: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0
  });

  const [showDishModal, setShowDishModal] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [dishForm, setDishForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'veg',
    imageUrl: '',
    available: true
  });

  useEffect(() => {
    // Get user from token
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
        fetchData();
      } catch (err) {
        console.error('Error parsing token:', err);
        window.location.href = '/';
      }
    } else {
      window.location.href = '/';
    }
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('hotel_jwt');
      
      const dishRes = await fetch('http://localhost:8080/api/dishes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dishData = await dishRes.json();
      setDishes(dishData);

      const orderRes = await fetch('http://localhost:8080/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const orderData = await orderRes.json();
      setOrders(orderData);

      setStats({
        totalDishes: dishData.length,
        totalOrders: orderData.length,
        totalRevenue: orderData.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
        totalUsers: 150
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hotel_jwt');
    window.location.href = '/';
  };

  const handleCreateDish = () => {
    setEditingDish(null);
    setDishForm({
      name: '',
      description: '',
      price: '',
      category: 'veg',
      imageUrl: '',
      available: true
    });
    setShowDishModal(true);
  };

  const handleEditDish = (dish) => {
    setEditingDish(dish);
    setDishForm({
      name: dish.name || '',
      description: dish.description || '',
      price: dish.price || '',
      category: dish.category || 'veg',
      imageUrl: dish.imageUrl || '',
      available: dish.available !== false
    });
    setShowDishModal(true);
  };

  const handleSaveDish = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('hotel_jwt');
      const url = editingDish 
        ? `http://localhost:8080/api/dishes/${editingDish.id}`
        : 'http://localhost:8080/api/dishes';
      
      const method = editingDish ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dishForm)
      });

      if (response.ok) {
        setShowDishModal(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error saving dish:', error);
    }
  };

  const handleDeleteDish = async (id) => {
    if (!window.confirm('Are you sure you want to delete this dish?')) return;
    
    try {
      const token = localStorage.getItem('hotel_jwt');
      const response = await fetch(`http://localhost:8080/api/dishes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('hotel_jwt');
      const response = await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
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
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-left">
          <h1 className="admin-title">🛠️ Admin Dashboard</h1>
          <p className="admin-subtitle">Manage your restaurant</p>
        </div>
        <div className="header-right">
          <span className="admin-user">👤 {user?.sub || 'Admin'}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🍽️</div>
          <div className="stat-info">
            <h3>{stats.totalDishes}</h3>
            <p>Total Dishes</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>₹{stats.totalRevenue.toFixed(2)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'dishes' ? 'active' : ''}`}
          onClick={() => setActiveTab('dishes')}
        >
          🍽️ Dishes
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 Orders
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'dishes' && (
          <div className="dishes-section">
            <div className="section-header">
              <h2>Manage Dishes</h2>
              <button className="add-btn" onClick={handleCreateDish}>
                ➕ Add New Dish
              </button>
            </div>
            
            <div className="dishes-table">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dishes.map(dish => (
                    <tr key={dish.id}>
                      <td>
                        <div className="dish-img-cell">
                          {dish.imageUrl ? (
                            <img src={dish.imageUrl} alt={dish.name} />
                          ) : (
                            <div className="no-image">📷</div>
                          )}
                        </div>
                      </td>
                      <td><strong>{dish.name}</strong></td>
                      <td>
                        <span className={`category-badge ${dish.category}`}>
                          {dish.category === 'veg' && '🌱 Veg'}
                          {dish.category === 'nonveg' && '🍗 Non-Veg'}
                          {dish.category === 'dairy' && '🥛 Dairy'}
                        </span>
                      </td>
                      <td>₹{dish.price}</td>
                      <td>
                        <span className={`status-badge ${dish.available ? 'available' : 'unavailable'}`}>
                          {dish.available ? '✓ Available' : '✗ Unavailable'}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="edit-btn" onClick={() => handleEditDish(dish)}>
                            ✏️
                          </button>
                          <button className="delete-btn" onClick={() => handleDeleteDish(dish.id)}>
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>Recent Orders</h2>
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{new Date(order.orderDate || Date.now()).toLocaleDateString()}</td>
                      <td>₹{order.totalAmount?.toFixed(2) || '0.00'}</td>
                      <td>
                        <select 
                          value={order.status || 'PENDING'}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <button className="view-btn">👁️ View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <h2>Analytics & Reports</h2>
            <div className="charts-grid">
              <div className="chart-card">
                <h3>📈 Sales Overview</h3>
                <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>
                  Total Revenue: ₹{stats.totalRevenue.toFixed(2)}
                </p>
                <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>
                  Average Order: ₹{(stats.totalRevenue / Math.max(stats.totalOrders, 1)).toFixed(2)}
                </p>
              </div>
              <div className="chart-card">
                <h3>🍽️ Menu Stats</h3>
                <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>
                  Total Dishes: {stats.totalDishes}
                </p>
                <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>
                  Active Dishes: {dishes.filter(d => d.available).length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {showDishModal && (
        <div className="modal-overlay" onClick={() => setShowDishModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingDish ? 'Edit Dish' : 'Add New Dish'}</h2>
              <button className="modal-close" onClick={() => setShowDishModal(false)}>×</button>
            </div>
            <div style={{ padding: '2rem' }}>
              <div className="form-group">
                <label>Dish Name *</label>
                <input
                  type="text"
                  value={dishForm.name}
                  onChange={e => setDishForm({...dishForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={dishForm.description}
                  onChange={e => setDishForm({...dishForm, description: e.target.value})}
                  rows="3"
                  style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #e5e7eb', borderRadius: '0.75rem', fontSize: '0.95rem', fontFamily: 'inherit' }}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    value={dishForm.price}
                    onChange={e => setDishForm({...dishForm, price: e.target.value})}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={dishForm.category}
                    onChange={e => setDishForm({...dishForm, category: e.target.value})}
                    style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #e5e7eb', borderRadius: '0.75rem', fontSize: '0.95rem' }}
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="nonveg">Non-Vegetarian</option>
                    <option value="dairy">Dairy/Dessert</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={dishForm.imageUrl}
                  onChange={e => setDishForm({...dishForm, imageUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="form-group checkbox-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={dishForm.available}
                    onChange={e => setDishForm({...dishForm, available: e.target.checked})}
                    style={{ width: 'auto', cursor: 'pointer' }}
                  />
                  <span>Available</span>
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowDishModal(false)}>
                  Cancel
                </button>
                <button type="button" className="save-btn" onClick={handleSaveDish}>
                  {editingDish ? 'Update' : 'Create'} Dish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
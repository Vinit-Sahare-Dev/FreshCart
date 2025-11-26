import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import dishService from '../services/dishService'
import orderService from '../services/orderService'
import './AdminDashboard.css'

function AdminDashboard() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [dishes, setDishes] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      navigate('/')
    }
  }, [isAuthenticated, user, navigate])

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [dishesData, ordersData] = await Promise.all([
          dishService.getAllDishes(),
          orderService.getAllOrders()
        ])
        setDishes(dishesData || [])
        setOrders(ordersData || [])
      } catch (err) {
        setError('Failed to load data: ' + err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Calculate stats
  const stats = {
    totalDishes: dishes.length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'PENDING').length,
    completedOrders: orders.filter(o => o.status === 'COMPLETED').length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.fullName || user?.name}!</p>
      </div>

      {error && (
        <div className="admin-error">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Stats Cards */}
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
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.pendingOrders}</h3>
            <p>Pending Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>₹{stats.totalRevenue.toFixed(2)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'dishes' ? 'active' : ''}`}
          onClick={() => setActiveTab('dishes')}
        >
          Dishes
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      {/* Content */}
      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h2>Recent Activity</h2>
            <div className="recent-orders">
              <h3>Latest Orders</h3>
              {orders.slice(0, 5).map(order => (
                <div key={order.id} className="order-item">
                  <div>
                    <strong>Order #{order.id}</strong>
                    <p>{new Date(order.orderDate || order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="order-amount">₹{order.totalAmount}</div>
                  <div className={`order-status status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'dishes' && (
          <div className="dishes-section">
            <div className="section-header">
              <h2>Manage Dishes</h2>
              <button className="add-btn">+ Add New Dish</button>
            </div>
            <div className="dishes-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Available</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dishes.map(dish => (
                    <tr key={dish.id}>
                      <td>{dish.id}</td>
                      <td>{dish.name}</td>
                      <td>
                        <span className={`category-badge ${dish.category}`}>
                          {dish.category}
                        </span>
                      </td>
                      <td>₹{dish.price}</td>
                      <td>
                        <span className={`availability ${dish.available ? 'available' : 'unavailable'}`}>
                          {dish.available ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        <button className="edit-btn">Edit</button>
                        <button className="delete-btn">Delete</button>
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
            <h2>All Orders</h2>
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
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
                      <td>{order.user?.fullName || 'Guest'}</td>
                      <td>{new Date(order.orderDate || order.createdAt).toLocaleDateString()}</td>
                      <td>₹{order.totalAmount}</td>
                      <td>
                        <span className={`order-status status-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <button className="view-btn">View</button>
                        <button className="update-btn">Update</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
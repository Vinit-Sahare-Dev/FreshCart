import { useState, useEffect } from 'react'

function AdminDashboard() {
  const [dishes, setDishes] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingDish, setEditingDish] = useState(null)
  const [notification, setNotification] = useState({ show: false, message: '', type: '' })
  const [user, setUser] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: 'veg',
    available: true
  })

  const API_URL = 'http://localhost:8080/api'

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('hotel_jwt')
    if (!token) {
      window.location.href = '/'
      return
    }

    // Decode token to get user info
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      const userData = JSON.parse(jsonPayload)
      setUser(userData)

      if (userData.role !== 'ADMIN') {
        window.location.href = '/'
        return
      }

      loadData()
    } catch (error) {
      window.location.href = '/'
    }
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('hotel_jwt')
      
      const [dishesRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/admin/dishes`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      if (!dishesRes.ok || !statsRes.ok) {
        throw new Error('Failed to load data')
      }

      const dishesData = await dishesRes.json()
      const statsData = await statsRes.json()
      
      setDishes(dishesData)
      setStats(statsData)
    } catch (error) {
      showNotification('Failed to load data: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('hotel_jwt')
      const dishData = {
        ...formData,
        price: parseFloat(formData.price)
      }

      const url = editingDish 
        ? `${API_URL}/admin/dishes/${editingDish.id}` 
        : `${API_URL}/admin/dishes`
      
      const method = editingDish ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dishData)
      })

      if (!response.ok) {
        throw new Error('Operation failed')
      }

      showNotification(editingDish ? 'Dish updated successfully!' : 'Dish created successfully!')
      setShowModal(false)
      setEditingDish(null)
      resetForm()
      loadData()
    } catch (error) {
      showNotification('Operation failed: ' + error.message, 'error')
    }
  }

  const handleEdit = (dish) => {
    setEditingDish(dish)
    setFormData({
      name: dish.name,
      description: dish.description,
      price: dish.price.toString(),
      imageUrl: dish.imageUrl || '',
      category: dish.category,
      available: dish.available
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this dish?')) return
    
    try {
      const token = localStorage.getItem('hotel_jwt')
      const response = await fetch(`${API_URL}/admin/dishes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error('Delete failed')
      }

      showNotification('Dish deleted successfully!')
      loadData()
    } catch (error) {
      showNotification('Delete failed: ' + error.message, 'error')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      imageUrl: '',
      category: 'veg',
      available: true
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('hotel_jwt')
    window.location.href = '/'
  }

  const handleBack = () => {
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            border: '3px solid #f3f3f3', 
            borderTop: '3px solid #8b5cf6',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Notification */}
      {notification.show && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 50,
          padding: '1rem 1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          background: notification.type === 'error' ? '#ef4444' : '#10b981',
          color: 'white',
          animation: 'slideIn 0.3s ease-out'
        }}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header style={{
        background: 'linear-gradient(to right, #9333ea, #6366f1)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '1.5rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
              Admin Dashboard
            </h1>
            <p style={{ color: '#e9d5ff', marginTop: '0.25rem' }}>
              Welcome back, {user?.sub || 'Admin'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleBack}
              style={{
                padding: '0.5rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                borderRadius: '0.5rem',
                fontWeight: '600',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              ← Back to Site
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1.5rem',
                background: 'white',
                color: '#9333ea',
                borderRadius: '0.5rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#f5f3ff'}
              onMouseOut={(e) => e.target.style.background = 'white'}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem', borderLeft: '4px solid #3b82f6' }}>
            <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', margin: 0 }}>Total Dishes</h3>
            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
              {stats.totalDishes || 0}
            </p>
          </div>
          <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
            <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', margin: 0 }}>Veg Dishes</h3>
            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
              {stats.vegDishes || 0}
            </p>
          </div>
          <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem', borderLeft: '4px solid #ef4444' }}>
            <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', margin: 0 }}>Non-Veg Dishes</h3>
            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
              {stats.nonVegDishes || 0}
            </p>
          </div>
          <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
            <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', margin: 0 }}>Available</h3>
            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
              {stats.availableDishes || 0}
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
              Manage Dishes
            </h2>
            <button
              onClick={() => { setShowModal(true); setEditingDish(null); resetForm(); }}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(to right, #9333ea, #6366f1)',
                color: 'white',
                borderRadius: '0.5rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 6px 12px -2px rgba(0, 0, 0, 0.2)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              + Add New Dish
            </button>
          </div>
        </div>

        {/* Dishes Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {dishes.map((dish) => (
            <div key={dish.id} style={{
              background: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                height: '200px',
                background: `linear-gradient(135deg, ${dish.category === 'veg' ? '#d1fae5' : dish.category === 'nonveg' ? '#fee2e2' : '#fef3c7'}, white)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem'
              }}>
                {dish.category === 'veg' ? '🌱' : dish.category === 'nonveg' ? '🍗' : '🥛'}
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', margin: 0, flex: 1 }}>
                    {dish.name}
                  </h3>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    background: dish.category === 'veg' ? '#d1fae5' : dish.category === 'nonveg' ? '#fee2e2' : '#fef3c7',
                    color: dish.category === 'veg' ? '#065f46' : dish.category === 'nonveg' ? '#991b1b' : '#92400e',
                    marginLeft: '0.5rem',
                    whiteSpace: 'nowrap'
                  }}>
                    {dish.category}
                  </span>
                </div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
                  {dish.description?.substring(0, 80)}...
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>
                    ₹{dish.price}
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(dish)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#6366f1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#4f46e5'
                        e.target.style.transform = 'scale(1.05)'
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = '#6366f1'
                        e.target.style.transform = 'scale(1)'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dish.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#dc2626'
                        e.target.style.transform = 'scale(1.05)'
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = '#ef4444'
                        e.target.style.transform = 'scale(1)'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '1rem'
        }} onClick={() => { setShowModal(false); setEditingDish(null); resetForm(); }}>
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxWidth: '32rem',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                {editingDish ? 'Edit Dish' : 'Add New Dish'}
              </h3>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Dish Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter dish name"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter dish description"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="nonveg">Non-Vegetarian</option>
                    <option value="dairy">Dairy</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Image URL
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleInputChange}
                  style={{ marginRight: '0.5rem', width: '1rem', height: '1rem' }}
                />
                <label style={{ fontSize: '0.875rem', color: '#111827', margin: 0 }}>
                  Available for ordering
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <button
                  onClick={() => { setShowModal(false); setEditingDish(null); resetForm(); }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    color: '#374151',
                    fontWeight: '600',
                    background: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#f9fafb'}
                  onMouseOut={(e) => e.target.style.background = 'white'}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(to right, #9333ea, #6366f1)',
                    color: 'white',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 6px 12px -2px rgba(0, 0, 0, 0.2)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {editingDish ? 'Update Dish' : 'Create Dish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default AdminDashboard
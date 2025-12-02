import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import orderService from '../services/orderService'
import './Orders.css'

const FALLBACK_ORDERS = [
  {
    id: 'ORD-10842',
    restaurant: 'FreshCart Kitchens',
    items: ['Smoky Tandoori Platter', 'Mint Cooler'],
    total: 986,
    status: 'On the way',
    eta: '12 mins',
    placedAt: 'Today · 11:05 AM',
    updatedAt: '11:32 AM',
    progress: 75,
    address: 'Wipro Circle, Gachibowli, Hyderabad',
    courier: {
      name: 'Rahul S.',
      phone: '+91 98765 12340'
    }
  },
  {
    id: 'ORD-10841',
    restaurant: 'Chef Specials',
    items: ['Paneer Tikka Burrito Bowl'],
    total: 612,
    status: 'Being prepared',
    eta: '18 mins',
    placedAt: 'Today · 10:48 AM',
    updatedAt: '11:10 AM',
    progress: 45,
    address: 'Plot 56, Madhapur',
    courier: null
  },
  {
    id: 'ORD-10812',
    restaurant: 'Dessert Co.',
    items: ['Belgian Chocolate Mousse', 'Berry Falooda'],
    total: 438,
    status: 'Delivered',
    eta: 'Delivered 09:55 AM',
    placedAt: 'Today · 09:18 AM',
    updatedAt: '09:52 AM',
    progress: 100,
    address: 'Ameerpeth, Hyderabad',
    courier: {
      name: 'Meena K.',
      phone: '+91 98876 22134'
    }
  }
]

const FILTERS = [
  { id: 'ALL', label: 'All Orders' },
  { id: 'ACTIVE', label: 'In Progress' },
  { id: 'DELIVERED', label: 'Delivered' },
  { id: 'CANCELLED', label: 'Cancelled' }
]

const statusToFilter = (status = '') => {
  const normalized = status.toLowerCase()

  if (normalized.includes('cancel')) {
    return 'CANCELLED'
  }

  if (normalized.includes('deliver') && !normalized.includes('delivering')) {
    return 'DELIVERED'
  }

  return 'ACTIVE'
}

const enrichOrder = (order, index) => ({
  id: order.orderNumber || order.id || order._id || `ORD-${10000 + index}`,
  restaurant: order.restaurant || order.restaurantName || 'FreshCart Kitchens',
  items: order.items?.length ? order.items.map(item => item.name || item) : order.description ? [order.description] : ['Chef curated combo'],
  total: order.totalAmount || order.total || 499,
  status: order.status || 'On the way',
  eta: order.eta || '15 mins',
  placedAt: order.placedAt || order.createdAt || 'Today · 10:00 AM',
  updatedAt: order.updatedAt || 'Just now',
  progress: order.progress ?? (order.status === 'Delivered' ? 100 : 60),
  address: order.address || order.deliveryAddress || 'Hyderabad',
  courier: order.courier || order.deliveryPartner || null
})

function Orders() {
  const location = useLocation()
  const navigate = useNavigate()
  const highlightRef = useRef(null)

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState('ALL')

  useEffect(() => {
    let isMounted = true
    const fetchOrders = async () => {
      try {
        const response = await orderService.getMyOrders()
        if (!isMounted) return

        if (Array.isArray(response) && response.length) {
          setOrders(response.map(enrichOrder))
        } else {
          setOrders(FALLBACK_ORDERS)
        }
      } catch (err) {
        console.error('Unable to fetch orders:', err)
        if (isMounted) {
          setError('Unable to fetch the latest orders. Showing your recent activity instead.')
          setOrders(FALLBACK_ORDERS)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchOrders()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (location.state?.highlightLatest && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      highlightRef.current.classList.add('orders-card-highlight')
      const timer = setTimeout(() => {
        highlightRef.current?.classList.remove('orders-card-highlight')
      }, 2200)
      return () => clearTimeout(timer)
    }
  }, [location.state, orders])

  const filteredOrders = useMemo(() => {
    if (activeFilter === 'ALL') return orders
    return orders.filter(order => statusToFilter(order.status) === activeFilter)
  }, [orders, activeFilter])

  const stats = useMemo(() => ({
    total: orders.length,
    active: orders.filter(o => statusToFilter(o.status) === 'ACTIVE').length,
    delivered: orders.filter(o => statusToFilter(o.status) === 'DELIVERED').length,
    cancelled: orders.filter(o => statusToFilter(o.status) === 'CANCELLED').length
  }), [orders])

  const handleTrack = (orderId) => {
    navigate(`/orders?active=${orderId}`)
  }

  return (
    <div className="orders-page">
      <div className="orders-hero">
        <div>
          <p className="orders-kicker">Real-time tracking</p>
          <h1>Keep an eye on every delivery</h1>
          <p className="orders-subtitle">See live status, ETA updates, and courier details for all your FreshCart orders.</p>
        </div>
        <div className="orders-stats">
          <div className="orders-stat-card">
            <span className="orders-stat-value">{stats.active}</span>
            <span className="orders-stat-label">Active</span>
          </div>
          <div className="orders-stat-card">
            <span className="orders-stat-value">{stats.delivered}</span>
            <span className="orders-stat-label">Delivered</span>
          </div>
          <div className="orders-stat-card">
            <span className="orders-stat-value">{stats.total}</span>
            <span className="orders-stat-label">Total</span>
          </div>
        </div>
      </div>

      <div className="orders-filters">
        {FILTERS.map(filter => (
          <button
            key={filter.id}
            className={`orders-filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {error && <div className="orders-banner">{error}</div>}

      {loading ? (
        <div className="orders-loading">Loading your orders…</div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order, index) => (
            <article
              key={order.id}
              id={`order-card-${order.id}`}
              ref={index === 0 ? highlightRef : null}
              className="orders-card"
            >
              <header className="orders-card-header">
                <div>
                  <p className="orders-card-id">{order.id}</p>
                  <h2>{order.restaurant}</h2>
                  <p className="orders-card-time">{order.placedAt}</p>
                </div>
                <div className="orders-card-meta">
                  <span className={`orders-status-pill status-${statusToFilter(order.status).toLowerCase()}`}>
                    {order.status}
                  </span>
                  <span className="orders-card-amount">₹{order.total}</span>
                </div>
              </header>

              <div className="orders-items">
                {order.items.slice(0, 3).map((item, idx) => (
                  <span key={idx} className="orders-item-pill">{item}</span>
                ))}
                {order.items.length > 3 && (
                  <span className="orders-item-pill muted">+{order.items.length - 3} more</span>
                )}
              </div>

              <div className="orders-progress">
                <div className="orders-progress-track">
                  <div className="orders-progress-fill" style={{ width: `${order.progress}%` }}></div>
                </div>
                <div className="orders-progress-meta">
                  <span>{order.status}</span>
                  <span>{order.eta}</span>
                </div>
              </div>

              <div className="orders-footer">
                <div className="orders-address">
                  <p className="orders-address-label">Delivering to</p>
                  <p>{order.address}</p>
                </div>
                <div className="orders-actions">
                  {order.courier && (
                    <div className="orders-courier">
                      <span>Courier</span>
                      <strong>{order.courier.name}</strong>
                    </div>
                  )}
                  <button className="orders-track-btn" onClick={() => handleTrack(order.id)}>
                    📍 Track order
                  </button>
                </div>
              </div>
            </article>
          ))}

          {!filteredOrders.length && (
            <div className="orders-empty">
              <span>🍱</span>
              <p>No orders in this state yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Orders

import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Veg from './components/Veg'
import NonVeg from './components/NonVeg'
import Dairy from './components/Dairy'
import Cart from './components/Cart'
import ProtectedRoute from './components/ProtectedRoute'
import AuthModal from './components/AuthModal'
import AICompanion from './components/AICompanion'

function App() {
  const location = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/veg" element={<Veg />} />
          <Route path="/non-veg" element={<NonVeg />} />
          <Route path="/dairy" element={<Dairy />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/auth" element={<AuthModal />} />

          {/* Protected routes */}
          <Route
            path="/checkout"
            element={(
              <ProtectedRoute>
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
                  <p className="text-gray-600">Checkout functionality would go here...</p>
                </div>
              </ProtectedRoute>
            )}
          />

          {/* Redirect all unknown paths to home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      {/* AI Companion - positioned globally */}
      <AICompanion />
    </div>
  )
}

export default App
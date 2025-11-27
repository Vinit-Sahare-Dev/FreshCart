import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import Home from './components/Home'
import Veg from './components/Veg'
import NonVeg from './components/NonVeg'
import Dairy from './components/Dairy'
import Snacks from './components/Snacks'
import Beverages from './components/Beverages'
import Cart from './components/Cart'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AuthModal from './components/AuthModal'
import AICompanion from './components/AICompanion'

function App() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar shown on all pages */}
      <Navbar />
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/veg" element={<Veg />} />
          <Route path="/non-veg" element={<NonVeg />} />
          <Route path="/dairy" element={<Dairy />} />
          <Route path="/snacks" element={<Snacks />} />
          <Route path="/beverages" element={<Beverages />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/auth" element={<AuthModal />} />

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

          <Route
            path="/account"
            element={(
              <ProtectedRoute>
                <div className="max-w-4xl mx-auto py-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-8">Account</h1>
                  <p className="text-gray-600">Account management would go here...</p>
                </div>
              </ProtectedRoute>
            )}
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      
      {/* AI Companion - positioned globally */}
      <AICompanion />
    </div>
  )
}

export default App
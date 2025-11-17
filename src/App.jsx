import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Veg from './components/Veg'
import NonVeg from './components/NonVeg'
import Dairy from './components/Dairy'
import Cart from './components/Cart'

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
          <Route path="/freshcart" element={<Home />} />
          <Route path="/freshcart/veg" element={<Veg />} />
          <Route path="/freshcart/non-veg" element={<NonVeg />} />
          <Route path="/freshcart/dairy" element={<Dairy />} />
          <Route path="/freshcart/cart" element={<Cart />} />
          {/* Redirect all unknown paths to home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
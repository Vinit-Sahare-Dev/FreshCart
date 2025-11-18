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
          <Route path="/" element={<Home />} />
          <Route path="/veg" element={<Veg />} />
          <Route path="/non-veg" element={<NonVeg />} />
          <Route path="/dairy" element={<Dairy />} />
          <Route path="/cart" element={<Cart />} />
          {/* Redirect all unknown paths to home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
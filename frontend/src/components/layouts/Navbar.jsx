import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiShoppingCart, FiUser, FiSearch, FiHeart, FiChevronDown } from 'react-icons/fi'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { cartItems } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.user-dropdown')) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isDropdownOpen])

  useEffect(() => {
    if (user) {
      const userId = user._id || user.id
      const savedImage = localStorage.getItem(`profile_image_${userId}`)
      if (savedImage) {
        setProfileImage(savedImage)
      }
    }
  }, [user])

  useEffect(() => {
    const handleProfileUpdate = (event) => {
      if (event.detail && event.detail.userId === (user?._id || user?.id)) {
        setProfileImage(event.detail.imageData)
      }
    }
    
    const handleProfileRemove = (event) => {
      if (event.detail && event.detail.userId === (user?._id || user?.id)) {
        setProfileImage(null)
      }
    }
    
    window.addEventListener('profileImageUpdated', handleProfileUpdate)
    window.addEventListener('profileImageRemoved', handleProfileRemove)
    
    return () => {
      window.removeEventListener('profileImageUpdated', handleProfileUpdate)
      window.removeEventListener('profileImageRemoved', handleProfileRemove)
    }
  }, [user])

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`)
      setSearchQuery('')
      setShowSearch(false)
      setIsOpen(false)
    }
  }

  const isActive = (path) => location.pathname === path

  const userDisplayName = user?.name || user?.email?.split('@')[0] || 'User'

  const toggleDropdown = (e) => {
    e.stopPropagation()
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleLogout = () => {
    logout()
    setIsDropdownOpen(false)
    navigate('/login')
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white shadow-sm'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl md:text-2xl tracking-wide font-light text-gray-800 hover:text-warm transition">
            LUXE HOME
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm tracking-wide transition-colors relative group ${
                  isActive(item.path) ? 'text-warm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-warm"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setShowSearch(!showSearch)} className="hidden md:block">
              <FiSearch className="w-5 h-5 text-gray-600 hover:text-gray-800 transition-colors" />
            </button>
            
            {!isAdmin && (
              <Link to="/wishlist">
                <FiHeart className="w-5 h-5 text-gray-600 hover:text-gray-800 transition-colors" />
              </Link>
            )}
            
            {!isAdmin && (
              <Link to="/cart" className="relative">
                <FiShoppingCart className="w-5 h-5 text-gray-600 hover:text-gray-800 transition-colors" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-4 h-4 bg-warm text-white text-xs rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
            )}
            
            {/* Admin Panel Link for Admin Users */}
            {isAdmin && (
              <Link to="/admin" className="hidden md:block bg-warm text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-warm/80 transition">
                Admin Panel
              </Link>
            )}
            
            {user ? (
              <div className="relative user-dropdown">
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-7 h-7 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-warm/20 flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-warm" />
                    </div>
                  )}
                  <span className="text-sm text-gray-700 hidden md:block">{userDisplayName}</span>
                  <FiChevronDown className={`w-3 h-3 text-gray-600 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-50 border border-gray-100"
                    >
                      {/* Admin Dashboard link removed - only Logout remains for admin */}
                      <button 
                        onClick={handleLogout} 
                        className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50 transition"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login">
                <FiUser className="w-5 h-5 text-gray-600 hover:text-gray-800 transition-colors" />
              </Link>
            )}
            
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="hidden md:block py-4 border-t border-gray-100"
            >
              <form onSubmit={handleSearch} className="relative max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-full focus:outline-none focus:border-warm transition text-gray-800"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                  <FiSearch className="w-4 h-4 text-gray-400" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 text-gray-600 hover:text-gray-800 transition ${
                    isActive(item.path) ? 'text-warm font-medium' : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {isAdmin && (
                <Link 
                  to="/admin" 
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-warm font-medium"
                >
                  Admin Panel
                </Link>
              )}
              <div className="pt-4 border-t border-gray-100">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-warm text-gray-800"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                    <FiSearch className="w-4 h-4 text-gray-400" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
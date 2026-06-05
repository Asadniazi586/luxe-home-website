import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiShoppingCart, FiUser, FiSearch, FiHeart, FiChevronDown, FiHome, FiShoppingBag, FiList, FiSettings } from 'react-icons/fi'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
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

  // Load profile image
  useEffect(() => {
    if (user) {
      const userId = user._id || user.id
      
      if (isAdmin) {
        const adminSavedImage = localStorage.getItem(`admin_profile_image_${userId}`)
        if (adminSavedImage) {
          setProfileImage(adminSavedImage)
        } else {
          const normalSavedImage = localStorage.getItem(`profile_image_${userId}`)
          if (normalSavedImage) {
            setProfileImage(normalSavedImage)
          }
        }
      } else {
        const savedImage = localStorage.getItem(`profile_image_${userId}`)
        if (savedImage) {
          setProfileImage(savedImage)
        }
      }
    }
  }, [user, isAdmin])

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      if (event.detail && event.detail.userId === (user?._id || user?.id)) {
        setProfileImage(event.detail.imageData)
      }
    }
    
    const handleAdminProfileUpdate = (event) => {
      if (event.detail && event.detail.userId === (user?._id || user?.id) && isAdmin) {
        setProfileImage(event.detail.imageData)
      }
    }
    
    const handleProfileRemove = (event) => {
      if (event.detail && event.detail.userId === (user?._id || user?.id)) {
        setProfileImage(null)
      }
    }
    
    const handleAdminProfileRemove = (event) => {
      if (event.detail && event.detail.userId === (user?._id || user?.id) && isAdmin) {
        setProfileImage(null)
      }
    }
    
    window.addEventListener('profileImageUpdated', handleProfileUpdate)
    window.addEventListener('adminProfileImageUpdated', handleAdminProfileUpdate)
    window.addEventListener('profileImageRemoved', handleProfileRemove)
    window.addEventListener('adminProfileImageRemoved', handleAdminProfileRemove)
    
    return () => {
      window.removeEventListener('profileImageUpdated', handleProfileUpdate)
      window.removeEventListener('adminProfileImageUpdated', handleAdminProfileUpdate)
      window.removeEventListener('profileImageRemoved', handleProfileRemove)
      window.removeEventListener('adminProfileImageRemoved', handleAdminProfileRemove)
    }
  }, [user, isAdmin])

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

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
    setIsDropdownOpen(false)
    logout()
  }

  const handleNavigation = (path) => {
    setIsDropdownOpen(false)
    navigate(path)
  }

  // Check if on mobile
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center py-4">
            <Link to="/" className="text-xl md:text-2xl tracking-wide font-light text-gray-800 hover:text-warm transition">
              LUXE HOME
            </Link>

            <div className="flex items-center gap-8">
              <Link
                to="/"
                className={`text-sm tracking-wide transition-colors relative group ${
                  isActive('/') ? 'text-warm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Home
                {isActive('/') && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-warm"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
              </Link>
              <Link
                to="/shop"
                className={`text-sm tracking-wide transition-colors relative group ${
                  isActive('/shop') ? 'text-warm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Shop
                {isActive('/shop') && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-warm"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
              </Link>
              <Link
                to="/about"
                className={`text-sm tracking-wide transition-colors relative group ${
                  isActive('/about') ? 'text-warm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                About
                {isActive('/about') && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-warm"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
              </Link>
              <Link
                to="/contact"
                className={`text-sm tracking-wide transition-colors relative group ${
                  isActive('/contact') ? 'text-warm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Contact
                {isActive('/contact') && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-warm"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => setShowSearch(!showSearch)}>
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
              
              {isAdmin && (
                <button 
                  onClick={() => window.location.href = '/admin'}
                  className="bg-warm text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-warm/80 transition"
                >
                  Admin Panel
                </button>
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
                    <span className="text-sm text-gray-700">{userDisplayName}</span>
                    <FiChevronDown className={`w-3 h-3 text-gray-600 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg overflow-hidden z-50 border border-gray-100"
                      >
                        {!isAdmin ? (
                          <>
                            <button 
                              onClick={() => handleNavigation('/dashboard')}
                              className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                            >
                              <FiHome size={16} />
                              Dashboard
                            </button>
                            <button 
                              onClick={() => handleNavigation('/dashboard?tab=orders')}
                              className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                            >
                              <FiShoppingBag size={16} />
                              My Orders
                            </button>
                            <button 
                              onClick={() => handleNavigation('/wishlist')}
                              className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                            >
                              <FiHeart size={16} />
                              Wishlist
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button 
                              onClick={handleLogout} 
                              className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                            >
                              <FiSettings size={16} />
                              Logout
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleNavigation('/admin/profile')}
                              className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                            >
                              <FiUser size={16} />
                              Profile
                            </button>
                            <button 
                              onClick={() => window.location.href = '/admin'}
                              className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                            >
                              <FiHome size={16} />
                              Admin Dashboard
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button 
                              onClick={handleLogout} 
                              className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                            >
                              <FiSettings size={16} />
                              Logout
                            </button>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login">
                  <FiUser className="w-5 h-5 text-gray-600 hover:text-gray-800 transition-colors" />
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Layout - REDUCED HEIGHT (minimal padding) */}
          <div className="flex md:hidden justify-center items-center pt-5 pb-1">
            <Link to="/" className="text-xl tracking-wide font-light text-gray-800 hover:text-warm transition">
              LUXE HOME
            </Link>
          </div>

          {/* Desktop Search Bar */}
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
      </nav>

      {/* Mobile Bottom Navigation Bar - Only visible on mobile */}
      {isMobile && (
        <>
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-100 z-50 md:hidden">
            <div className="flex justify-around items-center py-2 px-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition text-gray-500 hover:text-warm"
              >
                <FiMenu className="w-5 h-5" />
                <span className="text-[10px] font-medium">Menu</span>
              </button>

              <Link
                to="/wishlist"
                className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition text-gray-500 hover:text-warm"
              >
                <FiHeart className="w-5 h-5" />
                <span className="text-[10px] font-medium">Wishlist</span>
              </Link>

              <Link
                to="/"
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition ${
                  location.pathname === '/' ? 'text-warm' : 'text-gray-500 hover:text-warm'
                }`}
              >
                <FiHome className="w-5 h-5" />
                <span className="text-[10px] font-medium">Home</span>
              </Link>

              <Link
                to="/cart"
                className="relative flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition text-gray-500 hover:text-warm"
              >
                <div className="relative">
                  <FiShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-warm text-white text-[9px] rounded-full flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">Cart</span>
              </Link>

              <div className="relative user-dropdown">
                <button
                  onClick={toggleDropdown}
                  className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition text-gray-500 hover:text-warm focus:outline-none"
                >
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <FiUser className="w-5 h-5" />
                  )}
                  <span className="text-[10px] font-medium">Profile</span>
                </button>
                
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-full right-0 mb-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-50 border border-gray-100"
                    >
                      {!isAdmin ? (
                        <>
                          <button 
                            onClick={() => handleNavigation('/dashboard')}
                            className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <FiHome size={16} />
                            Dashboard
                          </button>
                          <button 
                            onClick={() => handleNavigation('/dashboard?tab=orders')}
                            className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <FiShoppingBag size={16} />
                            My Orders
                          </button>
                          <button 
                            onClick={() => handleNavigation('/wishlist')}
                            className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <FiHeart size={16} />
                            Wishlist
                          </button>
                          <div className="border-t border-gray-100 my-1"></div>
                          <button 
                            onClick={handleLogout} 
                            className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                          >
                            <FiSettings size={16} />
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleNavigation('/admin/profile')}
                            className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <FiUser size={16} />
                            Profile
                          </button>
                          <button 
                            onClick={() => window.location.href = '/admin'}
                            className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <FiHome size={16} />
                            Admin Dashboard
                          </button>
                          <div className="border-t border-gray-100 my-1"></div>
                          <button 
                            onClick={handleLogout} 
                            className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                          >
                            <FiSettings size={16} />
                            Logout
                          </button>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          <div className="pb-16"></div>
        </>
      )}

      {/* Mobile Sidebar Menu (Hamburger) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60] md:hidden"
            />
            
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white shadow-xl z-[70] md:hidden overflow-y-auto"
            >
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <span className="text-xl font-light tracking-wide text-gray-800">LUXE HOME</span>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 space-y-2">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                >
                  <FiHome size={18} />
                  <span>Home</span>
                </Link>
                <Link
                  to="/shop"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                >
                  <FiShoppingBag size={18} />
                  <span>Shop</span>
                </Link>
                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                >
                  <FiList size={18} />
                  <span>About</span>
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                >
                  <FiList size={18} />
                  <span>Contact</span>
                </Link>
                
                <div className="pt-4 border-t border-gray-100">
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-warm"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                      <FiSearch className="w-4 h-4 text-gray-400" />
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
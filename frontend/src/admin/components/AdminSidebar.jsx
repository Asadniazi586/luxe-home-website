import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiHome, FiPackage, FiShoppingBag, FiUsers, FiSettings, 
  FiLogOut, FiChevronLeft, FiChevronRight, FiUser, FiPlusCircle
} from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const menuItems = [
    { path: '/admin', name: 'Dashboard', icon: FiHome, end: true },
    { path: '/admin/add-product', name: 'Add Product', icon: FiPlusCircle, end: false },
    { path: '/admin/products', name: 'Products', icon: FiPackage, end: false },
    { path: '/admin/orders', name: 'Orders', icon: FiShoppingBag, end: false },
    { path: '/admin/users', name: 'Users', icon: FiUsers, end: false },
    { path: '/admin/profile', name: 'Profile', icon: FiUser, end: false },
    { path: '/admin/settings', name: 'Settings', icon: FiSettings, end: false },
  ]

  return (
    <motion.div
      initial={{ width: 256 }}
      animate={{ width: isOpen ? 256 : 80 }}
      className="fixed left-0 top-0 h-full bg-gray-900 text-white shadow-xl z-20"
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-gray-700">
        {isOpen && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-light tracking-wide text-white"
          >
            Admin Panel
          </motion.span>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-gray-800 transition text-white"
        >
          {isOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-8">
        <div className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 mx-4 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-warm text-white shadow-md'
                    : 'text-white hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <item.icon size={20} className="flex-shrink-0 text-white" />
              {isOpen && <span className="text-sm font-medium text-white">{item.name}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-6 left-0 right-0 px-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-3 w-full rounded-lg text-white hover:bg-red-600 hover:text-white transition-all duration-200"
        >
          <FiLogOut size={20} className="flex-shrink-0 text-white" />
          {isOpen && <span className="text-sm font-medium text-white">Logout</span>}
        </button>
      </div>
    </motion.div>
  )
}

export default AdminSidebar
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { 
  FiHome, FiPackage, FiShoppingBag, FiUsers, FiSettings, 
  FiLogOut, FiChevronLeft, FiChevronRight, FiUser, FiPlusCircle
} from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    window.location.href = '/admin/login'
  }

  // ONLY the arrow button toggles the sidebar
  const handleArrowClick = (e) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  // Menu click - does nothing to sidebar state
  const handleMenuClick = () => {
    // Intentionally empty - sidebar state stays exactly as is
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
    <div
      style={{ width: isOpen ? 256 : 80 }}
      className="fixed left-0 top-0 h-full bg-gray-900 text-white shadow-xl z-20 transition-all duration-300"
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-5 border-b border-gray-700">
        {isOpen && (
          <span className="text-xl font-light tracking-wide text-white">
            Admin Panel
          </span>
        )}
        <button
          onClick={handleArrowClick}
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
              onClick={handleMenuClick}
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
    </div>
  )
}

export default AdminSidebar
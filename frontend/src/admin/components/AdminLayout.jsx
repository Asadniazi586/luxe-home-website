import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AdminSidebar from './AdminSidebar'
import AdminNavbar from './AdminNavbar'

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // ONLY check for admin token - NOT user_token
    const token = localStorage.getItem('admin_token')
    const user = JSON.parse(localStorage.getItem('admin_user') || '{}')
    
    console.log('🏗️ AdminLayout - Token exists:', !!token)
    console.log('🏗️ AdminLayout - User role:', user.role)
    
    if (!token || user.role !== 'admin') {
      console.log('🏗️ AdminLayout - No admin credentials, redirecting to login')
      navigate('/admin/login', { replace: true })
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <AdminNavbar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}

export default AdminLayout
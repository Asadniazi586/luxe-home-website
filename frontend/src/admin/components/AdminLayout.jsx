import React from 'react'
import { motion } from 'framer-motion'
import AdminSidebar from './AdminSidebar'
import AdminNavbar from './AdminNavbar'

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

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
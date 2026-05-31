import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AdminSidebar from './AdminSidebar'
import AdminNavbar from './AdminNavbar'

const AdminLayout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading } = useAuth()
  
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024
    }
    return true
  })

  const handleSetSidebarOpen = (value) => {
    setSidebarOpen(value)
  }

  useEffect(() => {
    if (loading) return
    if (!user || user.role !== 'admin') {
      navigate('/admin/login', { replace: true })
    }
  }, [user, loading, navigate])

  // Memoize navbar to prevent re-renders
  const memoizedNavbar = useMemo(() => <AdminNavbar />, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={handleSetSidebarOpen} />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {memoizedNavbar}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AdminDashboard from '../pages/AdminDashboard'
import AdminProducts from '../pages/AdminProducts'
import AdminOrders from '../pages/AdminOrders'
import AdminUsers from '../pages/AdminUsers'
import AdminSettings from '../pages/AdminSettings'
import AdminProfile from '../pages/AdminProfile'  // Add this import
import AdminAddProduct from '../pages/AdminAddProduct'

const AdminRoutes = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (!token || !storedUser) {
      navigate('/admin/login')
    }
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-12 h-12 border-3 border-warm border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/products" element={<AdminProducts />} />
      <Route path="/add-product" element={<AdminAddProduct />} />  {/* Add this route */}
      <Route path="/orders" element={<AdminOrders />} />
      <Route path="/users" element={<AdminUsers />} />
      <Route path="/settings" element={<AdminSettings />} />
      <Route path="/profile" element={<AdminProfile />} />  {/* Add this route */}
    </Routes>
  )
}

export default AdminRoutes
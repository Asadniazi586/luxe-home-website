import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import AdminDashboard from '../pages/AdminDashboard'
import AdminProducts from '../pages/AdminProducts'
import AdminOrders from '../pages/AdminOrders'
import AdminUsers from '../pages/AdminUsers'
import AdminSettings from '../pages/AdminSettings'
import AdminProfile from '../pages/AdminProfile'
import AdminAddProduct from '../pages/AdminAddProduct'

const AdminRoutes = () => {
  const location = useLocation()
  
  console.log('📍 AdminRoutes - Current path:', location.pathname)
  
  // Check for admin token
  const token = localStorage.getItem('admin_token')
  const adminUser = localStorage.getItem('admin_user')
  
  console.log('🔑 Admin token exists:', !!token)
  console.log('👤 Admin user exists:', !!adminUser)
  
  if (!token || !adminUser) {
    console.log('❌ No admin credentials, redirecting to login')
    return <Navigate to="/admin/login" replace />
  }

  console.log('✅ Admin authenticated, showing dashboard')
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/products" element={<AdminProducts />} />
      <Route path="/add-product" element={<AdminAddProduct />} />
      <Route path="/orders" element={<AdminOrders />} />
      <Route path="/users" element={<AdminUsers />} />
      <Route path="/settings" element={<AdminSettings />} />
      <Route path="/profile" element={<AdminProfile />} />
    </Routes>
  )
}

export default AdminRoutes
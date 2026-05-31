import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AdminDashboard from '../pages/AdminDashboard'
import AdminProducts from '../pages/AdminProducts'
import AdminOrders from '../pages/AdminOrders'
import AdminUsers from '../pages/AdminUsers'
import AdminSettings from '../pages/AdminSettings'
import AdminProfile from '../pages/AdminProfile'
import AdminAddProduct from '../pages/AdminAddProduct'
import Loader from '../../components/ui/Loader'

const AdminRoutes = () => {
  const { user, loading } = useAuth()
  
  // Show loader while checking auth
  if (loading) {
    return <Loader />
  }
  
  // If not admin, redirect using window.location (not React Navigate)
  if (!user || user.role !== 'admin') {
    window.location.href = '/admin/login'
    return null
  }
  
  // If admin, render admin routes
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
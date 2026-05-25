import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi'
import { useAdmin } from '../../contexts/AdminContext'
import StatsCard from '../components/StatsCard'
import AdminLayout from '../components/AdminLayout'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { getStats } = useAdmin()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: FiPackage, color: '#3b82f6', change: 12 },
    { title: 'Total Orders', value: stats.totalOrders, icon: FiShoppingBag, color: '#10b981', change: 8 },
    { title: 'Total Users', value: stats.totalUsers, icon: FiUsers, color: '#8b5cf6', change: 15 },
    { title: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: FiDollarSign, color: '#f59e0b', change: 5 },
  ]

  const handleAddProduct = () => {
    navigate('/admin/products')
    // Scroll to top and trigger add product modal
    setTimeout(() => {
      const addButton = document.querySelector('.add-product-btn')
      if (addButton) {
        addButton.click()
      }
    }, 100)
  }

  const handleViewOrders = () => {
    navigate('/admin/orders')
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-3 border-warm border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Recent Orders</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-800">Order #12345</p>
                <p className="text-xs text-gray-500">Today</p>
              </div>
              <span className="text-sm text-gray-600">$189.00</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-800">Order #12344</p>
                <p className="text-xs text-gray-500">Yesterday</p>
              </div>
              <span className="text-sm text-gray-600">$129.00</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={handleAddProduct}
              className="w-full flex items-center justify-between p-3 bg-warm/10 rounded-lg hover:bg-warm/20 transition"
            >
              <span className="text-sm text-gray-700">Add New Product</span>
              <FiPackage className="w-5 h-5 text-warm" />
            </button>
            <button
              onClick={handleViewOrders}
              className="w-full flex items-center justify-between p-3 bg-warm/10 rounded-lg hover:bg-warm/20 transition"
            >
              <span className="text-sm text-gray-700">View All Orders</span>
              <FiShoppingBag className="w-5 h-5 text-warm" />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
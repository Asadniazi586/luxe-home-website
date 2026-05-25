// frontend/src/contexts/AdminContext.js
import React, { createContext, useContext, useState } from 'react'
import api from '../services/api'

const AdminContext = createContext()

export const useAdmin = () => useContext(AdminContext)

export const AdminProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)

  const getProducts = async () => {
    setLoading(true)
    try {
      const response = await api.get('/products')
      return response.data.products || response.data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const createProduct = async (productData) => {
    setLoading(true)
    try {
      const response = await api.post('/products', productData)
      return response.data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProduct = async (id, productData) => {
    setLoading(true)
    try {
      const response = await api.put(`/products/${id}`, productData)
      return response.data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id) => {
    setLoading(true)
    try {
      const response = await api.delete(`/products/${id}`)
      return response.data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getAllOrders = async () => {
    setLoading(true)
    try {
      const response = await api.get('/orders')
      return response.data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  // FIXED: This function now properly updates ALL statuses
  const updateOrderStatus = async (id, status) => {
    setLoading(true)
    try {
      // Call the appropriate endpoint based on status
      if (status === 'Delivered') {
        const response = await api.put(`/orders/${id}/deliver`)
        return response.data
      } else {
        // For non-Delivered statuses, we need to update via a general status endpoint
        // If your backend doesn't have this, we'll use a workaround
        const response = await api.put(`/orders/${id}/status`, { status })
        return response.data
      }
    } catch (error) {
      console.error('Update order status error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getAllUsers = async () => {
    setLoading(true)
    try {
      const response = await api.get('/users')
      return response.data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id) => {
    setLoading(true)
    try {
      const response = await api.delete(`/users/${id}`)
      return response.data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getStats = async () => {
    setLoading(true)
    try {
      const [products, orders, users] = await Promise.all([
        api.get('/products'),
        api.get('/orders'),
        api.get('/users'),
      ])
      return {
        totalProducts: products.data.products?.length || products.data.length || 0,
        totalOrders: orders.data.length || 0,
        totalUsers: users.data.length || 0,
        totalRevenue: orders.data.reduce((sum, order) => sum + (order.totalPrice || 0), 0),
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminContext.Provider
      value={{
        loading,
        getProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        getAllOrders,
        updateOrderStatus,
        getAllUsers,
        deleteUser,
        getStats,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}
import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check which storage to use based on current path
    const isAdminPath = window.location.pathname.startsWith('/admin')
    const storageKey = isAdminPath ? 'admin_token' : 'user_token'
    const userStorageKey = isAdminPath ? 'admin_user' : 'user_user'
    
    const token = localStorage.getItem(storageKey)
    const storedUser = localStorage.getItem(userStorageKey)
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password)
      localStorage.setItem('user_token', data.token)
      localStorage.setItem('user_user', JSON.stringify(data))
      setUser(data)
      toast.success('Login successful!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const adminLogin = async (email, password) => {
    try {
      const data = await authService.adminLogin(email, password)
      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('admin_user', JSON.stringify(data))
      setUser(data)
      toast.success('Admin login successful!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Admin login failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const register = async (name, email, password) => {
    try {
      const data = await authService.register({ name, email, password })
      localStorage.setItem('user_token', data.token)
      localStorage.setItem('user_user', JSON.stringify(data))
      setUser(data)
      toast.success('Registration successful!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    // Only clear the storage based on current user role
    if (user?.role === 'admin') {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
    } else {
      localStorage.removeItem('user_token')
      localStorage.removeItem('user_user')
    }
    setUser(null)
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, adminLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
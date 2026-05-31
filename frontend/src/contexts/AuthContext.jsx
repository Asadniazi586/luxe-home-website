import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.getCurrentUser()
        if (response.user) {
          console.log('✅ User authenticated:', response.user.role)
          setUser(response.user)
        } else {
          console.log('❌ No authenticated user')
          setUser(null)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  // Unified login - handles both admin and normal users
  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password)
      setUser(data)
      
      if (data.role === 'admin') {
        toast.success('Admin login successful!')
      } else {
        toast.success('Login successful!')
      }
      return { success: true, role: data.role }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  // Admin login for admin panel
  const adminLogin = async (email, password) => {
    try {
      const data = await authService.adminLogin(email, password)
      setUser(data)
      toast.success('Admin login successful!')
      return { success: true, role: 'admin' }
    } catch (error) {
      const message = error.response?.data?.message || 'Admin login failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const register = async (name, email, password) => {
    try {
      const data = await authService.register({ name, email, password })
      setUser(data)
      toast.success('Registration successful!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  // Unified logout - clears everything and redirects to login
  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
    setUser(null)
    toast.success('Logged out successfully')
    // Redirect to login page
    window.location.href = '/login'
  }

  // Admin panel logout - clears everything and redirects to admin login
  const adminLogout = async () => {
    try {
      await authService.adminLogout()
    } catch (error) {
      console.error('Admin logout error:', error)
    }
    setUser(null)
    toast.success('Admin logged out successfully')
    // Redirect to admin login page
    window.location.href = '/admin/login'
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      adminLogin, 
      register, 
      logout,
      adminLogout
    }}>
      {children}
    </AuthContext.Provider>
  )
}
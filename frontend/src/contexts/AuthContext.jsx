import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      // STEP 1: ALWAYS check for admin token FIRST (regardless of path)
      const adminToken = localStorage.getItem('admin_token')
      const adminUser = localStorage.getItem('admin_user')
      
      if (adminToken && adminUser) {
        try {
          const parsedUser = JSON.parse(adminUser)
          if (parsedUser.role === 'admin') {
            console.log('✅ Admin user detected, setting as current user')
            setUser(parsedUser)
            setLoading(false)
            return
          }
        } catch (e) {}
      }
      
      // STEP 2: If no admin token, check for normal user
      const isAdminPath = window.location.pathname.startsWith('/admin')
      
      if (!isAdminPath) {
        const userData = sessionStorage.getItem('user_user')
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData)
            console.log('✅ Normal user detected')
            setUser(parsedUser)
            setLoading(false)
            return
          } catch (e) {}
        }
      }
      
      console.log('❌ No user found')
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password)
      
      if (data.role === 'admin') {
        localStorage.setItem('admin_token', data.token)
        localStorage.setItem('admin_user', JSON.stringify(data))
        setUser(data)
        toast.success('Admin login successful!')
      } else {
        sessionStorage.setItem('user_user', JSON.stringify(data))
        setUser(data)
        toast.success('Login successful!')
      }
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
      sessionStorage.setItem('user_user', JSON.stringify(data))
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
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    sessionStorage.removeItem('user_user')
    setUser(null)
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, adminLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
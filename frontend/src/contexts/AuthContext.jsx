import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password)
      setUser(data)
      toast.success('Login successful!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  // Admin login function
  const adminLogin = async (email, password) => {
    try {
      const data = await authService.adminLogin(email, password)
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
    authService.logout()
    setUser(null)
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, adminLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
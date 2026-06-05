import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'

const AdminLogin = () => {
  const { user, adminLogin, loading: authLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  // If already logged in as admin, redirect immediately using window.location
  useEffect(() => {
    if (!authLoading && user && user.role === 'admin') {
      window.location.href = '/admin'
    }
  }, [user, authLoading])

  // Show loading circle while checking auth
  if (authLoading) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#D4A574] border-t-[#2C2C2C] rounded-full animate-spin" />
      </div>
    )
  }
  
  // If already admin, don't render anything (redirect will happen)
  if (user && user.role === 'admin') {
    return null
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const result = await adminLogin(formData.email, formData.password)
    
    if (result.success) {
      // Use window.location for hard redirect
      window.location.href = '/admin'
    } else {
      setError(result.error || 'Invalid admin credentials')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-charcoal mb-2">Admin Portal</h1>
          <p className="text-gray-500 text-sm">Sign in to manage your store</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-8"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Admin Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-warm transition text-gray-800 placeholder-gray-400"
                  placeholder="admin@luxehome.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Admin Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-warm transition text-gray-800 placeholder-gray-400"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5 text-gray-400" /> : <FiEye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Use credentials from .env file</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal text-white py-3 rounded-xl font-medium hover:bg-charcoal-light transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminLogin
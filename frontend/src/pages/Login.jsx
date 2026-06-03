import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, login, loading: authLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Get the redirect path from location state (checkout page or default home)
  const from = location.state?.from || '/'

  // Handle redirect after login - redirect based on where user came from
  useEffect(() => {
    if (!authLoading && user) {
      // If user came from checkout, go back to checkout, otherwise go to home
      navigate(from, { replace: true })
    }
  }, [user, authLoading, navigate, from])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const result = await login(formData.email, formData.password)
    
    if (!result.success) {
      setError(result.error)
      setLoading(false)
    }
  }

  // Show loading circle while checking auth
  if (authLoading) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#D4A574] border-t-[#2C2C2C] rounded-full animate-spin" />
      </div>
    )
  }

  // Show login form when user is NOT logged in
  return (
    <div className="bg-cream min-h-screen flex items-center justify-center pt-2">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-charcoal">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-2">Sign in to your account</p>
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
                <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-warm transition"
                    placeholder="hello@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-warm transition"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5 text-gray-400" /> : <FiEye className="w-5 h-5 text-gray-400" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300 text-warm focus:ring-warm" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-warm hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-charcoal text-white py-3 rounded-xl font-medium hover:bg-charcoal-light transition disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-warm hover:underline">
                  Create account
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Login
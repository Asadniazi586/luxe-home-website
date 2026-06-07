import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 15000)
      })
      
      const responsePromise = authService.forgotPassword(email)
      
      await Promise.race([responsePromise, timeoutPromise])
      
      // Immediately show success page - don't wait for email delivery
      setSubmitted(true)
      toast.success('Reset link sent! Check your email.')
      
    } catch (error) {
      console.error('Forgot password error:', error)
      const message = error.response?.data?.message || 'Network error. Please try again.'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm p-8 text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-light text-charcoal mb-2">Check Your Email</h2>
              <p className="text-gray-500 text-sm mb-4">
                We've sent a password reset link to:
              </p>
              <p className="font-medium text-charcoal mb-6">{email}</p>
              <p className="text-gray-400 text-xs mb-6">
                The link will expire in 1 hour. If you don't see the email, check your spam folder.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-warm hover:underline"
              >
                <FiArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-cream min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-charcoal">Forgot Password</h1>
            <p className="text-gray-500 text-sm mt-2">
              Enter your email to reset your password
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-warm transition disabled:bg-gray-100"
                    placeholder="hello@example.com"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  We'll send a password reset link to this email
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-charcoal text-white py-3 rounded-xl font-medium hover:bg-charcoal-light transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-warm transition"
                >
                  <FiArrowLeft className="w-4 h-4" /> Back to Login
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
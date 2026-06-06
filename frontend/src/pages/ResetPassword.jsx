import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLock, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle, FiCircle } from 'react-icons/fi'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [validToken, setValidToken] = useState(true)

  // Check password requirements
  const hasMinLength = formData.password.length >= 8
  const hasLowercase = /(?=.*[a-z])/.test(formData.password)
  const hasUppercase = /(?=.*[A-Z])/.test(formData.password)
  const hasNumber = /(?=.*\d)/.test(formData.password)
  const hasSpecial = /(?=.*[@$!%*?&])/.test(formData.password)

  const passwordRequirements = [
    { label: 'At least 8 characters', met: hasMinLength },
    { label: 'At least one lowercase letter', met: hasLowercase },
    { label: 'At least one uppercase letter', met: hasUppercase },
    { label: 'At least one number', met: hasNumber },
    { label: 'At least one special character (@$!%*?&)', met: hasSpecial },
  ]

  const getPasswordStrength = () => {
    const password = formData.password
    if (!password) return { strength: 0, text: '', color: '' }
    
    let strength = 0
    if (hasMinLength) strength++
    if (hasLowercase) strength++
    if (hasUppercase) strength++
    if (hasNumber) strength++
    if (hasSpecial) strength++
    
    if (strength <= 2) return { strength, text: 'Weak', color: 'text-red-500' }
    if (strength <= 4) return { strength, text: 'Medium', color: 'text-yellow-500' }
    return { strength, text: 'Strong', color: 'text-green-500' }
  }

  const passwordStrength = getPasswordStrength()
  const isPasswordValid = hasMinLength && hasLowercase && hasUppercase && hasNumber && hasSpecial

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (!isPasswordValid) {
      newErrors.password = 'Please meet all password requirements'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    try {
      await authService.resetPassword(token, formData.password)
      toast.success('Password reset successful! Please login with your new password.')
      navigate('/login', { replace: true })
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password'
      toast.error(message)
      if (message.includes('expired') || message.includes('invalid')) {
        setValidToken(false)
      }
    } finally {
      setLoading(false)
    }
  }

  if (!validToken) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-light text-charcoal mb-2">Invalid or Expired Link</h2>
              <p className="text-gray-500 text-sm mb-6">
                This password reset link is invalid or has expired.
              </p>
              <Link
                to="/forgot-password"
                className="inline-block bg-charcoal text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-charcoal-light transition"
              >
                Request New Reset Link
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-cream min-h-screen flex items-center justify-center py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-light text-charcoal">Create New Password</h1>
            <p className="text-gray-500 text-sm mt-2">
              Enter your new password below
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password Field */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">New Password *</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-warm transition"
                    placeholder="Create a new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5 text-gray-400" /> : <FiEye className="w-5 h-5 text-gray-400" />}
                  </button>
                </div>
                
                {/* Password strength bar */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            passwordStrength.strength <= 2 ? 'bg-red-500 w-1/3' :
                            passwordStrength.strength <= 4 ? 'bg-yellow-500 w-2/3' : 'bg-green-500 w-full'
                          }`}
                        />
                      </div>
                      <span className={`text-xs font-medium ${passwordStrength.color}`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Password requirements */}
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {formData.password ? (
                        req.met ? (
                          <FiCheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                        ) : (
                          <FiCircle className="w-3 h-3 text-gray-300 flex-shrink-0" />
                        )
                      ) : (
                        <FiCircle className="w-3 h-3 text-gray-300 flex-shrink-0" />
                      )}
                      <span className={`text-xs ${formData.password && req.met ? 'text-green-600' : 'text-gray-500'}`}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
                
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" /> {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Confirm New Password *</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-warm transition"
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? <FiEyeOff className="w-5 h-5 text-gray-400" /> : <FiEye className="w-5 h-5 text-gray-400" />}
                  </button>
                </div>
                <div className="mt-1 h-5">
                  {formData.confirmPassword && formData.password && formData.password === formData.confirmPassword && (
                    <p className="text-green-500 text-xs flex items-center gap-1">
                      <FiCheckCircle className="w-3 h-3" /> Passwords match
                    </p>
                  )}
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-charcoal text-white py-3 rounded-xl font-medium hover:bg-charcoal-light transition disabled:opacity-50 mt-4"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-warm transition"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
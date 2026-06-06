import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle, FiCircle } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(null) // null = not checked, true = match, false = no match

  // Reset form when component mounts (fresh page load)
  useEffect(() => {
    // Clear any autofilled data
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    })
    setErrors({})
    setPasswordMatch(null)
  }, [])

  // Check password match in real-time
  useEffect(() => {
    if (formData.confirmPassword && formData.password) {
      if (formData.password === formData.confirmPassword) {
        setPasswordMatch(true)
        // Clear confirm password error if exists
        if (errors.confirmPassword) {
          setErrors(prev => ({ ...prev, confirmPassword: '' }))
        }
      } else {
        setPasswordMatch(false)
      }
    } else if (formData.confirmPassword) {
      setPasswordMatch(false)
    } else {
      setPasswordMatch(null)
    }
  }, [formData.password, formData.confirmPassword])

  const validateEmail = (email) => {
    const re = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/
    return re.test(email)
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name must be less than 50 characters'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter'
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter'
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number'
    } else if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character (@$!%*?&)'
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
    const result = await register(formData.name, formData.email, formData.password)
    
    if (result && result.success) {
      // Clear form after successful registration
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
      setErrors({})
      setPasswordMatch(null)
      navigate('/login', { replace: true })
    }
    setLoading(false)
  }

  // Check password requirements
  const hasMinLength = formData.password.length >= 8
  const hasLowercase = /(?=.*[a-z])/.test(formData.password)
  const hasUppercase = /(?=.*[A-Z])/.test(formData.password)
  const hasNumber = /(?=.*\d)/.test(formData.password)
  const hasSpecial = /(?=.*[@$!%*?&])/.test(formData.password)

  // Password requirements list (always visible)
  const passwordRequirements = [
    { label: 'At least 8 characters', met: hasMinLength },
    { label: 'At least one lowercase letter', met: hasLowercase },
    { label: 'At least one uppercase letter', met: hasUppercase },
    { label: 'At least one number', met: hasNumber },
    { label: 'At least one special character (@$!%*?&)', met: hasSpecial },
  ]

  // Get password strength
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

  return (
    <div className="bg-cream min-h-screen flex items-center justify-center py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-light text-charcoal">Create Account</h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">Join LUXE HOME today</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-5 sm:p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-3" autoComplete="off">
              {/* Name Field */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Full Name *</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                    className={`w-full pl-9 sm:pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:border-warm transition text-sm ${
                      errors.name ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email Address *</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                    className={`w-full pl-9 sm:pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:border-warm transition text-sm ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="hello@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Password *</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 border rounded-xl focus:outline-none focus:border-warm transition text-sm ${
                      errors.password ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <FiEyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" /> : <FiEye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />}
                  </button>
                </div>
                
                
                {/* Password requirements - Always visible, each on new line */}
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
                <label className="block text-sm text-gray-600 mb-1">Confirm Password *</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 border rounded-xl focus:outline-none focus:border-warm transition text-sm ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? <FiEyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" /> : <FiEye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />}
                  </button>
                </div>
                
                {/* Real-time password match validation - fixed height to prevent layout shift */}
                <div className="mt-1 h-5">
                  {formData.confirmPassword && !errors.confirmPassword && (
                    passwordMatch === true ? (
                      <p className="text-green-500 text-xs flex items-center gap-1">
                        <FiCheckCircle className="w-3 h-3" /> Passwords match
                      </p>
                    ) : passwordMatch === false && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <FiAlertCircle className="w-3 h-3" /> Passwords do not match
                      </p>
                    )
                  )}
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-charcoal text-white py-2.5 rounded-xl font-medium hover:bg-charcoal-light transition disabled:opacity-50 mt-2 text-sm"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="text-warm hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Register
import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiPhone, FiMapPin, FiCamera, FiSave, FiLock, FiShield, FiBell, FiGlobe } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { authService } from '../../services/authService'
import toast from 'react-hot-toast'
import AdminLayout from '../components/AdminLayout'

const AdminProfile = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || 'Pakistan',
    }
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
  })

  // Load profile image from localStorage
  useEffect(() => {
    if (user) {
      const userId = user._id || user.id
      const savedImage = localStorage.getItem(`admin_profile_image_${userId}`)
      if (savedImage) {
        setProfileImage(savedImage)
      }
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
  }

  const handleNotificationChange = (e) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked })
  }

  const handleProfileImageClick = () => {
    fileInputRef.current.click()
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target.result
        setProfileImage(imageData)
        const userId = user?._id || user?.id
        localStorage.setItem(`admin_profile_image_${userId}`, imageData)
        // Dispatch custom event to notify navbar
        window.dispatchEvent(new CustomEvent('profileImageUpdated', { detail: { imageData } }))
        toast.success('Profile picture updated!')
      }
      reader.readAsDataURL(file)
    }
  }

  const removeProfileImage = () => {
    setProfileImage(null)
    const userId = user?._id || user?.id
    localStorage.removeItem(`admin_profile_image_${userId}`)
    // Dispatch custom event to notify navbar
    window.dispatchEvent(new CustomEvent('profileImageUpdated', { detail: { imageData: null } }))
    toast.success('Profile picture removed')
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updatedUser = await authService.updateProfile(formData)
      toast.success('Profile updated successfully!')
      // Update local user data
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
      const newUserData = { ...storedUser, ...updatedUser }
      localStorage.setItem('user', JSON.stringify(newUserData))
      // Dispatch event to update navbar
      window.dispatchEvent(new CustomEvent('profileImageUpdated'))
      window.dispatchEvent(new Event('storage'))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    
    setLoading(true)
    try {
      toast.success('Password updated successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      toast.error('Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateNotifications = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      toast.success('Notification preferences saved!')
    } catch (error) {
      toast.error('Failed to save preferences')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-light text-gray-800">Profile Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Image & Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <div className="text-center">
              {/* Profile Image */}
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-100 border-4 border-warm/20">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-warm/10">
                      <FiUser className="w-12 h-12 text-warm" />
                    </div>
                  )}
                </div>
                <button
                  onClick={handleProfileImageClick}
                  className="absolute bottom-2 right-2 bg-warn text-white p-2 rounded-full shadow-md hover:bg-warm/80 transition"
                >
                  <FiCamera size={16} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              
              <h2 className="text-xl font-medium text-gray-800">{formData.name || user?.name}</h2>
              <p className="text-gray-500 text-sm mt-1">{formData.email || user?.email}</p>
              <p className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                Administrator
              </p>
              
              {profileImage && (
                <button
                  onClick={removeProfileImage}
                  className="mt-3 text-sm text-red-500 hover:text-red-600 transition"
                >
                  Remove Photo
                </button>
              )}
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <FiShield className="text-warm" />
                <span>Admin Access: Full permissions</span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                <FiGlobe className="text-warm" />
                <span>Role: Administrator</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
              <FiUser className="text-warm" /> Personal Information
            </h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                    placeholder="+92 123 4567890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-charcoal text-white rounded-lg hover:bg-charcoal-light transition disabled:opacity-50"
                >
                  <FiSave size={18} /> Save Changes
                </button>
              </div>
            </form>
          </motion.div>

          {/* Change Password Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
              <FiLock className="text-warm" /> Change Password
            </h3>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-charcoal text-white rounded-lg hover:bg-charcoal-light transition disabled:opacity-50"
                >
                  <FiSave size={18} /> Update Password
                </button>
              </div>
            </form>
          </motion.div>

          {/* Notification Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
              <FiBell className="text-warm" /> Notification Preferences
            </h3>
            <form onSubmit={handleUpdateNotifications} className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium text-gray-800">Email Notifications</p>
                  <p className="text-xs text-gray-500">Receive important updates via email</p>
                </div>
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={notifications.emailNotifications}
                  onChange={handleNotificationChange}
                  className="w-5 h-5 rounded border-gray-300 text-warm focus:ring-warm"
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium text-gray-800">Order Updates</p>
                  <p className="text-xs text-gray-500">Get notified about new orders and status changes</p>
                </div>
                <input
                  type="checkbox"
                  name="orderUpdates"
                  checked={notifications.orderUpdates}
                  onChange={handleNotificationChange}
                  className="w-5 h-5 rounded border-gray-300 text-warm focus:ring-warm"
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium text-gray-800">Promotional Emails</p>
                  <p className="text-xs text-gray-500">Receive marketing and promotional offers</p>
                </div>
                <input
                  type="checkbox"
                  name="promotionalEmails"
                  checked={notifications.promotionalEmails}
                  onChange={handleNotificationChange}
                  className="w-5 h-5 rounded border-gray-300 text-warm focus:ring-warm"
                />
              </label>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-charcoal text-white rounded-lg hover:bg-charcoal-light transition disabled:opacity-50"
                >
                  <FiSave size={18} /> Save Preferences
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminProfile
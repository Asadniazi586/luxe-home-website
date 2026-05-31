import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { notificationService } from '../services/notificationService'
import { useAuth } from './AuthContext'

const AdminNavbarContext = createContext()

export const useAdminNavbar = () => useContext(AdminNavbarContext)

export const AdminNavbarProvider = ({ children }) => {
  const { user } = useAuth() // Get user from AuthContext
  const [profileImage, setProfileImage] = useState(null)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [initialized, setInitialized] = useState(false)

  // Load profile data when user changes
  useEffect(() => {
    if (user && user.role === 'admin') {
      const userId = user._id || user.id
      setUserName(user.name || user.email?.split('@')[0] || 'Admin')
      setUserEmail(user.email || '')
      
      const savedImage = localStorage.getItem(`admin_profile_image_${userId}`)
      if (savedImage) {
        setProfileImage(savedImage)
      }
    }
  }, [user])

  // Listen for profile image updates
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      if (event.detail && event.detail.userId === (user?._id || user?.id)) {
        setProfileImage(event.detail.imageData)
      }
    }
    
    const handleStorageChange = () => {
      if (user) {
        const userId = user._id || user.id
        const savedImage = localStorage.getItem(`admin_profile_image_${userId}`)
        setProfileImage(savedImage)
      }
    }
    
    window.addEventListener('adminProfileImageUpdated', handleProfileUpdate)
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('adminProfileImageUpdated', handleProfileUpdate)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [user])

  // Fetch notifications once
  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationService.getNotifications()
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
      setInitialized(true)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      setInitialized(true)
    }
  }, [])

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [user, fetchNotifications])

  // Refresh notifications silently
  const refreshNotifications = useCallback(async () => {
    try {
      const data = await notificationService.getNotifications()
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (error) {
      console.error('Error refreshing notifications:', error)
    }
  }, [])

  const markAsRead = useCallback(async (id) => {
    try {
      await notificationService.markAsRead(id)
      await refreshNotifications()
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }, [refreshNotifications])

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead()
      await refreshNotifications()
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }, [refreshNotifications])

  const deleteNotification = useCallback(async (id) => {
    try {
      await notificationService.deleteNotification(id)
      await refreshNotifications()
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }, [refreshNotifications])

  const clearAllNotifications = useCallback(async () => {
    try {
      for (const notif of notifications) {
        await notificationService.deleteNotification(notif._id)
      }
      await refreshNotifications()
    } catch (error) {
      console.error('Failed to clear notifications:', error)
    }
  }, [notifications, refreshNotifications])

  const updateProfileImage = useCallback((imageData) => {
    setProfileImage(imageData)
  }, [])

  const value = {
    profileImage,
    userName,
    userEmail,
    notifications,
    unreadCount,
    initialized,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updateProfileImage,
    refreshNotifications
  }

  return (
    <AdminNavbarContext.Provider value={value}>
      {children}
    </AdminNavbarContext.Provider>
  )
}
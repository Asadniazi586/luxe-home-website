import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiBell,
  FiUser,
  FiChevronDown,
  FiLogOut,
  FiSettings,
  FiPackage,
  FiUsers,
  FiAlertCircle,
  FiCheckCircle,
  FiX,
  FiTrash2,
  FiHome,
  FiShoppingBag,
} from "react-icons/fi";

import { useAuth } from "../../contexts/AuthContext";
import { notificationService } from "../../services/notificationService";
import toast from "react-hot-toast";

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Notification States
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Load profile data
  useEffect(() => {
    if (user) {
      setUserName(user.name || user.email?.split("@")[0] || "Admin");
      setUserEmail(user.email || "");

      const userId = user._id || user.id;
      const savedImage = localStorage.getItem(`admin_profile_image_${userId}`);

      if (savedImage) {
        setProfileImage(savedImage);
      }
    }
  }, [user]);

  // Profile Updates
  useEffect(() => {
    const handleStorageChange = () => {
      if (user) {
        const userId = user._id || user.id;
        const savedImage = localStorage.getItem(`admin_profile_image_${userId}`);
        setProfileImage(savedImage);
      }
    };

    const handleProfileUpdate = () => {
      if (user) {
        const userId = user._id || user.id;
        const savedImage = localStorage.getItem(`admin_profile_image_${userId}`);
        setProfileImage(savedImage);

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserName(parsedUser.name || user.name);
          setUserEmail(parsedUser.email || user.email);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("profileImageUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("profileImageUpdated", handleProfileUpdate);
    };
  }, [user]);

  // Fetch Notifications
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const handleClearAll = async () => {
    try {
      for (const notif of notifications) {
        await notificationService.deleteNotification(notif._id);
      }
      fetchNotifications();
      toast.success("All notifications cleared");
    } catch (error) {
      toast.error("Failed to clear notifications");
    }
  };

  const handleDeleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(id);
      fetchNotifications();
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return <FiPackage className="w-4 h-4 text-blue-500" />;
      case "user":
        return <FiUsers className="w-4 h-4 text-green-500" />;
      case "stock":
        return <FiAlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <FiCheckCircle className="w-4 h-4 text-purple-500" />;
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Close dropdowns outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const goToShop = () => {
    navigate("/shop");
  };

  const goToHome = () => {
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-[100] border-b border-gray-700 overflow-visible">
      <div className="flex items-center gap-3">
        {/* Profile Section - UNCHANGED */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 focus:outline-none hover:bg-gray-800 rounded-lg px-3 py-2 transition"
          >
            <div className="flex items-center gap-3">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-warm"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-warm/20 flex items-center justify-center border-2 border-warm/50">
                  <FiUser size={20} className="text-white" />
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white">{userName}</p>
                <p className="text-xs text-white">Administrator</p>
              </div>
              <FiChevronDown size={16} className="text-white" />
            </div>
          </button>

          {/* Profile Dropdown - UNCHANGED */}
          {showDropdown && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-[999] border border-gray-200">
              <Link
                to="/admin/profile"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <FiUser size={16} />
                My Profile
              </Link>
              <Link
                to="/admin/settings"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <FiSettings size={16} />
                Settings
              </Link>
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition w-full text-left"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side - Home, Shop buttons and Notification Bell (MOVED HERE) */}
      <div className="flex items-center gap-4">
        {/* View Site Buttons - Home and Shop */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToHome}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-white hover:bg-gray-800 rounded-lg transition"
            title="Go to Homepage"
          >
            <FiHome size={16} className="text-white" />
            <span className="text-white">Home</span>
          </button>
          <button
            onClick={goToShop}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-white hover:bg-gray-800 rounded-lg transition"
            title="Go to Shop"
          >
            <FiShoppingBag size={16} className="text-white" />
            <span className="text-white">Shop</span>
          </button>
        </div>

        {/* Notification Bell - UNCHANGED */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-gray-800 transition relative"
          >
            <FiBell size={20} className="text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown - UNCHANGED */}
          {showNotifications && (
            <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-[9999] overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-warm hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {loading ? (
                  <div className="p-6 text-center text-gray-400 text-sm">Loading...</div>
                ) : notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <FiBell className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-400 text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${
                        !notif.isRead ? "bg-blue-50/30" : ""
                      }`}
                      onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {notif.title}
                            </p>
                            <button
                              onClick={(e) => handleDeleteNotification(notif._id, e)}
                              className="text-gray-300 hover:text-red-500 transition flex-shrink-0"
                            >
                              <FiX size={12} />
                            </button>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {notif.message}
                          </p>
                          <div className="flex items-center justify-between mt-1.5">
                            <p className="text-xs text-gray-400">{getTimeAgo(notif.createdAt)}</p>
                            {!notif.isRead && (
                              <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 py-2 border-t border-gray-100 text-center bg-gray-50">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
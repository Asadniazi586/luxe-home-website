// UserDashboard.jsx - Updated with auto-refresh (no visible refresh button)
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiPackage, FiHeart, FiSettings, FiLogOut, FiShoppingBag, FiCamera, FiX } from 'react-icons/fi'
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { orderService } from "../services/orderService";
import { authService } from "../services/authService";
import toast from "react-hot-toast";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.avatar || null);
  const [showImageModal, setShowImageModal] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      zipCode: user?.address?.zipCode || "",
      country: user?.address?.country || "",
    },
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Set active tab from URL parameter
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "orders") {
      setActiveTab("orders");
    }
  }, [searchParams]);

  // Fetch real orders from backend - with optional loading indicator
  const fetchOrders = useCallback(async (showLoading = true) => {
    if (!user) return;
    if (showLoading) {
      setLoading(true);
    }
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [user]);

  // Initial fetch with loading indicator
  useEffect(() => {
    fetchOrders(true);
  }, [fetchOrders]);

  // Auto-refresh orders every 30 seconds in background (no loading indicator)
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      fetchOrders(false); // Silent refresh - no loading indicator
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [user, fetchOrders]);

  // Load saved profile image from localStorage
  useEffect(() => {
    if (user) {
      const userId = user._id || user.id;
      const savedImage = localStorage.getItem(`profile_image_${userId}`);
      if (savedImage) {
        setProfileImage(savedImage);
      }
    }
  }, [user]);

  const tabs = [
    { id: "overview", label: "Overview", icon: FiUser },
    { id: "orders", label: "Orders", icon: FiPackage },
    { id: "wishlist", label: "Wishlist", icon: FiHeart },
    { id: "settings", label: "Settings", icon: FiSettings },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const updatedUser = await authService.updateProfile(formData);
      toast.success("Profile updated successfully!");
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, ...updatedUser }),
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfileImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setProfileImage(imageData);
        const userId = user?._id || user?.id;
        localStorage.setItem(`profile_image_${userId}`, imageData);
        window.dispatchEvent(
          new CustomEvent("profileImageUpdated", {
            detail: { userId, imageData },
          }),
        );
        toast.success("Profile picture updated!");
        setShowImageModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    const userId = user?._id || user?.id;
    localStorage.removeItem(`profile_image_${userId}`);
    window.dispatchEvent(
      new CustomEvent("profileImageRemoved", { detail: { userId } }),
    );
    toast.success("Profile picture removed");
    setShowImageModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      case "Pending":
        return "bg-orange-100 text-orange-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      Pending: "⏳ Pending",
      Processing: "🔄 Processing",
      Shipped: "📦 Shipped",
      Delivered: "✅ Delivered",
      Cancelled: "❌ Cancelled",
    };
    return statusMap[status] || status;
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-cream min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block group">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-warm/20 flex items-center justify-center relative">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={user?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser className="w-12 h-12 text-warm" />
                    )}
                  </div>
                  <button
                    onClick={handleProfileImageClick}
                    className="absolute bottom-0 right-0 bg-warm text-white p-1.5 rounded-full shadow-md hover:bg-warm/80 transition"
                  >
                    <FiCamera size={14} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <h3 className="font-medium text-charcoal mt-3">{user?.name}</h3>
                <p className="text-gray-500 text-sm">{user?.email}</p>
              </div>
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                      activeTab === tab.id
                        ? "bg-warm/10 text-warm"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 transition"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              {activeTab === "overview" && (
                <div>
                  <h2 className="text-xl font-light text-charcoal mb-6">
                    Dashboard Overview
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <FiShoppingBag className="w-8 h-8 mx-auto text-warm mb-2" />
                      <div className="text-2xl font-light text-charcoal">
                        {orders.length}
                      </div>
                      <div className="text-xs text-gray-500">Total Orders</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <FiHeart className="w-8 h-8 mx-auto text-warm mb-2" />
                      <div className="text-2xl font-light text-charcoal">
                        {wishlistItems.length}
                      </div>
                      <div className="text-xs text-gray-500">
                        Wishlist Items
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <FiPackage className="w-8 h-8 mx-auto text-warm mb-2" />
                      <div className="text-2xl font-light text-charcoal">
                        {cartItems.length}
                      </div>
                      <div className="text-xs text-gray-500">Cart Items</div>
                    </div>
                  </div>
                  <div className="border-t pt-6">
                    <h3 className="font-medium text-charcoal mb-4">
                      Recent Activity
                    </h3>
                    {orders.length > 0 ? (
                      <div className="space-y-3">
                        {orders.slice(0, 3).map((order) => (
                          <div
                            key={order._id}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="text-sm font-medium text-charcoal">
                                Order #{order._id?.slice(-6)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-charcoal">
                                ${order.totalPrice?.toFixed(2)}
                              </p>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}
                              >
                                {getStatusBadge(order.status)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No orders yet.</p>
                    )}
                  </div>
                </div>
              )}
          
              {activeTab === "orders" && (
                <div>
                  <h2 className="text-xl font-light text-charcoal mb-6">
                    Order History
                  </h2>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="w-8 h-8 border-2 border-warm border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <FiPackage className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500">No orders yet</p>
                      <Link
                        to="/shop"
                        className="inline-block mt-4 text-warm hover:underline"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="font-medium text-charcoal">
                                Order #{order._id?.slice(-8)}
                              </span>
                              <p className="text-xs text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                            >
                              {getStatusBadge(order.status)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {order.orderItems?.length || 0} items
                            </span>
                            <span className="font-medium text-charcoal">
                              ${order.totalPrice?.toFixed(2)}
                            </span>
                          </div>
                          {order.orderItems && order.orderItems.length > 0 && (
                            <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                              {order.orderItems.slice(0, 2).map((item, idx) => (
                                <span key={idx}>
                                  {item.name} x{item.quantity}
                                  {idx <
                                    Math.min(order.orderItems.length, 2) - 1 &&
                                    ", "}
                                </span>
                              ))}
                              {order.orderItems.length > 2 &&
                                ` +${order.orderItems.length - 2} more`}
                            </div>
                          )}
                          <div className="mt-2 text-xs text-gray-400">
                            Last updated:{" "}
                            {new Date(order.updatedAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === "wishlist" && (
                <div>
                  <h2 className="text-xl font-light text-charcoal mb-6">
                    Wishlist
                  </h2>
                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-8">
                      <FiHeart className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500">Your wishlist is empty</p>
                      <Link
                        to="/shop"
                        className="inline-block mt-4 text-warm hover:underline"
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="flex gap-4 border-b pb-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-charcoal">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              ${item.price}
                            </p>
                          </div>
                          <button className="text-warm text-sm hover:underline">
                            Add to Cart
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === "settings" && (
                <div>
                  <h2 className="text-xl font-light text-charcoal mb-6">
                    Account Settings
                  </h2>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Street Address
                        </label>
                        <input
                          type="text"
                          name="address.street"
                          value={formData.address.street}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          name="address.zipCode"
                          value={formData.address.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={updating}
                      className="bg-charcoal text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-charcoal-light transition disabled:opacity-50"
                    >
                      {updating ? "Saving..." : "Save Changes"}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-charcoal">
                Profile Picture
              </h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="text-center py-4">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-100 mb-4">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="w-16 h-16 mx-auto mt-8 text-gray-400" />
                )}
              </div>
              <button
                onClick={handleProfileImageClick}
                className="w-full bg-warm text-white py-2 rounded-lg hover:bg-warm/80 transition mb-2"
              >
                Upload New Picture
              </button>
              {profileImage && (
                <button
                  onClick={removeProfileImage}
                  className="w-full text-red-500 py-2 rounded-lg hover:bg-red-50 transition"
                >
                  Remove Picture
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
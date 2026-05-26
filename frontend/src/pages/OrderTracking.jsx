import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiUser, FiMail, FiPhone, FiCalendar, FiDollarSign, FiSearch, FiShoppingBag } from 'react-icons/fi'
import { orderService } from '../services/orderService'
import toast from 'react-hot-toast'

const OrderTracking = () => {
  const navigate = useNavigate()
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Status steps and their configurations
  const statusSteps = [
    { status: 'Pending', icon: FiClock, color: 'text-yellow-500', bgColor: 'bg-yellow-100', label: 'Order Placed' },
    { status: 'Processing', icon: FiPackage, color: 'text-blue-500', bgColor: 'bg-blue-100', label: 'Processing' },
    { status: 'Shipped', icon: FiTruck, color: 'text-purple-500', bgColor: 'bg-purple-100', label: 'Shipped' },
    { status: 'Delivered', icon: FiCheckCircle, color: 'text-green-500', bgColor: 'bg-green-100', label: 'Delivered' },
    { status: 'Cancelled', icon: FiCheckCircle, color: 'text-red-500', bgColor: 'bg-red-100', label: 'Cancelled' }
  ]

  const getCurrentStepIndex = () => {
    if (!order) return 0
    const index = statusSteps.findIndex(step => step.status === order.status)
    return index !== -1 ? index : 0
  }

const handleTrackOrder = async (e) => {
  e.preventDefault()
  
  if (!orderId.trim()) {
    toast.error('Please enter an Order ID')
    return
  }

  setLoading(true)
  setError(null)
  
  try {
    const trimmedId = orderId.trim().replace(/^#/, '');
    
    // Try by short ID first
    const response = await orderService.getOrderByNumber(trimmedId);
    
    if (response && response._id) {
      setOrder(response)
      toast.success('Order found!')
    } else {
      setError('Order not found')
    }
  } catch (err) {
    console.error('Error:', err);
    setError('Order not found. Please check your Order ID.')
    setOrder(null)
    toast.error('Order not found')
  } finally {
    setLoading(false)
  }
}

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Processing': 'bg-blue-100 text-blue-700',
      'Shipped': 'bg-purple-100 text-purple-700',
      'Delivered': 'bg-green-100 text-green-700',
      'Cancelled': 'bg-red-100 text-red-700'
    }
    return statusMap[status] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-gray-800 mb-2">Track Your Order</h1>
          <p className="text-gray-500">Enter your order ID to check the current status</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleTrackOrder} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter your order ID (e.g., 0a7afb or full ID)"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
              />
              <p className="text-xs text-gray-400 mt-1">You can find this in your order confirmation email or dashboard</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="md:self-end px-6 py-3 bg-warm text-white rounded-lg font-medium hover:bg-warm/80 transition disabled:opacity-50 flex items-center gap-2 justify-center"
            >
              <FiSearch className="w-4 h-4" />
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-center">{error}</p>
            <p className="text-sm text-gray-500 text-center mt-2">
              Please check your order ID and try again. If the problem persists, contact our support team.
            </p>
          </div>
        )}

        {/* Order Details */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Order Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="text-xl font-semibold text-gray-800 font-mono">
                    #{order.orderNumber || order._id?.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Full ID: {order._id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="text-gray-800">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(order.status)}`}>
                    {order.status || 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-6">Order Status</h3>
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 ml-2 md:ml-6"></div>
                
                {/* Steps */}
                <div className="space-y-8 relative">
                  {statusSteps.map((step, idx) => {
                    const isCompleted = idx <= getCurrentStepIndex()
                    const isCurrent = order.status === step.status
                    const isCancelled = order.status === 'Cancelled'
                    
                    return (
                      <div key={step.status} className="flex items-start gap-4 relative">
                        {/* Icon Circle */}
                        <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCompleted && !isCancelled ? step.bgColor : 'bg-gray-100'
                        }`}>
                          <step.icon className={`w-5 h-5 ${
                            isCompleted && !isCancelled ? step.color : 'text-gray-400'
                          }`} />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex flex-wrap justify-between items-start">
                            <div>
                              <h4 className={`font-medium ${
                                isCompleted && !isCancelled ? 'text-gray-800' : 'text-gray-400'
                              }`}>
                                {step.label}
                              </h4>
                              {isCurrent && !isCancelled && (
                                <span className="text-xs text-warm mt-1 inline-block">Current Status</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Cancelled Message */}
              {order.status === 'Cancelled' && (
                <div className="mt-6 p-4 bg-red-50 rounded-lg">
                  <p className="text-red-600 text-sm">
                    This order has been cancelled. If you have any questions, please contact our support team.
                  </p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                <FiShoppingBag className="w-5 h-5 text-warm" />
                Order Items ({order.orderItems?.length || 0})
              </h3>
              <div className="space-y-4">
                {order.orderItems && order.orderItems.length > 0 ? (
                  order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex gap-4 pb-4 border-b last:border-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => e.target.src = 'https://placehold.co/80x80/f5f0e8/8b7355?text=Product'}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                        {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                        {item.color && <p className="text-xs text-gray-500">Color: {item.color}</p>}
                        <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">Rs {(item.price * item.quantity).toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Rs {item.price.toLocaleString()} each</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No items found in this order</p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">Rs {(order.itemsPrice || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-800">Rs {(order.shippingPrice || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-800">Rs {(order.taxPrice || 0).toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-800">Total</span>
                    <span className="text-gray-800 text-lg">Rs {(order.totalPrice || 0).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">PKR</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                <FiMapPin className="w-5 h-5 text-warm" />
                Shipping Address
              </h3>
              {order.shippingAddress ? (
                <div className="space-y-2">
                  <p className="text-gray-800">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p className="text-gray-600 text-sm">{order.shippingAddress.address}</p>
                  {order.shippingAddress.apartment && (
                    <p className="text-gray-600 text-sm">{order.shippingAddress.apartment}</p>
                  )}
                  <p className="text-gray-600 text-sm">
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                  <p className="text-gray-600 text-sm">{order.shippingAddress.country}</p>
                  <p className="text-gray-600 text-sm">Postal Code: {order.shippingAddress.postalCode || 'N/A'}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 pt-2 border-t">
                    {order.shippingAddress.phone && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <FiPhone className="w-3 h-3" /> {order.shippingAddress.phone}
                      </p>
                    )}
                    {order.shippingAddress.email && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <FiMail className="w-3 h-3" /> {order.shippingAddress.email}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No shipping address available</p>
              )}
            </div>

            {/* Need Help Section */}
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <h3 className="text-md font-medium text-gray-800 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-3">
                If you have any questions about your order, please contact our customer support.
              </p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => navigate('/contact')}
                  className="px-4 py-2 bg-warm text-white rounded-lg text-sm hover:bg-warm/80 transition"
                >
                  Contact Support
                </button>
                <button 
                  onClick={() => navigate('/shop')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default OrderTracking
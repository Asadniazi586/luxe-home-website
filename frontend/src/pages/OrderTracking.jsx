import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiUser, FiMail, FiPhone, FiCalendar, FiDollarSign, FiSearch, FiShoppingBag, FiBox, FiArrowRight } from 'react-icons/fi'
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
      console.log('Searching for:', trimmedId);
      
      const result = await orderService.getOrderByNumber(trimmedId);
      console.log('Result from service:', result);
      
      if (result && result._id) {
        setOrder(result);
        toast.success('Order found!');
      } else {
        setError('Order not found');
      }
    } catch (err) {
      console.error('Caught error:', err);
      setError('Order not found. Please check your Order ID.');
      setOrder(null);
      toast.error('Order not found');
    } finally {
      setLoading(false);
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
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        
        {/* Header - Modern Design */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-warm to-orange-400 rounded-2xl mb-5 shadow-lg">
            <FiBox className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-3">Track Your Order</h1>
          <div className="w-20 h-0.5 bg-gradient-to-r from-warm to-orange-400 mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Enter your order ID to check the current status</p>
        </div>

{/* Search Form - Button perfectly aligned with input field */}
<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-white/50">
  <form onSubmit={handleTrackOrder}>
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter your order ID (e.g., 0a7afb)"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-warm focus:ring-2 focus:ring-warm/20 transition text-gray-700 text-sm"
        />
        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
          <FiClock size={10} /> You can find this in your order confirmation email or dashboard
        </p>
      </div>
      <div className="flex items-start pt-0 sm:pt-0">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-gradient-to-r from-warm to-orange-400 text-white rounded-xl font-medium hover:from-warm/90 hover:to-orange-400/90 transition disabled:opacity-50 flex items-center gap-2 justify-center shadow-md whitespace-nowrap"
        >
          <FiSearch className="w-4 h-4" />
          {loading ? 'Searching...' : 'Track Order'}
        </button>
      </div>
    </div>
  </form>
</div>

        {/* Error Message - Modern Design */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 mb-6 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FiPackage className="w-4 h-4 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-red-600 font-medium">{error}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Please check your order ID and try again. If the problem persists, contact our support team.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Order Details - Modern Cards */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Order Header - Modern Glass Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiBox className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Order ID</p>
                    <p className="text-xl font-semibold text-gray-800 font-mono">
                      #{order.orderNumber || order._id?.slice(-6).toUpperCase()}
                    </p>
                    {/* <p className="text-xs text-gray-400 mt-0.5">Full ID: {order._id}</p> */}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FiCalendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Order Date</p>
                    <p className="text-gray-800 font-medium">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(order.status)}`}>
                    <div className={`w-2 h-2 rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-500' :
                      order.status === 'Shipped' ? 'bg-purple-500' :
                      order.status === 'Processing' ? 'bg-blue-500' :
                      order.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    {order.status || 'Pending'}
                  </span>
                </div>
              </div>
            </div>

        
          {/* Tracking Timeline - FedEx Style Horizontal Progress Bar */}
<div className="bg-white rounded-2xl shadow-lg overflow-hidden">
  <div className="border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
      <FiTruck className="text-warm" /> Order Status
    </h3>
  </div>
  <div className="p-8">
    {/* FedEx Style Progress Steps */}
    <div className="relative">
      {/* Progress Bar Background */}
      <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
      
      {/* Active Progress Bar */}
      <div 
        className="absolute top-5 left-0 h-1 bg-gradient-to-r from-warm to-orange-400 rounded-full transition-all duration-500"
        style={{ width: `${(getCurrentStepIndex() / (statusSteps.length - 1)) * 100}%` }}
      ></div>
      
      {/* Step Circles */}
      <div className="relative flex justify-between">
        {statusSteps.map((step, idx) => {
          const isCompleted = idx <= getCurrentStepIndex()
          const isCurrent = order.status === step.status
          const isCancelled = order.status === 'Cancelled'
          
          return (
            <div key={step.status} className="flex flex-col items-center text-center flex-1">
              {/* Step Circle */}
              <div 
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted && !isCancelled 
                    ? 'bg-gradient-to-r from-warm to-orange-400 text-white shadow-lg' 
                    : isCancelled && idx === getCurrentStepIndex()
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {isCompleted && !isCancelled ? (
                  <FiCheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{idx + 1}</span>
                )}
              </div>
              
              {/* Step Label */}
              <p className={`mt-3 text-sm font-semibold ${
                isCompleted && !isCancelled ? 'text-gray-800' : 'text-gray-400'
              }`}>
                {step.label}
              </p>
              
              {/* Step Date (if completed) */}
              {isCompleted && step.status === 'Delivered' && order.deliveredAt && (
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(order.deliveredAt)}
                </p>
              )}
              {isCurrent && !isCancelled && (
                <span className="text-xs text-warm font-medium mt-1 animate-pulse">In Progress</span>
              )}
            </div>
          )
        })}
      </div>
    </div>

    {/* Status Message */}
    <div className="mt-8 p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-warm/20 flex items-center justify-center">
          <FiTruck className="w-5 h-5 text-warm" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">
            {order.status === 'Pending' && 'Your order has been received and is awaiting processing.'}
            {order.status === 'Processing' && 'Your order is being processed and prepared for shipment.'}
            {order.status === 'Shipped' && 'Your order has been shipped and is on its way to you.'}
            {order.status === 'Delivered' && 'Your order has been delivered. Enjoy your purchase!'}
            {order.status === 'Cancelled' && 'This order has been cancelled.'}
          </p>
          {order.status === 'Shipped' && order.shippedAt && (
            <p className="text-xs text-gray-500 mt-1">Shipped on: {formatDate(order.shippedAt)}</p>
          )}
          {order.status === 'Delivered' && order.deliveredAt && (
            <p className="text-xs text-gray-500 mt-1">Delivered on: {formatDate(order.deliveredAt)}</p>
          )}
        </div>
      </div>
    </div>

    {/* Cancelled Message */}
    {order.status === 'Cancelled' && (
      <div className="mt-4 p-4 bg-red-50 rounded-xl border-l-4 border-red-500">
        <p className="text-red-600 text-sm font-medium">
          This order has been cancelled. If you have any questions, please contact our support team.
        </p>
      </div>
    )}
  </div>
</div>

            {/* Order Items - Modern Card with USD */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FiShoppingBag className="text-warm" /> Order Items ({order.orderItems?.length || 0})
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {order.orderItems && order.orderItems.length > 0 ? (
                    order.orderItems.map((item, idx) => (
                      <div key={idx} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 p-3 rounded-xl transition">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-20 h-20 object-cover rounded-xl shadow-sm"
                          onError={(e) => e.target.src = 'https://placehold.co/80x80/f5f0e8/8b7355?text=Product'}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{item.name}</h4>
                          {item.size && <p className="text-xs text-gray-500 mt-0.5">Size: {item.size}</p>}
                          {item.color && <p className="text-xs text-gray-500">Color: {item.color}</p>}
                          <p className="text-sm text-gray-600 mt-1 font-medium">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">${(item.price * item.quantity).toLocaleString()}</p>
                          <p className="text-xs text-gray-400">${item.price.toLocaleString()} each</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No items found in this order</p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary & Shipping Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Order Summary with USD */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-green-50 to-white">
                  <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                    <FiDollarSign className="text-green-600" /> Order Summary
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="text-gray-800 font-medium">${(order.itemsPrice || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span className="text-gray-800 font-medium">${(order.shippingPrice || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tax</span>
                      <span className="text-gray-800 font-medium">${(order.taxPrice || 0).toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span className="text-gray-800">Total</span>
                        <span className="text-gray-900">${(order.totalPrice || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-teal-50 to-white">
                  <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                    <FiMapPin className="text-teal-600" /> Shipping Address
                  </h3>
                </div>
                <div className="p-6">
                  {order.shippingAddress ? (
                    <div className="space-y-2 text-sm">
                      <p className="font-semibold text-gray-800 text-base">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </p>
                      <p className="text-gray-600">{order.shippingAddress.address}</p>
                      {order.shippingAddress.apartment && (
                        <p className="text-gray-600">{order.shippingAddress.apartment}</p>
                      )}
                      <p className="text-gray-600">
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </p>
                      <p className="text-gray-600">{order.shippingAddress.country}</p>
                      <p className="text-gray-600">Postal Code: {order.shippingAddress.postalCode || 'N/A'}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                        {order.shippingAddress.phone && (
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <FiPhone className="w-3.5 h-3.5 text-gray-400" /> {order.shippingAddress.phone}
                          </p>
                        )}
                        {order.shippingAddress.email && (
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <FiMail className="w-3.5 h-3.5 text-gray-400" /> {order.shippingAddress.email}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No shipping address available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Need Help Section - Modern */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl p-6 text-center shadow-inner">
              <h3 className="text-md font-semibold text-gray-800 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                If you have any questions about your order, please contact our customer support.
              </p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => navigate('/contact')}
                  className="px-6 py-2.5 bg-gradient-to-r from-warm to-orange-400 text-white rounded-xl text-sm font-medium hover:from-warm/90 hover:to-orange-400/90 transition shadow-md"
                >
                  Contact Support
                </button>
                <button 
                  onClick={() => navigate('/shop')}
                  className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
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
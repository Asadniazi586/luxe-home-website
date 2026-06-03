import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiCheckCircle, FiPackage, FiMapPin, FiCreditCard, 
  FiTruck, FiCalendar, FiHome, FiShoppingBag, FiUser, 
  FiMail, FiPhone, FiBox, FiClock
} from 'react-icons/fi'
import { useCart } from '../contexts/CartContext'

const OrderSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [])

  // Try to get order data from location.state first, then from localStorage
  let orderData = location.state
  
  // If no state, try to load from localStorage
  useEffect(() => {
    if (!orderData || !orderData.orderId) {
      const savedOrder = localStorage.getItem('orderSuccessData')
      if (savedOrder) {
        orderData = JSON.parse(savedOrder)
      } else {
        const timer = setTimeout(() => {
          navigate('/shop')
        }, 3000)
        return () => clearTimeout(timer)
      }
    }
  }, [])

  // Get orderData from localStorage if state is empty
  const finalOrderData = orderData?.orderId ? orderData : (() => {
    const saved = localStorage.getItem('orderSuccessData')
    return saved ? JSON.parse(saved) : null
  })()

  // If no order data, show error
  if (!finalOrderData || !finalOrderData.orderId) {
    return (
      <div className="bg-[#FAF9F7] min-h-screen pt-32 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiPackage className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-xl md:text-2xl font-light text-[#2C2C2C] mb-2">No Order Found</h2>
          <p className="text-gray-500 mb-6 text-sm">Something went wrong. Please try again.</p>
          <Link to="/shop">
            <button className="bg-[#2C2C2C] text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full text-sm font-medium hover:bg-[#D4A574] transition">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#FAF9F7] min-h-screen pt-16 md:pt-20 pb-8 md:pb-12">
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-6xl">
        
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-10"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-full mb-4 md:mb-5 shadow-lg">
            <FiCheckCircle className="w-10 h-10 md:w-12 md:h-12 text-white" />
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-light text-[#2C2C2C] mb-2 md:mb-3">Thank You for Your Order!</h1>
          <p className="text-gray-500 text-sm md:text-lg px-4">Your order has been placed successfully. We'll notify you when it ships.</p>
        </motion.div>

        {/* Order ID Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 relative"
        >
          {/* Payment Status - Top Right Corner */}
          <div className="absolute top-4 right-4 md:top-6 md:right-6">
            <span className={`inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold ${
              finalOrderData.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 
              finalOrderData.paymentStatus === 'Awaiting Confirmation' ? 'bg-blue-100 text-blue-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                finalOrderData.paymentStatus === 'Paid' ? 'bg-green-500' : 
                finalOrderData.paymentStatus === 'Awaiting Confirmation' ? 'bg-blue-500' :
                'bg-yellow-500'
              }`} />
              {finalOrderData.paymentStatus}
            </span>
          </div>
          
          <div className="flex flex-col md:grid md:grid-cols-3 items-start md:items-center gap-4 md:gap-0">
            <div className="flex items-center gap-3 md:gap-4 md:justify-start">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiBox className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide">Order ID</p>
                <p className="text-base md:text-xl font-semibold text-[#2C2C2C] font-mono">{finalOrderData.orderId}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 md:gap-4 md:justify-center md:mx-auto">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FiCalendar className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide">Order Date</p>
                <p className="text-sm md:text-base text-[#2C2C2C]">{finalOrderData.date} at {finalOrderData.time}</p>
              </div>
            </div>
            
            <div className="hidden md:block"></div>
          </div>
        </motion.div>

        {/* Order Summary - Full width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6"
        >
          <div className="border-b border-[#E8E5E0] px-4 md:px-6 py-3 md:py-4 bg-gray-50/50">
            <h3 className="text-base md:text-lg font-semibold text-[#2C2C2C] flex items-center gap-2">
              <FiPackage className="text-[#D4A574]" /> Order Summary
            </h3>
          </div>
          <div className="p-4 md:p-6">
            <div className="space-y-4">
              {finalOrderData.items?.map((item, idx) => (
                <div key={idx} className="flex gap-3 md:gap-4 pb-4 border-b border-[#E8E5E0] last:border-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl shadow-sm"
                    onError={(e) => e.target.src = 'https://placehold.co/80x80/f5f0e8/8b7355?text=Product'}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm md:text-base text-[#2C2C2C]">{item.name}</h4>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm md:text-base text-[#2C2C2C]">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-[10px] md:text-xs text-gray-400">${item.price} each</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-[#E8E5E0]">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-[#2C2C2C] font-medium">${finalOrderData.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-[#2C2C2C] font-medium">${finalOrderData.shippingCharge?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="text-[#2C2C2C] font-medium">${finalOrderData.tax?.toFixed(2)}</span>
                </div>
                <div className="border-t border-[#E8E5E0] pt-3 mt-3">
                  <div className="flex justify-between font-bold text-base md:text-lg">
                    <span className="text-[#2C2C2C]">Total</span>
                    <span className="text-[#2C2C2C]">${finalOrderData.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8">
          <Link to="/shop" className="flex-1">
            <button className="w-full bg-[#2C2C2C] text-white py-3 md:py-3.5 rounded-xl font-semibold hover:bg-[#D4A574] transition shadow-md flex items-center justify-center gap-2 text-sm md:text-base">
              <FiShoppingBag size={16} className="md:w-5 md:h-5" /> Continue Shopping
            </button>
          </Link>
          <Link to="/" className="flex-1">
            <button className="w-full border-2 border-[#E8E5E0] text-[#2C2C2C] py-3 md:py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2 text-sm md:text-base">
              <FiHome size={16} className="md:w-5 md:h-5" /> Back to Home
            </button>
          </Link>
        </div>

        {/* 2x2 Grid for Address and Payment Cards - Below buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Shipping Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="border-b border-[#E8E5E0] px-4 md:px-6 py-3 md:py-4">
              <h3 className="text-sm md:text-base font-semibold text-[#2C2C2C] flex items-center gap-2">
                <FiTruck className="text-[#D4A574]" /> Shipping Address
              </h3>
            </div>
            <div className="p-4 md:p-6">
              <div className="space-y-1 text-sm text-gray-600">
                <p className="font-semibold text-[#2C2C2C] text-sm md:text-base">{finalOrderData.shippingAddress?.name}</p>
                <p className="text-xs md:text-sm">{finalOrderData.shippingAddress?.address}</p>
                <p className="text-xs md:text-sm">{finalOrderData.shippingAddress?.city}, {finalOrderData.shippingAddress?.postalCode}</p>
                <p className="text-xs md:text-sm">{finalOrderData.shippingAddress?.country}</p>
                <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-[#E8E5E0]">
                  <div className="flex items-center gap-1 text-xs md:text-sm">
                    <FiPhone size={12} className="md:w-3.5 md:h-3.5 text-gray-400" />
                    <span>{finalOrderData.shippingAddress?.phone}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs md:text-sm">
                    <FiMail size={12} className="md:w-3.5 md:h-3.5 text-gray-400" />
                    <span>{finalOrderData.shippingAddress?.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Billing Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="border-b border-[#E8E5E0] px-4 md:px-6 py-3 md:py-4">
              <h3 className="text-sm md:text-base font-semibold text-[#2C2C2C] flex items-center gap-2">
                <FiUser className="text-[#D4A574]" /> Billing Address
              </h3>
            </div>
            <div className="p-4 md:p-6">
              <div className="space-y-1 text-sm text-gray-600">
                <p className="font-semibold text-[#2C2C2C] text-sm md:text-base">{finalOrderData.billingAddress?.name}</p>
                <p className="text-xs md:text-sm">{finalOrderData.billingAddress?.address}</p>
                <p className="text-xs md:text-sm">{finalOrderData.billingAddress?.city}, {finalOrderData.billingAddress?.postalCode}</p>
                <p className="text-xs md:text-sm">{finalOrderData.billingAddress?.country}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Second Row: Payment Method + Shipping Method */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="border-b border-[#E8E5E0] px-4 md:px-6 py-3 md:py-4">
              <h3 className="text-sm md:text-base font-semibold text-[#2C2C2C] flex items-center gap-2">
                <FiCreditCard className="text-[#D4A574]" /> Payment Method
              </h3>
            </div>
            <div className="p-4 md:p-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#D4A574]/20 rounded-full flex items-center justify-center text-xl md:text-2xl">
                  {finalOrderData.paymentMethod === 'Cash on Delivery' ? '💰' : 
                   finalOrderData.paymentMethod === 'Bank Transfer' ? '🏦' : '💳'}
                </div>
                <div>
                  <p className="font-semibold text-sm md:text-base text-[#2C2C2C]">{finalOrderData.paymentMethod}</p>
                  <p className="text-[10px] md:text-xs text-gray-500">
                    {finalOrderData.paymentMethod === 'Cash on Delivery' ? 'Pay when you receive your order' :
                     finalOrderData.paymentMethod === 'Bank Transfer' ? 'Awaiting payment confirmation' :
                     'Online payment confirmed'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Shipping Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="border-b border-[#E8E5E0] px-4 md:px-6 py-3 md:py-4">
              <h3 className="text-sm md:text-base font-semibold text-[#2C2C2C] flex items-center gap-2">
                <FiTruck className="text-[#D4A574]" /> Shipping Method
              </h3>
            </div>
            <div className="p-4 md:p-6">
              <p className="font-medium text-sm md:text-base text-[#2C2C2C]">Standard Shipping</p>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Delivery within 3-5 business days</p>
              <div className="flex items-center gap-2 mt-3 text-[10px] md:text-xs text-gray-400">
                <FiClock size={10} className="md:w-3 md:h-3" />
                <span>Estimated delivery: 3-5 business days</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Order Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="border-b border-[#E8E5E0] px-4 md:px-6 py-3 md:py-4 bg-gray-50/50">
            <h3 className="text-base md:text-lg font-semibold text-[#2C2C2C] text-center">Order Timeline</h3>
          </div>
          <div className="p-4 md:p-8">
            <div className="relative">
              <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 rounded-full md:top-5" />
              <div 
                className="absolute top-4 left-0 h-0.5 bg-[#D4A574] rounded-full transition-all duration-500 md:top-5"
                style={{ width: '50%' }}
              />
              <div className="relative grid grid-cols-5 gap-1 md:gap-2 z-10">
                {[
                  { status: 'Placed', active: true, icon: FiCheckCircle, completed: true },
                  { status: 'Confirmed', active: true, icon: FiPackage, completed: true },
                  { status: 'Shipped', active: false, icon: FiTruck, completed: false },
                  { status: 'Out for Delivery', active: false, icon: FiMapPin, completed: false },
                  { status: 'Delivered', active: false, icon: FiHome, completed: false }
                ].map((step, idx) => (
                  <div key={idx} className="text-center">
                    <div className={`w-7 h-7 md:w-10 md:h-10 mx-auto rounded-full flex items-center justify-center mb-1 md:mb-2 transition-all ${
                      step.completed ? 'bg-[#D4A574] text-white shadow-md' : 
                      step.active ? 'bg-[#D4A574] text-white shadow-md' : 'bg-gray-200 text-gray-400'
                    }`}>
                      <step.icon size={12} className="md:w-4 md:h-4" />
                    </div>
                    <p className="text-[8px] md:text-xs font-medium text-[#2C2C2C]">{step.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Need Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-6 md:mt-8 text-center"
        >
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl p-4 md:p-8">
            <p className="text-sm md:text-base text-gray-600">
              Need help with your order?{' '}
              <Link to="/contact" className="text-[#D4A574] font-semibold hover:underline ml-1">
                Contact Customer Support
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default OrderSuccess
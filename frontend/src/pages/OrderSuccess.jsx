import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiCheckCircle, FiPackage, FiMapPin, FiCreditCard, 
  FiTruck, FiCalendar, FiPrinter, FiDownload, FiShare2,
  FiHome, FiShoppingBag, FiUser, FiMail, FiPhone, FiClock, FiBox
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
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FiPackage className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-light text-gray-800 mb-2">No Order Found</h2>
          <p className="text-gray-500 mb-6">Something went wrong. Please try again.</p>
          <Link to="/shop">
            <button className="bg-gray-900 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition shadow-md">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const printOrder = () => {
    window.print()
  }

  const saveAsPDF = () => {
    alert('PDF download feature coming soon!')
  }

  const shareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Order Confirmation - LUXE HOME',
        text: `Order #${finalOrderData.orderId} confirmed! Total: $${finalOrderData.total}`,
        url: window.location.href
      })
    } else {
      alert('Share feature not supported on this browser')
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Success Header - Modern Design */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-full mb-5 shadow-lg">
            <FiCheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-3">Thank You for Your Order!</h1>
          <p className="text-gray-500 text-lg">Your order has been placed successfully. We'll notify you when it ships.</p>
        </motion.div>

        {/* Order ID Card - Modern Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-white/50"
        >
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiBox className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Order ID</p>
                <p className="text-xl font-semibold text-gray-800 font-mono">{finalOrderData.orderId}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Order Date</p>
                <p className="text-gray-800">{finalOrderData.date} at {finalOrderData.time}</p>
              </div>
            </div>
            <div>
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                finalOrderData.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 
                finalOrderData.paymentStatus === 'Awaiting Confirmation' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  finalOrderData.paymentStatus === 'Paid' ? 'bg-green-500' : 
                  finalOrderData.paymentStatus === 'Awaiting Confirmation' ? 'bg-blue-500' :
                  'bg-yellow-500'
                }`} />
                {finalOrderData.paymentStatus}
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={printOrder} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition" title="Print Order">
                <FiPrinter size={18} className="text-gray-600" />
              </button>
              <button onClick={saveAsPDF} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition" title="Save as PDF">
                <FiDownload size={18} className="text-gray-600" />
              </button>
              <button onClick={shareOrder} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition" title="Share Order">
                <FiShare2 size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="border-b border-gray-100 px-6 py-4 bg-gray-50/50">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FiPackage className="text-warm" /> Order Summary
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {finalOrderData.items?.map((item, idx) => (
                    <div key={idx} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-20 h-20 object-cover rounded-xl shadow-sm"
                        onError={(e) => e.target.src = 'https://placehold.co/80x80/f5f0e8/8b7355?text=Product'}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-xs text-gray-400">${item.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="text-gray-800 font-medium">${finalOrderData.subtotal?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span className="text-gray-800 font-medium">${finalOrderData.shippingCharge?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tax</span>
                      <span className="text-gray-800 font-medium">${finalOrderData.tax?.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span className="text-gray-800">Total</span>
                        <span className="text-gray-900">${finalOrderData.total?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Link to="/shop" className="flex-1">
                <button className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition shadow-md flex items-center justify-center gap-2">
                  <FiShoppingBag size={18} /> Continue Shopping
                </button>
              </Link>
              <Link to="/" className="flex-1">
                <button className="w-full border-2 border-gray-300 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <FiHome size={18} /> Back to Home
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column - Shipping & Payment Info */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-teal-50 to-white">
                <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                  <FiTruck className="text-teal-600" /> Shipping Address
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="font-semibold text-gray-800 text-base">{finalOrderData.shippingAddress?.name}</p>
                  <p>{finalOrderData.shippingAddress?.address}</p>
                  <p>{finalOrderData.shippingAddress?.city}, {finalOrderData.shippingAddress?.postalCode}</p>
                  <p>{finalOrderData.shippingAddress?.country}</p>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-sm">
                      <FiPhone size={14} className="text-gray-400" />
                      <span>{finalOrderData.shippingAddress?.phone}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <FiMail size={14} className="text-gray-400" />
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
              <div className="border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-blue-50 to-white">
                <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                  <FiUser className="text-blue-600" /> Billing Address
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="font-semibold text-gray-800">{finalOrderData.billingAddress?.name}</p>
                  <p>{finalOrderData.billingAddress?.address}</p>
                  <p>{finalOrderData.billingAddress?.city}, {finalOrderData.billingAddress?.postalCode}</p>
                  <p>{finalOrderData.billingAddress?.country}</p>
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-green-50 to-white">
                <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                  <FiCreditCard className="text-green-600" /> Payment Method
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-warm/20 rounded-full flex items-center justify-center text-2xl">
                    {finalOrderData.paymentMethod === 'Cash on Delivery' ? '💰' : 
                     finalOrderData.paymentMethod === 'Bank Transfer' ? '🏦' : '💳'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{finalOrderData.paymentMethod}</p>
                    <p className="text-xs text-gray-500">
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
              <div className="border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-orange-50 to-white">
                <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                  <FiTruck className="text-orange-600" /> Shipping Method
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-800 font-medium">Standard Shipping</p>
                <p className="text-sm text-gray-500 mt-1">Delivery within 3-5 business days</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                  <FiCalendar size={12} />
                  <span>Estimated delivery: 3-5 business days</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Order Timeline - Modern Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="border-b border-gray-100 px-6 py-4 bg-gray-50/50">
            <h3 className="text-lg font-semibold text-gray-800 text-center">Order Timeline</h3>
          </div>
          <div className="p-8">
            <div className="flex flex-wrap justify-between items-center">
              {[
                { status: 'Order Placed', date: finalOrderData.date, time: finalOrderData.time, active: true, icon: FiCheckCircle },
                { status: 'Order Confirmed', date: 'Processing', time: '', active: true, icon: FiPackage },
                { status: 'Shipped', date: 'Pending', time: '', active: false, icon: FiTruck },
                { status: 'Out for Delivery', date: 'Pending', time: '', active: false, icon: FiMapPin },
                { status: 'Delivered', date: 'Pending', time: '', active: false, icon: FiHome }
              ].map((step, idx) => (
                <div key={idx} className="text-center flex-1 relative">
                  <div className={`relative z-10 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 transition-all ${
                    step.active ? 'bg-warm text-white shadow-lg scale-110' : 'bg-gray-200 text-gray-400'
                  }`}>
                    <step.icon size={20} />
                  </div>
                  {idx < 4 && (
                    <div className={`absolute top-5 left-1/2 w-full h-0.5 -z-0 ${
                      step.active && idx < 3 ? 'bg-warm' : 'bg-gray-200'
                    }`} style={{ right: '-50%' }} />
                  )}
                  <p className="text-sm font-medium text-gray-800">{step.status}</p>
                  {step.date && step.active && <p className="text-xs text-gray-500 mt-1">{step.date}</p>}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Need Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-8 text-center"
        >
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl p-8">
            <p className="text-gray-600">
              Need help with your order?{' '}
              <Link to="/contact" className="text-warm font-semibold hover:underline ml-1">
                Contact Customer Support
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .container, .container * { visibility: visible; }
          .container { position: absolute; top: 0; left: 0; right: 0; }
          button, .no-print { display: none !important; }
        }
      `}</style>
    </div>
  )
}

export default OrderSuccess
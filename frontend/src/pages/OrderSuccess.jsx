import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiCheckCircle, FiPackage, FiMapPin, FiCreditCard, 
  FiTruck, FiCalendar, FiPrinter, FiDownload, FiShare2,
  FiHome, FiShoppingBag, FiUser, FiMail, FiPhone
} from 'react-icons/fi'

const OrderSuccess = () => {
  const location = useLocation()
  const orderData = location.state

  // If no order data, redirect to shop
  if (!orderData || !orderData.orderId) {
    return (
      <div className="bg-cream min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiPackage className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-light text-charcoal mb-2">No Order Found</h2>
          <p className="text-gray-500 mb-6">Something went wrong. Please try again.</p>
          <Link to="/shop">
            <button className="bg-charcoal text-white px-6 py-2 rounded-full text-sm font-medium">
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
        text: `Order #${orderData.orderId} confirmed! Total: $${orderData.total}`,
        url: window.location.href
      })
    } else {
      alert('Share feature not supported on this browser')
    }
  }

  return (
    <div className="bg-cream min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <FiCheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-light text-charcoal mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-500">Thank you for your purchase. We'll notify you when your order ships.</p>
        </motion.div>

        {/* Order ID and Date Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm p-6 mb-6"
        >
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="text-xl font-semibold text-charcoal">{orderData.orderId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="text-gray-800">{orderData.date} at {orderData.time}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                orderData.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 
                orderData.paymentStatus === 'Awaiting Confirmation' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {orderData.paymentStatus}
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={printOrder} className="p-2 text-gray-500 hover:text-warm transition" title="Print Order">
                <FiPrinter size={18} />
              </button>
              <button onClick={saveAsPDF} className="p-2 text-gray-500 hover:text-warm transition" title="Save as PDF">
                <FiDownload size={18} />
              </button>
              <button onClick={shareOrder} className="p-2 text-gray-500 hover:text-warm transition" title="Share Order">
                <FiShare2 size={18} />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Order Items */}
          <div className="md:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <h3 className="text-lg font-medium text-charcoal mb-4 flex items-center gap-2">
                <FiPackage className="text-warm" /> Order Summary
              </h3>
              <div className="space-y-3">
                {orderData.items?.map((item, idx) => (
                  <div key={idx} className="flex gap-4 pb-3 border-b border-gray-100">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-xs text-gray-500">${item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">${orderData.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-800">${orderData.shippingCharge?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-800">${orderData.tax?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span className="text-charcoal">Total</span>
                  <span className="text-charcoal">${orderData.total?.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>

            {/* Buy Again Button */}
            <div className="flex gap-4">
              <Link to="/shop" className="flex-1">
                <button className="w-full bg-charcoal text-white py-3 rounded-xl font-medium hover:bg-charcoal-light transition flex items-center justify-center gap-2">
                  <FiShoppingBag size={18} /> Buy Again
                </button>
              </Link>
              <Link to="/" className="flex-1">
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
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
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <h3 className="text-md font-medium text-charcoal mb-3 flex items-center gap-2">
                <FiTruck className="text-warm" /> Shipping Address
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="font-medium text-gray-800">{orderData.shippingAddress?.name}</p>
                <p>{orderData.shippingAddress?.address}</p>
                <p>{orderData.shippingAddress?.city}, {orderData.shippingAddress?.postalCode}</p>
                <p>{orderData.shippingAddress?.country}</p>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                  <FiPhone size={14} className="text-gray-400" />
                  <span>{orderData.shippingAddress?.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMail size={14} className="text-gray-400" />
                  <span>{orderData.shippingAddress?.email}</span>
                </div>
              </div>
            </motion.div>

            {/* Billing Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <h3 className="text-md font-medium text-charcoal mb-3 flex items-center gap-2">
                <FiUser className="text-warm" /> Billing Address
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="font-medium text-gray-800">{orderData.billingAddress?.name}</p>
                <p>{orderData.billingAddress?.address}</p>
                <p>{orderData.billingAddress?.city}, {orderData.billingAddress?.postalCode}</p>
                <p>{orderData.billingAddress?.country}</p>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <h3 className="text-md font-medium text-charcoal mb-3 flex items-center gap-2">
                <FiCreditCard className="text-warm" /> Payment Method
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-warm/20 rounded-full flex items-center justify-center">
                    {orderData.paymentMethod === 'Cash on Delivery' ? '💰' : 
                     orderData.paymentMethod === 'Bank Transfer' ? '🏦' : '💳'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{orderData.paymentMethod}</p>
                    <p className="text-xs text-gray-500">
                      {orderData.paymentMethod === 'Cash on Delivery' ? 'Pay when you receive your order' :
                       orderData.paymentMethod === 'Bank Transfer' ? 'Awaiting payment confirmation' :
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
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <h3 className="text-md font-medium text-charcoal mb-3 flex items-center gap-2">
                <FiTruck className="text-warm" /> Shipping Method
              </h3>
              <p className="text-sm text-gray-600">Standard Shipping (3-5 business days)</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <FiCalendar size={12} />
                <span>Estimated delivery: 3-5 business days</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Order Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white rounded-2xl shadow-sm p-6"
        >
          <h3 className="text-lg font-medium text-charcoal mb-6 text-center">Order Timeline</h3>
          <div className="flex flex-wrap justify-between items-center">
            {[
              { status: 'Order Placed', date: orderData.date, time: orderData.time, active: true },
              { status: 'Order Confirmed', date: 'Processing', time: '', active: true },
              { status: 'Shipped', date: 'Pending', time: '', active: false },
              { status: 'Out for Delivery', date: 'Pending', time: '', active: false },
              { status: 'Delivered', date: 'Pending', time: '', active: false }
            ].map((step, idx) => (
              <div key={idx} className="text-center flex-1">
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  step.active ? 'bg-warm text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {step.active ? '✓' : idx + 1}
                </div>
                <p className="text-sm font-medium text-gray-800">{step.status}</p>
                {step.date && <p className="text-xs text-gray-500">{step.date}</p>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Need Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-500 text-sm">
            Need help with your order? <Link to="/contact" className="text-warm hover:underline">Contact Customer Support</Link>
          </p>
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
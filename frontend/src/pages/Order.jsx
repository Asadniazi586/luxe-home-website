import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiTruck, FiPackage, FiMapPin, FiCalendar, FiArrowLeft } from 'react-icons/fi'
import { orderService } from '../services/orderService'

const Order = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const data = await orderService.getOrderById(id)
        setOrder(data)
      } catch (err) {
        console.error('Error fetching order:', err)
        setError('Order not found')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  const getStatusBadge = (status) => {
    const styles = {
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Processing': 'bg-blue-100 text-blue-700',
      'Shipped': 'bg-purple-100 text-purple-700',
      'Delivered': 'bg-green-100 text-green-700',
      'Cancelled': 'bg-red-100 text-red-700'
    }
    return styles[status] || 'bg-gray-100 text-gray-700'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <FiCheckCircle className="w-12 h-12 text-green-500" />
      case 'Shipped': return <FiTruck className="w-12 h-12 text-blue-500" />
      case 'Processing': return <FiPackage className="w-12 h-12 text-yellow-500" />
      default: return <FiPackage className="w-12 h-12 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="bg-cream min-h-screen pt-32 flex items-center justify-center">
        <div className="w-12 h-12 border-3 border-warm border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="bg-cream min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light text-charcoal mb-2">Order Not Found</h2>
          <p className="text-gray-500 mb-6">We couldn't find the order you're looking for.</p>
          <Link to="/dashboard">
            <button className="bg-charcoal text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-charcoal-light transition">
              Go to Dashboard
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-cream min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-warm transition mb-4">
            <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-charcoal">Order Details</h1>
          <p className="text-gray-500 text-sm mt-1">Order #{order._id?.slice(-8).toUpperCase()}</p>
        </div>

        <div className="space-y-6">
          {/* Order Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 text-center"
          >
            <div className="mb-3">{getStatusIcon(order.status)}</div>
            <h2 className="text-xl font-medium text-charcoal mb-2">
              Order {order.status === 'Delivered' ? 'Delivered!' : order.status === 'Shipped' ? 'On Its Way!' : 'Confirmed!'}
            </h2>
            <p className="text-gray-500 text-sm">
              {order.status === 'Delivered' 
                ? `Delivered on ${new Date(order.deliveredAt || order.updatedAt).toLocaleDateString()}`
                : order.status === 'Shipped'
                ? `Estimated delivery: ${new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}`
                : 'Your order has been confirmed and is being processed'}
            </p>
            <div className="mt-4 inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}">
              {order.status}
            </div>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-medium text-charcoal mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-charcoal">{item.name}</h4>
                    {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                    {item.color && <p className="text-xs text-gray-500">Color: {item.color}</p>}
                    <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-charcoal">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-xs text-gray-500">${item.price} each</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-medium text-charcoal mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800">${order.itemsPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-800">${order.shippingPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-800">${order.taxPrice?.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span className="text-charcoal">Total</span>
                  <span className="text-charcoal text-lg">${order.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Shipping Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-medium text-charcoal mb-4 flex items-center gap-2">
              <FiMapPin className="w-5 h-5 text-warm" /> Shipping Information
            </h3>
            <div className="space-y-1 text-gray-600">
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
              <p>{order.shippingAddress?.country}</p>
            </div>
            <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm text-gray-500">
              <FiCalendar className="w-4 h-4" />
              <span>Order placed on {new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link to="/shop">
              <button className="bg-charcoal text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-charcoal-light transition">
                Continue Shopping
              </button>
            </Link>
            {order.status !== 'Delivered' && (
              <button className="border border-gray-300 text-gray-600 px-6 py-2 rounded-full text-sm font-medium hover:border-warm hover:text-warm transition">
                Track Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Order
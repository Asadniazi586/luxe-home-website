// frontend/src/pages/admin/AdminOrders.jsx

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiPackage,
  FiEye,
  FiX,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiPackage as FiPackageIcon
} from 'react-icons/fi'
import { useAdmin } from '../../contexts/AdminContext'
import AdminLayout from '../components/AdminLayout'
import toast from 'react-hot-toast'

const AdminOrders = () => {
  const { getAllOrders, updateOrderStatus } = useAdmin()

  const [orders, setOrders] = useState([])
  const [fetchLoading, setFetchLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [updatingStatusId, setUpdatingStatusId] = useState(null)

  const fetchOrders = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setFetchLoading(true)
    }

    try {
      const data = await getAllOrders()
      setOrders(data)
    } catch (error) {
      toast.error('Failed to fetch orders')
    } finally {
      if (showLoading) {
        setFetchLoading(false)
      }
    }
  }, [getAllOrders])

  useEffect(() => {
    fetchOrders(true)
  }, [fetchOrders])

  // Auto refresh
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders(false)
    }, 30000)

    return () => clearInterval(interval)
  }, [fetchOrders])

  // FIX BACKGROUND SCROLL
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
      document.documentElement.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
      document.documentElement.style.overflow = 'auto'
    }
  }, [showModal])

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingStatusId(id)

    setOrders(prev =>
      prev.map(order =>
        order._id === id
          ? { ...order, status: newStatus }
          : order
      )
    )

    if (selectedOrder && selectedOrder._id === id) {
      setSelectedOrder(prev => ({
        ...prev,
        status: newStatus
      }))
    }

    toast.success(`Order status updated to ${newStatus}`)

    try {
      await updateOrderStatus(id, newStatus)
      fetchOrders(false)
    } catch (error) {
      fetchOrders(false)
      toast.error(
        error.response?.data?.message || 'Failed to update status'
      )
    } finally {
      setUpdatingStatusId(null)
    }
  }

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-700',
      Processing: 'bg-blue-100 text-blue-700',
      Shipped: 'bg-purple-100 text-purple-700',
      Delivered: 'bg-green-100 text-green-700',
      Cancelled: 'bg-red-100 text-red-700'
    }

    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const getStatusOptions = () => {
    return [
      'Pending',
      'Processing',
      'Shipped',
      'Delivered',
      'Cancelled'
    ]
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-light text-gray-800">
          Orders
        </h1>

        <p className="text-gray-500 mt-1">
          Manage customer orders
        </p>
      </div>

      {fetchLoading && orders.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-3 border-warm border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <FiPackage className="w-16 h-16 mx-auto text-gray-300 mb-4" />

          <h3 className="text-lg font-medium text-gray-700">
            No orders yet
          </h3>

          <p className="text-gray-500 mt-1">
            Orders will appear here when customers make purchases
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID
                  </p>

                  <p className="font-medium text-gray-800">
                    #{order._id?.slice(-8).toUpperCase()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Date</p>

                  <p className="text-gray-800">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Customer
                  </p>

                  <p className="text-gray-800">
                    {order.user?.name || 'Guest'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Total
                  </p>

                  <p className="text-lg font-semibold text-gray-800">
                    ${order.totalPrice?.toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Status
                  </p>

                  <div className="flex items-center gap-2">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusUpdate(
                          order._id,
                          e.target.value
                        )
                      }
                      disabled={
                        updatingStatusId === order._id
                      }
                      className={`mt-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} border-0 focus:ring-2 focus:ring-warm cursor-pointer`}
                    >
                      {getStatusOptions().map(status => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      ))}
                    </select>

                    {updatingStatusId === order._id && (
                      <div className="w-4 h-4 border-2 border-warm border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleViewDetails(order)}
                  className="flex items-center gap-2 text-warm hover:text-warm/80 transition"
                >
                  <FiEye size={18} />
                  View Details
                </button>
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Items: {order.orderItems?.length}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Last updated:{' '}
                  {new Date(
                    order.updatedAt
                  ).toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {showModal && selectedOrder && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/60 z-[999]"
            />

            {/* Modal Wrapper */}
            <div className="fixed inset-0 z-[1000] flex justify-center items-start overflow-y-auto px-4 pt-24 pb-6">
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.95,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  y: 20
                }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[75vh] overflow-hidden"
              >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
                  <h2 className="text-xl font-light text-charcoal">
                    Order Details
                  </h2>

                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                {/* SCROLLABLE CONTENT */}
                <div className="overflow-y-auto max-h-[calc(75vh-140px)] px-6 py-4">
                  <div className="space-y-6">

                    {/* Order Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b">
                      <div>
                        <p className="text-xs text-gray-500">
                          Order ID
                        </p>

                        <p className="font-medium text-gray-800">
                          #{selectedOrder._id?.slice(-8).toUpperCase()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Date
                        </p>

                        <p className="text-gray-800">
                          {new Date(
                            selectedOrder.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Status
                        </p>

                        <select
                          value={selectedOrder.status}
                          onChange={(e) => {
                            const newStatus =
                              e.target.value

                            handleStatusUpdate(
                              selectedOrder._id,
                              newStatus
                            )

                            setSelectedOrder(prev => ({
                              ...prev,
                              status: newStatus
                            }))
                          }}
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)} border-0 focus:ring-2 focus:ring-warm cursor-pointer`}
                        >
                          {getStatusOptions().map(
                            status => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Payment
                        </p>

                        <p className="text-gray-800">
                          {selectedOrder.paymentMethod ||
                            'Card'}
                        </p>
                      </div>
                    </div>

                    {/* Customer */}
                    <div>
                      <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                        <FiUser
                          size={16}
                          className="text-warm"
                        />
                        Customer Information
                      </h3>

                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <p className="text-sm">
                          <span className="text-gray-500">
                            Name:
                          </span>{' '}
                          {selectedOrder.user?.name ||
                            'Guest'}
                        </p>

                        <p className="text-sm">
                          <span className="text-gray-500">
                            Email:
                          </span>{' '}
                          {selectedOrder.user?.email ||
                            'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Shipping */}
                    <div>
                      <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                        <FiMapPin
                          size={16}
                          className="text-warm"
                        />
                        Shipping Address
                      </h3>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm">
                          {
                            selectedOrder.shippingAddress
                              ?.address
                          }
                        </p>

                        <p className="text-sm">
                          {
                            selectedOrder.shippingAddress
                              ?.city
                          }
                          ,{' '}
                          {
                            selectedOrder.shippingAddress
                              ?.postalCode
                          }
                        </p>

                        <p className="text-sm">
                          {
                            selectedOrder.shippingAddress
                              ?.country
                          }
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                        <FiPackageIcon
                          size={16}
                          className="text-warm"
                        />
                        Order Items
                      </h3>

                      <div className="space-y-3">
                        {selectedOrder.orderItems?.map(
                          (item, idx) => (
                            <div
                              key={idx}
                              className="flex gap-4 pb-3 border-b border-gray-100 last:border-0"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />

                              <div className="flex-1">
                                <h4 className="font-medium text-gray-800">
                                  {item.name}
                                </h4>

                                {item.size && (
                                  <p className="text-xs text-gray-500">
                                    Size: {item.size}
                                  </p>
                                )}

                                {item.color && (
                                  <p className="text-xs text-gray-500">
                                    Color: {item.color}
                                  </p>
                                )}

                                <p className="text-sm text-gray-600 mt-1">
                                  Quantity:{' '}
                                  {item.quantity}
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="font-medium text-gray-800">
                                  $
                                  {(
                                    item.price *
                                    item.quantity
                                  ).toFixed(2)}
                                </p>

                                <p className="text-xs text-gray-500">
                                  ${item.price} each
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-warm/10 rounded-lg p-4">
                      <h3 className="text-md font-medium text-gray-800 mb-3">
                        Order Summary
                      </h3>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Subtotal
                          </span>

                          <span className="text-gray-800">
                            $
                            {selectedOrder.itemsPrice?.toFixed(
                              2
                            )}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Shipping
                          </span>

                          <span className="text-gray-800">
                            $
                            {selectedOrder.shippingPrice?.toFixed(
                              2
                            )}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Tax
                          </span>

                          <span className="text-gray-800">
                            $
                            {selectedOrder.taxPrice?.toFixed(
                              2
                            )}
                          </span>
                        </div>

                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-medium">
                            <span className="text-gray-800">
                              Total
                            </span>

                            <span className="text-gray-800 text-lg">
                              $
                              {selectedOrder.totalPrice?.toFixed(
                                2
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                      <div className="flex items-center gap-1">
                        <FiCalendar size={12} />

                        <span>
                          Ordered:{' '}
                          {new Date(
                            selectedOrder.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>

                      {selectedOrder.deliveredAt && (
                        <div className="flex items-center gap-1">
                          <FiCalendar size={12} />

                          <span>
                            Delivered:{' '}
                            {new Date(
                              selectedOrder.deliveredAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}

export default AdminOrders
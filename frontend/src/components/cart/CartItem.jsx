import React from 'react'
import { motion } from 'framer-motion'
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi'

const CartItem = ({ item, updateQuantity, removeItem }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex gap-4 p-4 bg-white rounded-lg shadow-sm"
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="font-medium text-charcoal">{item.name}</h3>
        <p className="text-gray-500 text-sm">${item.price}</p>
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="p-1 rounded-full hover:bg-gray-100 transition"
          >
            <FiMinus className="w-4 h-4" />
          </button>
          <span className="text-sm w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="p-1 rounded-full hover:bg-gray-100 transition"
          >
            <FiPlus className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-charcoal">${(item.price * item.quantity).toFixed(2)}</p>
        <button
          onClick={() => removeItem(item.id)}
          className="text-gray-400 hover:text-red-500 text-sm mt-2 transition"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

export default CartItem
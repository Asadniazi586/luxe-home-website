import React from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi'
import { useCart } from '../contexts/CartContext'

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="bg-cream min-h-screen pt-32 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <FiShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-light text-charcoal mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any items yet</p>
          <Link to="/shop">
            <button className="bg-charcoal text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-charcoal-light transition">
              Continue Shopping
            </button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-cream min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-light tracking-wide text-charcoal mb-8">Shopping Cart</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.cartItemId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex gap-4 p-4 bg-white rounded-lg shadow-sm"
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-charcoal">{item.name}</h3>
                    {/* Display size if selected */}
                    {item.selectedSize && (
                      <p className="text-xs text-gray-400 mt-0.5">Size: {item.selectedSize}</p>
                    )}
                    {/* Display color if selected */}
                    {item.selectedColor && (
                      <p className="text-xs text-gray-400">Color: {item.selectedColor}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-1">${item.price}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button 
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-100 transition"
                      >
                        <FiMinus className="w-4 h-4" />
                      </button>
                      <span className="text-sm w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100 transition"
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-charcoal">${(item.price * item.quantity).toFixed(2)}</p>
                    <button 
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-gray-400 hover:text-red-500 text-sm mt-2 transition"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-24"
          >
            <h3 className="text-lg font-medium text-charcoal mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-medium text-charcoal">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Link to="/checkout">
              <button className="w-full bg-charcoal text-white py-3 rounded-full text-sm font-medium hover:bg-charcoal-light transition">
                Proceed to Checkout
              </button>
            </Link>
            <div className="flex justify-between mt-4">
              <Link to="/shop" className="text-gray-500 text-sm hover:text-charcoal transition flex items-center gap-1">
                <FiArrowLeft className="w-4 h-4" /> Continue Shopping
              </Link>
              <button onClick={clearCart} className="text-gray-500 text-sm hover:text-red-500 transition">
                Clear Cart
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Cart
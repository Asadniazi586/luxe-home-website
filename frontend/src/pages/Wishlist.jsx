import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart, FiTrash2, FiShoppingCart } from 'react-icons/fi'
import { useWishlist } from '../contexts/WishlistContext'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Wishlist = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { wishlistItems, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  // Redirect admin to shop
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/shop')
    }
  }, [user, navigate])

  const handleAddToCart = (product) => {
    addToCart(product)
    toast.success(`Added ${product.name} to cart`)
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="bg-cream min-h-screen pt-32 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <FiHeart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-light text-charcoal mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save your favorite items here</p>
          <Link to="/shop">
            <button className="bg-charcoal text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-charcoal-light transition">
              Start Shopping
            </button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-cream min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-light tracking-wide text-charcoal mb-8">My Wishlist</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden group"
            >
              <Link to={`/product/${item.id}`}>
                <div className="relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/product/${item.id}`}>
                  <h3 className="font-medium text-charcoal mb-1 hover:text-warm transition">{item.name}</h3>
                </Link>
                <p className="text-gray-800 font-medium mb-3">${item.price}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-charcoal text-white py-2 rounded-full text-sm font-medium hover:bg-charcoal-light transition flex items-center justify-center gap-2"
                  >
                    <FiShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-red-500 hover:text-red-500 transition"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Wishlist
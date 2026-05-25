import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiStar, FiHeart } from 'react-icons/fi'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  // Get the correct product ID (from either _id or id)
  const productId = product._id || product.id

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInWishlist(productId)) {
      removeFromWishlist(productId)
    } else {
      addToWishlist(product)
    }
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
  }

  if (viewMode === 'list') {
    return (
      <div className="flex gap-6 bg-white rounded-xl p-4 shadow-sm">
        <Link to={`/product/${productId}`} className="w-32 h-32 flex-shrink-0">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
          />
        </Link>
        <div className="flex-1">
          <Link to={`/product/${productId}`}>
            <h3 className="font-medium text-gray-800 hover:text-warm transition">{product.name}</h3>
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-xs text-gray-500">{product.rating}</span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-medium text-gray-800">${product.price}</span>
            <button 
              onClick={handleAddToCart}
              className="bg-gray-800 text-white px-4 py-1.5 rounded-full text-xs font-medium hover:bg-gray-700 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group">
      <Link to={`/product/${productId}`}>
        <div className="relative overflow-hidden rounded-xl mb-3 bg-gray-100">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {product.badge && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs px-2 py-1 rounded">
              {product.badge}
            </span>
          )}
          <button 
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Add to wishlist"
          >
            <FiHeart className={`w-4 h-4 ${isInWishlist(productId) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>
        </div>
        <h3 className="text-sm font-medium text-gray-800 mb-1 hover:text-warm transition">{product.name}</h3>
        <div className="flex items-center gap-2 mb-1">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
            ))}
          </div>
          <span className="text-xs text-gray-500">{product.rating}</span>
        </div>
        <p className="text-gray-800 font-medium">${product.price}</p>
      </Link>
      <button
        onClick={handleAddToCart}
        className="w-full mt-3 bg-gray-800 text-white py-2 rounded-full text-xs font-medium hover:bg-gray-700 transition"
      >
        Add to Cart
      </button>
    </div>
  )
}

export default ProductCard
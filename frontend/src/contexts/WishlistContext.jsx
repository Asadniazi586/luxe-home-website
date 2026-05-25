import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const WishlistContext = createContext()

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('wishlist')
    if (saved) setWishlistItems(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const addToWishlist = (product) => {
    if (!wishlistItems.find(item => item.id === product.id)) {
      setWishlistItems([...wishlistItems, product])
      toast.success('Added to wishlist')
    } else {
      toast.error('Already in wishlist')
    }
  }

  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id))
    toast.success('Removed from wishlist')
  }

  const isInWishlist = (id) => wishlistItems.some(item => item.id === id)

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}
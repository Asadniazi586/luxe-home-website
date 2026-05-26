import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()

// Helper to generate unique cart item ID
const getCartItemId = (product) => {
  return product.cartItemId || `${product.id}_${product.selectedSize || ''}_${product.selectedColor || ''}_${Date.now()}`
}

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const cartItemId = action.payload.cartItemId || getCartItemId(action.payload)
      const existingItem = state.items.find(item => item.cartItemId === cartItemId)
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + (action.payload.quantity || 1)
        // Only show toast if not suppressed
        if (!action.payload.suppressToast) {
          toast.success(`Added ${action.payload.quantity || 1} more ${action.payload.name} to cart`, { id: 'cart-toast' })
        }
        return {
          ...state,
          items: state.items.map(item =>
            item.cartItemId === cartItemId
              ? { ...item, quantity: newQuantity }
              : item
          ),
        }
      }
      
      const quantity = action.payload.quantity || 1
      // Only show toast if not suppressed
      if (!action.payload.suppressToast) {
        toast.success(`${quantity} × ${action.payload.name} added to cart`, { id: 'cart-toast' })
      }
      
      return { 
        ...state, 
        items: [...state.items, { ...action.payload, quantity, cartItemId }] 
      }
    }
    
    case 'REMOVE_FROM_CART': {
      const item = state.items.find(item => item.cartItemId === action.payload)
      toast.success(`${item?.name || 'Item'} removed from cart`, { id: 'cart-toast' })
      return { ...state, items: state.items.filter(item => item.cartItemId !== action.payload) }
    }
    
    case 'UPDATE_QUANTITY': {
      return {
        ...state,
        items: state.items.map(item =>
          item.cartItemId === action.payload.cartItemId
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        ),
      }
    }
    
    case 'CLEAR_CART':
      toast.success('Cart cleared', { id: 'cart-toast' })
      return { ...state, items: [] }
    
    default:
      return state
  }
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, () => {
    const savedCart = localStorage.getItem('cart')
    return savedCart ? { items: JSON.parse(savedCart) } : { items: [] }
  })

  // Use ref to track if this is the initial load
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  const addToCart = (product, quantity = 1, selectedSize = '', selectedColor = '', suppressToast = false) => {
    // Create a unique ID for each cart item
    const uniqueId = `${product.id}_${selectedSize}_${selectedColor}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
    
    dispatch({ 
      type: 'ADD_TO_CART', 
      payload: { 
        ...product, 
        quantity,
        selectedSize,
        selectedColor,
        cartItemId: uniqueId,
        suppressToast
      } 
    })
  }
  
  const removeFromCart = (cartItemId) => dispatch({ type: 'REMOVE_FROM_CART', payload: cartItemId })
  
  const updateQuantity = (cartItemId, quantity) => dispatch({ 
    type: 'UPDATE_QUANTITY', 
    payload: { cartItemId, quantity } 
  })
  
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const value = {
    cartItems: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
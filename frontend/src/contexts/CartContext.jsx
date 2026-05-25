import React, { createContext, useContext, useReducer, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (existingItem) {
        const newQuantity = existingItem.quantity + (action.payload.quantity || 1)
        toast.success(`Added ${action.payload.quantity || 1} more ${action.payload.name} to cart`, {
          id: 'cart-toast',
          duration: 2000
        })
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: newQuantity }
              : item
          ),
        }
      }
      const quantity = action.payload.quantity || 1
      toast.success(`${quantity} × ${action.payload.name} added to cart`, {
        id: 'cart-toast',
        duration: 2000
      })
      return { ...state, items: [...state.items, { ...action.payload, quantity }] }
    }
    
    case 'REMOVE_FROM_CART': {
      const item = state.items.find(item => item.id === action.payload)
      toast.success(`${item?.name || 'Item'} removed from cart`, {
        id: 'cart-toast',
        duration: 1500
      })
      return { ...state, items: state.items.filter(item => item.id !== action.payload) }
    }
    
    case 'UPDATE_QUANTITY': {
      const item = state.items.find(item => item.id === action.payload.id)
      if (item && action.payload.quantity !== item.quantity) {
        toast.success(`${item.name} quantity updated to ${action.payload.quantity}`, {
          id: 'cart-toast',
          duration: 1500
        })
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        ),
      }
    }
    
    case 'CLEAR_CART':
      if (state.items.length > 0) {
        toast.success('Cart cleared', { id: 'cart-toast', duration: 1500 })
      }
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

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  const addToCart = (product, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity } })
  }
  
  const removeFromCart = (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: id })
  
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  
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
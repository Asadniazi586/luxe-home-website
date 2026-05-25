import React from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

const CartSummary = ({ totalPrice, itemCount, onClearCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-24">
      <h3 className="text-lg font-medium text-charcoal mb-4">Order Summary</h3>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({itemCount} items)</span>
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
        <button onClick={onClearCart} className="text-gray-500 text-sm hover:text-red-500 transition">
          Clear Cart
        </button>
      </div>
    </div>
  )
}

export default CartSummary
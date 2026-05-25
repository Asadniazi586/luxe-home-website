import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'

const ProductFormModal = ({ isOpen, onClose, onSubmit, product, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'bedding',
    description: '',
    image: '',
    sizes: [],
    colors: [],
    inStock: true,
    badge: '',
    rating: 4.5,
    reviews: 0,
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        category: product.category || 'bedding',
        description: product.description || '',
        image: product.image || '',
        sizes: product.sizes || [],
        colors: product.colors || [],
        inStock: product.inStock !== undefined ? product.inStock : true,
        badge: product.badge || '',
        rating: product.rating || 4.5,
        reviews: product.reviews || 0,
      })
    } else {
      setFormData({
        name: '',
        price: '',
        originalPrice: '',
        category: 'bedding',
        description: '',
        image: '',
        sizes: [],
        colors: [],
        inStock: true,
        badge: '',
        rating: 4.5,
        reviews: 0,
      })
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleArrayInput = (field, value) => {
    const items = value.split(',').map(item => item.trim())
    setFormData(prev => ({ ...prev, [field]: items }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const categories = ['bedding', 'bath', 'decor']
  const badges = ['', 'Best Seller', 'New', 'Eco-Friendly', 'Sale', 'Luxury']

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl z-50"
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-light text-charcoal">
                {product ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <FiX size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-warm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-warm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-warm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-warm"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
                  <select
                    name="badge"
                    value={formData.badge}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-warm"
                  >
                    {badges.map(badge => (
                      <option key={badge} value={badge}>{badge || 'None'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-warm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma separated)</label>
                  <input
                    type="text"
                    value={formData.sizes.join(', ')}
                    onChange={(e) => handleArrayInput('sizes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-warm"
                    placeholder="S, M, L, XL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Colors (comma separated)</label>
                  <input
                    type="text"
                    value={formData.colors.join(', ')}
                    onChange={(e) => handleArrayInput('colors', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-warm"
                    placeholder="Red, Blue, Green"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-warm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 focus:ring-warm"
                  />
                  <label className="text-sm text-gray-700">In Stock</label>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-charcoal text-white rounded-lg hover:bg-charcoal-light transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ProductFormModal
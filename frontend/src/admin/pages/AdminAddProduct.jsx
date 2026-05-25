import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSave, FiX, FiUpload, FiImage, FiTrash2, FiPlus, FiGrid } from 'react-icons/fi'
import { useAdmin } from '../../contexts/AdminContext'
import AdminLayout from '../components/AdminLayout'
import toast from 'react-hot-toast'

const AdminAddProduct = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { createProduct, updateProduct, loading } = useAdmin()
  const fileInputRef = useRef(null)
  const multipleImagesRef = useRef(null)
  
  const isEditing = location.state?.isEditing || false
  const editProduct = location.state?.product || null

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'bedding',
    description: '',
    image: '', // Keep for backward compatibility
    mainImage: '', // New field
    images: [], // Array for multiple images
    sizes: [],
    colors: [],
    inStock: true,
    badge: '',
    rating: 4.5,
    reviews: 0,
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [galleryImages, setGalleryImages] = useState([])
  const [imageType, setImageType] = useState('url')
  const [galleryImageType, setGalleryImageType] = useState('url')
  const [galleryUrlInput, setGalleryUrlInput] = useState('')
  const [showGalleryUrlInput, setShowGalleryUrlInput] = useState(false)

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Twin', 'Full', 'Queen', 'King', 'Standard']
  const colorOptions = ['White', 'Black', 'Gray', 'Navy', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Purple', 'Brown', 'Beige', 'Cream', 'Sand', 'Charcoal', 'Blush', 'Sage', 'Terracotta', 'Olive', 'Mustard']
  const categories = ['bedding', 'bath', 'decor']
  const badges = ['', 'Best Seller', 'New', 'Eco-Friendly', 'Sale', 'Luxury']

  useEffect(() => {
    if (editProduct && isEditing) {
      const existingImages = editProduct.images || []
      const mainImg = editProduct.mainImage || editProduct.image || ''
      
      setFormData({
        name: editProduct.name || '',
        price: editProduct.price || '',
        originalPrice: editProduct.originalPrice || '',
        category: editProduct.category || 'bedding',
        description: editProduct.description || '',
        image: mainImg,
        mainImage: mainImg,
        images: existingImages,
        sizes: editProduct.sizes || [],
        colors: editProduct.colors || [],
        inStock: editProduct.inStock !== undefined ? editProduct.inStock : true,
        badge: editProduct.badge || '',
        rating: editProduct.rating || 4.5,
        reviews: editProduct.reviews || 0,
      })
      setImagePreview(mainImg)
      setGalleryImages(existingImages)
    }
  }, [editProduct, isEditing])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const toggleSize = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  const toggleColor = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }))
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target.result
        setImagePreview(imageData)
        setFormData(prev => ({ ...prev, image: imageData, mainImage: imageData }))
        toast.success('Image uploaded successfully!')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUrlChange = (e) => {
    const url = e.target.value
    setFormData(prev => ({ ...prev, image: url, mainImage: url }))
    setImagePreview(url)
  }

  const handleGalleryImageUpload = (event) => {
    const files = Array.from(event.target.files)
    const validFiles = files.filter(file => {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 2MB`)
        return false
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`)
        return false
      }
      return true
    })

    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target.result
        setGalleryImages(prev => [...prev, imageData])
        setFormData(prev => ({ ...prev, images: [...prev.images, imageData] }))
      }
      reader.readAsDataURL(file)
    })
    
    if (validFiles.length > 0) {
      toast.success(`${validFiles.length} image(s) added to gallery`)
    }
  }

  const addGalleryImageByUrl = () => {
    if (galleryUrlInput && galleryUrlInput.trim()) {
      setGalleryImages(prev => [...prev, galleryUrlInput])
      setFormData(prev => ({ ...prev, images: [...prev.images, galleryUrlInput] }))
      toast.success('Gallery image added!')
      setGalleryUrlInput('')
      setShowGalleryUrlInput(false)
    } else {
      toast.error('Please enter a valid image URL')
    }
  }

  const removeGalleryImage = (index) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index))
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
    toast.success('Image removed from gallery')
  }

  const removeImage = () => {
    setImagePreview(null)
    setFormData(prev => ({ ...prev, image: '', mainImage: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.image) {
      toast.error('Please add a product image')
      return
    }
    
    // Prepare data for backend - maintain compatibility
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : 0,
      category: formData.category,
      description: formData.description,
      image: formData.image, // Main image for backward compatibility
      mainImage: formData.mainImage,
      images: formData.images,
      sizes: formData.sizes,
      colors: formData.colors,
      inStock: formData.inStock,
      badge: formData.badge,
      rating: formData.rating,
      reviews: formData.reviews,
    }
    
    console.log('Submitting product data:', productData)
    
    try {
      if (isEditing && editProduct?._id) {
        await updateProduct(editProduct._id, productData)
        toast.success('Product updated successfully!')
      } else {
        await createProduct(productData)
        toast.success('Product added successfully!')
      }
      navigate('/admin/products')
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error(error.response?.data?.message || (isEditing ? 'Failed to update product' : 'Failed to add product'))
    }
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-light text-gray-800">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEditing ? 'Update product information' : 'Fill in the details to add a new product'}
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/products')}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          <FiX size={18} /> Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Column - Images Section */}
          <div className="space-y-6">
            
            {/* Main Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Product Image <span className="text-red-500">*</span>
              </label>
              
              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setImageType('url')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition ${
                    imageType === 'url' 
                      ? 'bg-warm text-white border-warm' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-warm'
                  }`}
                >
                  <FiImage size={16} /> Image URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageType('file')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition ${
                    imageType === 'file' 
                      ? 'bg-warm text-white border-warm' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-warm'
                  }`}
                >
                  <FiUpload size={16} /> Upload File
                </button>
              </div>

              {imagePreview && (
                <div className="relative mb-4">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              )}

              {imageType === 'url' && (
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleImageUrlChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                />
              )}

              {imageType === 'file' && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-warm transition">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <FiUpload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Click to upload main image</p>
                  <p className="text-xs text-gray-400">PNG, JPG, GIF up to 2MB</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                  >
                    Select Image
                  </button>
                </div>
              )}
            </div>

            {/* Gallery Images (Multiple) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gallery Images <span className="text-gray-400 text-xs">(Optional - will appear in product gallery)</span>
              </label>
              
              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setGalleryImageType('url')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition ${
                    galleryImageType === 'url' 
                      ? 'bg-warm text-white border-warm' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-warm'
                  }`}
                >
                  <FiImage size={16} /> Add by URL
                </button>
                <button
                  type="button"
                  onClick={() => setGalleryImageType('file')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition ${
                    galleryImageType === 'file' 
                      ? 'bg-warm text-white border-warm' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-warm'
                  }`}
                >
                  <FiUpload size={16} /> Upload Files
                </button>
              </div>

              {galleryImageType === 'url' && (
                <div className="mb-4">
                  {showGalleryUrlInput ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={galleryUrlInput}
                        onChange={(e) => setGalleryUrlInput(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                      />
                      <button
                        type="button"
                        onClick={addGalleryImageByUrl}
                        className="px-4 py-2 bg-warm text-white rounded-lg hover:bg-warm/80 transition"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowGalleryUrlInput(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowGalleryUrlInput(true)}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-warm hover:text-warm transition flex items-center justify-center gap-2"
                    >
                      <FiPlus size={18} /> Add Image URL
                    </button>
                  )}
                </div>
              )}

              {galleryImageType === 'file' && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-warm transition mb-4">
                  <input
                    type="file"
                    ref={multipleImagesRef}
                    onChange={handleGalleryImageUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <FiGrid className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Upload multiple gallery images</p>
                  <p className="text-xs text-gray-400">You can select multiple images at once</p>
                  <button
                    type="button"
                    onClick={() => multipleImagesRef.current.click()}
                    className="mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                  >
                    Select Images
                  </button>
                </div>
              )}

              {/* Gallery Images Preview */}
              {galleryImages.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Gallery Images ({galleryImages.length})</p>
                  <div className="grid grid-cols-3 gap-3">
                    {galleryImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img 
                          src={img} 
                          alt={`Gallery ${idx + 1}`} 
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm"
                >
                  {badges.map(badge => (
                    <option key={badge} value={badge}>{badge || 'None'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-warm resize-none"
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
        </div>

        {/* Sizes Section */}
        <div className="mt-6 pt-6 border-t">
          <label className="block text-sm font-medium text-gray-700 mb-3">Sizes</label>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map(size => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  formData.sizes.includes(size)
                    ? 'bg-warm text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Colors Section */}
        <div className="mt-6 pt-6 border-t">
          <label className="block text-sm font-medium text-gray-700 mb-3">Colors</label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => toggleColor(color)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  formData.colors.includes(color)
                    ? 'bg-warm text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Form Buttons */}
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-charcoal text-white rounded-lg hover:bg-charcoal-light transition disabled:opacity-50"
          >
            <FiSave size={18} /> {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Add Product')}
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}

export default AdminAddProduct
import React, { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGrid, FiList, FiFilter, FiX, FiStar, FiPackage, FiTag, FiRefreshCw, FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi'
import ProductCard from '../components/ui/ProductCard'
import { productService } from '../services/productService'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import ConfirmDeleteModal from '../components/ui/ConfirmDeleteModal'

const Shop = () => {
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const [filterOpen, setFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [sortBy, setSortBy] = useState('featured')
  const [selectedBadge, setSelectedBadge] = useState('all')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const productsSectionRef = useRef(null)

  const isAdmin = user?.role === 'admin'

  const categories = ['all', 'bedding', 'bath', 'decor']
  const badges = [
    { id: 'all', name: 'All Products', icon: FiPackage },
    { id: 'Best Seller', name: 'Best Sellers', icon: FiStar },
    { id: 'New', name: 'New Arrivals', icon: FiTag },
    { id: 'Eco-Friendly', name: 'Eco-Friendly', icon: FiRefreshCw },
    { id: 'Sale', name: 'On Sale', icon: FiTag },
  ]

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getProducts()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDeleteClick = (product, e) => {
    e.preventDefault()
    e.stopPropagation()
    setProductToDelete(product)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!productToDelete) return
    
    setIsDeleting(true)
    try {
      await productService.deleteProduct(productToDelete._id || productToDelete.id)
      toast.success('Product deleted successfully!')
      await fetchProducts()
      setDeleteModalOpen(false)
      setProductToDelete(null)
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCloseModal = () => {
    if (!isDeleting) {
      setDeleteModalOpen(false)
      setProductToDelete(null)
    }
  }

  const handleEditProduct = (product, e) => {
    e.preventDefault()
    e.stopPropagation()
    window.location.href = `/admin/add-product?edit=${product._id || product.id}`
  }

  const filteredProducts = products
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => selectedBadge === 'all' || p.badge === selectedBadge)
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0
    })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const handleCollectionClick = (badgeId) => {
    setSelectedBadge(badgeId)
    setFilterOpen(false)
    setTimeout(() => {
      if (productsSectionRef.current) {
        const offset = 100
        const elementPosition = productsSectionRef.current.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - offset
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
      }
    }, 100)
  }

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    setFilterOpen(false)
    setTimeout(() => {
      if (productsSectionRef.current) {
        const offset = 100
        const elementPosition = productsSectionRef.current.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - offset
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
      }
    }, 100)
  }

  if (loading) {
    return (
      <div className="bg-[#FAF9F7] min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#D4A574] border-t-[#2C2C2C] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-[#FAF9F7] min-h-screen">
      <div className="container mx-auto px-4 pt-12 pb-12">
        <div ref={productsSectionRef}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
            <div>
              <span className="text-[#D4A574] text-[11px] tracking-[0.3em] uppercase font-['Inter',_sans-serif] font-medium mb-2 block">
                Signature Collection
              </span>
              <h1 className="font-['Cormorant_Garamond',_Georgia,_serif] font-light text-4xl md:text-5xl text-[#2C2C2C] tracking-wide">
                Shop All
              </h1>
              <div className="w-12 h-px bg-[#D4A574] mt-3" />
              <p className="text-gray-400 text-sm mt-4 font-['Inter',_sans-serif]">
                {filteredProducts.length} products
              </p>
            </div>
            
            <div className="flex gap-3 flex-wrap">
              {isAdmin && (
                <Link to="/admin/add-product">
                  <button className="group bg-[#2C2C2C] text-white px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase hover:bg-[#D4A574] transition-all duration-300 flex items-center gap-2 font-['Inter',_sans-serif] font-medium rounded-full">
                    <FiPlus className="w-3.5 h-3.5" /> Add Product
                  </button>
                </Link>
              )}
              
              <button 
                onClick={() => setFilterOpen(!filterOpen)}
                className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-[#E8E5E0] rounded-full text-[11px] tracking-wide bg-white hover:border-[#D4A574] transition-colors font-['Inter',_sans-serif]"
              >
                <FiFilter className="w-3.5 h-3.5" /> Filters
              </button>
              
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="px-5 py-2.5 border border-[#E8E5E0] rounded-full text-[11px] tracking-wide bg-white focus:outline-none focus:border-[#D4A574] transition-colors font-['Inter',_sans-serif] cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name: A to Z</option>
              </select>
              
              <div className="hidden md:flex gap-2">
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={`p-2 rounded-full transition-all duration-300 ${viewMode === 'grid' ? 'bg-[#D4A574] text-white' : 'bg-white text-[#2C2C2C] border border-[#E8E5E0] hover:border-[#D4A574]'}`}
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')} 
                  className={`p-2 rounded-full transition-all duration-300 ${viewMode === 'list' ? 'bg-[#D4A574] text-white' : 'bg-white text-[#2C2C2C] border border-[#E8E5E0] hover:border-[#D4A574]'}`}
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {(filterOpen || window.innerWidth >= 768) && (
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="fixed inset-0 z-50 md:relative md:inset-auto md:z-auto bg-[#FAF9F7] md:bg-transparent p-6 md:p-0 w-80 md:w-64 overflow-y-auto shadow-xl md:shadow-none"
              >
                <div className="flex justify-between items-center mb-8 md:hidden">
                  <h3 className="font-['Cormorant_Garamond',_Georgia,_serif] text-xl text-[#2C2C2C]">Filters</h3>
                  <button onClick={() => setFilterOpen(false)} className="p-1"><FiX className="w-5 h-5 text-gray-500" /></button>
                </div>
                
                <div className="space-y-10">
                  <div>
                    <h3 className="text-[11px] tracking-[0.2em] uppercase text-[#2C2C2C] font-['Inter',_sans-serif] font-semibold mb-4">
                      Categories
                    </h3>
                    <div className="space-y-1">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => handleCategoryClick(cat)}
                          className={`block w-full text-left px-3 py-2 text-sm capitalize transition-all duration-300 font-['Inter',_sans-serif] ${
                            selectedCategory === cat 
                              ? 'text-[#D4A574] bg-[#D4A574]/5 border-l-2 border-[#D4A574]' 
                              : 'text-gray-500 hover:text-[#2C2C2C] hover:bg-gray-50'
                          }`}
                        >
                          {cat === 'all' ? 'All Products' : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[11px] tracking-[0.2em] uppercase text-[#2C2C2C] font-['Inter',_sans-serif] font-semibold mb-4">
                      Collections
                    </h3>
                    <div className="space-y-1">
                      {badges.map(badge => (
                        <button
                          key={badge.id}
                          onClick={() => handleCollectionClick(badge.id)}
                          className={`flex items-center gap-3 w-full px-3 py-2 text-sm transition-all duration-300 font-['Inter',_sans-serif] ${
                            selectedBadge === badge.id 
                              ? 'text-[#D4A574] bg-[#D4A574]/5 border-l-2 border-[#D4A574]' 
                              : 'text-gray-500 hover:text-[#2C2C2C] hover:bg-gray-50'
                          }`}
                        >
                          <badge.icon className="w-4 h-4" />
                          <span>{badge.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode + selectedCategory + sortBy + selectedBadge}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`grid gap-7 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}
              >
                {filteredProducts.map((product) => (
                  <div key={product._id || product.id} className="relative group">
                    <Link to={`/product/${product._id || product.id}`}>
                      <div className="relative overflow-hidden rounded-2xl mb-4 bg-[#F5F4F0]">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {product.badge && (
                          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#2C2C2C] text-xs px-2 py-1 rounded">
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="font-['Cormorant_Garamond',_Georgia,_serif] text-lg text-[#2C2C2C] mb-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <FiStar key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-[#D4A574] fill-[#D4A574]' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{product.rating}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-[#2C2C2C] font-medium">${product.price}</p>
                        {product.originalPrice && (
                          <p className="text-gray-400 text-sm line-through">${product.originalPrice}</p>
                        )}
                      </div>
                    </Link>
                    
                    {/* Admin Action Buttons - Edit & Delete */}
                    {isAdmin && (
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button
                          onClick={(e) => handleEditProduct(product, e)}
                          className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-[#D4A574] hover:text-white transition shadow-md"
                          title="Edit Product"
                        >
                          <FiEdit2 className="w-3.5 h-3.5 text-[#2C2C2C] hover:text-white" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(product, e)}
                          className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-red-500 hover:text-white transition shadow-md"
                          title="Delete Product"
                        >
                          <FiTrash2 className="w-3.5 h-3.5 text-[#2C2C2C] hover:text-white" />
                        </button>
                      </div>
                    )}
                    
                    {/* Add to Cart Button - Only for normal users */}
                    {!isAdmin && (
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          // Add to cart functionality here
                        }}
                        className="w-full mt-4 border border-[#2C2C2C] text-[#2C2C2C] py-2 text-[11px] tracking-[0.2em] uppercase hover:bg-[#2C2C2C] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 font-['Inter',_sans-serif] font-medium rounded-full"
                      >
                        <FiPlus className="w-3.5 h-3.5" /> Add to Cart
                      </button>
                    )}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
            
            {filteredProducts.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 mx-auto bg-[#F5F4F0] rounded-full flex items-center justify-center mb-5">
                  <FiPackage className="w-10 h-10 text-[#D4A574]/50" />
                </div>
                <p className="text-[#2C2C2C] mb-2 font-['Inter',_sans-serif] tracking-wide">No products found.</p>
                <p className="text-gray-400 text-sm font-['Inter',_sans-serif]">Try adjusting your filters</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        productName={productToDelete?.name || ''}
        isLoading={isDeleting}
      />
    </div>
  )
}

export default Shop
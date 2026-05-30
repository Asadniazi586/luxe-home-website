import React, { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGrid, FiList, FiFilter, FiX, FiStar, FiPackage, FiTag, FiRefreshCw, FiPlus } from 'react-icons/fi'
import ProductCard from '../components/ui/ProductCard'
import { productService } from '../services/productService'
import { useAuth } from '../contexts/AuthContext'

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

  useEffect(() => {
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
    fetchProducts()
  }, [])
  
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
      <div className="bg-cream min-h-screen pt-32 flex items-center justify-center">
        <div className="w-12 h-12 border-3 border-warm border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-cream min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <div ref={productsSectionRef}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-light tracking-wide text-charcoal">Shop All</h1>
              <p className="text-gray-500 text-sm mt-1">{filteredProducts.length} products</p>
            </div>
            
            <div className="flex gap-3 flex-wrap">
              {/* Add Product Button for Admin */}
              {isAdmin && (
                <Link to="/admin/add-product">
                  <button className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-600 transition flex items-center gap-2">
                    <FiPlus className="w-4 h-4" /> Add Product
                  </button>
                </Link>
              )}
              
              <button 
                onClick={() => setFilterOpen(!filterOpen)}
                className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm bg-white"
              >
                <FiFilter /> Filters
              </button>
              
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-full text-sm bg-white focus:outline-none focus:border-warm"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name: A to Z</option>
              </select>
              
              <div className="hidden md:flex gap-2">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-warm text-white' : 'bg-white text-gray-500'}`}>
                  <FiGrid />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-warm text-white' : 'bg-white text-gray-500'}`}>
                  <FiList />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {(filterOpen || window.innerWidth >= 768) && (
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="fixed inset-0 z-50 md:relative md:inset-auto md:z-auto bg-cream md:bg-transparent p-6 md:p-0 w-80 md:w-64 overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6 md:hidden">
                  <h3 className="font-medium text-charcoal">Filters</h3>
                  <button onClick={() => setFilterOpen(false)}><FiX /></button>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="font-medium text-charcoal mb-3">Categories</h3>
                    <div className="space-y-2">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => handleCategoryClick(cat)}
                          className={`block w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition ${
                            selectedCategory === cat ? 'bg-warm text-white' : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {cat === 'all' ? 'All Products' : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-charcoal mb-3">Collections</h3>
                    <div className="space-y-2">
                      {badges.map(badge => (
                        <button
                          key={badge.id}
                          onClick={() => handleCollectionClick(badge.id)}
                          className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition ${
                            selectedBadge === badge.id ? 'bg-warm text-white' : 'text-gray-600 hover:bg-gray-100'
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
                className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} isAdmin={isAdmin} />
                ))}
              </motion.div>
            </AnimatePresence>
            
            {filteredProducts.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FiPackage className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2">No products found.</p>
                <p className="text-gray-400 text-sm">Try adjusting your filters</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shop
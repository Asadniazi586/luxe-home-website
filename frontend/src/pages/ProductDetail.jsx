import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiStar, FiMinus, FiPlus, FiHeart, FiShare2, FiTruck, FiRefreshCw, FiShield, FiChevronRight, FiAlertCircle, FiChevronLeft, FiZoomIn } from 'react-icons/fi'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'
import { useAuth } from '../contexts/AuthContext'
import { productService } from '../services/productService'
import { products } from '../data/products'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [activeImage, setActiveImage] = useState(0)
  const [sizeError, setSizeError] = useState(false)
  const [colorError, setColorError] = useState(false)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isZoomed, setIsZoomed] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const getAllImages = () => {
    if (!product) return []
    const images = []
    if (product.mainImage) images.push(product.mainImage)
    if (product.images && product.images.length > 0) {
      images.push(...product.images)
    }
    if (images.length === 0 && product.image) images.push(product.image)
    if (images.length === 0) return ['https://placehold.co/800x800/f5f0e8/8b7355?text=Product+Image']
    return images
  }

  const allImages = getAllImages()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const data = await productService.getProductById(id)
        const productWithId = { ...data, id: data._id }
        setProduct(productWithId)
        setActiveImage(0)
      } catch (error) {
        console.error('Error fetching product:', error)
        navigate('/shop')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id, navigate])

  const relatedProducts = products
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4)

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const difference = touchStart - touchEnd
    const minSwipeDistance = 50
    
    if (Math.abs(difference) > minSwipeDistance) {
      if (difference > 0) {
        nextImage()
      } else {
        prevImage()
      }
    }
    setTouchStart(0)
    setTouchEnd(0)
  }

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  if (loading) {
    return (
      <div className="bg-cream min-h-screen pt-32 flex items-center justify-center">
        <div className="w-12 h-12 border-3 border-warm border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) return null

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setSizeError(true)
      toast.error('Please select a size', { duration: 2000 })
      return
    }
    
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setColorError(true)
      toast.error('Please select a color', { duration: 2000 })
      return
    }
    
    setSizeError(false)
    setColorError(false)
    addToCart(product, quantity, selectedSize, selectedColor)
    toast.success(`Added ${quantity} ${product.name} to cart!`)
  }

  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast.success('Removed from wishlist')
    } else {
      addToWishlist(product)
      toast.success('Added to wishlist')
    }
  }

  const features = [
    { icon: FiTruck, text: 'Free shipping on orders over $100' },
    { icon: FiRefreshCw, text: '365-day easy returns' },
    { icon: FiShield, text: 'Secure checkout' },
  ]

  const totalPrice = product.price * quantity

  const desktopThumbnails = allImages.slice(0, 3)

  return (
    <div className="bg-cream min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">

        <div className="grid md:grid-cols-2 gap-6 lg:gap-10 mb-16">
          
          <div>
            <div className="hidden md:block">
              <div className="relative overflow-hidden rounded-xl bg-gray-100 mb-3">
                <img 
                  src={allImages[activeImage]} 
                  alt={product.name}
                  className="w-full aspect-square object-cover cursor-zoom-in"
                  onClick={() => setIsZoomed(true)}
                />
                <button
                  onClick={() => setIsZoomed(true)}
                  className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-all duration-200"
                >
                  <FiZoomIn size={16} className="text-white" />
                </button>
              </div>
              <div className="flex gap-3">
                {desktopThumbnails.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      activeImage === idx ? 'border-warm' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="md:hidden relative">
              <div 
                className="relative overflow-hidden rounded-xl bg-gray-100"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img 
                  src={allImages[activeImage]} 
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                />
                
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-all duration-200"
                    >
                      <FiChevronLeft size={20} className="text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-all duration-200"
                    >
                      <FiChevronRight size={20} className="text-gray-700" />
                    </button>
                  </>
                )}

                <button
                  onClick={() => setIsZoomed(true)}
                  className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-all duration-200"
                >
                  <FiZoomIn size={16} className="text-white" />
                </button>

                {allImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
                    {activeImage + 1} / {allImages.length}
                  </div>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="flex justify-center gap-2 mt-3">
                  {allImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        activeImage === idx ? 'bg-warm w-4' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            {product.badge && (
              <span className="inline-block px-2.5 py-1 rounded-full bg-warm/20 text-warm text-xs font-medium mb-3">
                {product.badge}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-light text-charcoal mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-xs text-gray-500">{product.reviews} reviews</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-light text-charcoal">${totalPrice.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-gray-400 text-sm line-through">${product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-gray-500 text-sm leading-relaxed mb-5">{product.description}</p>

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-charcoal text-sm">Size</h3>
                  {sizeError && (
                    <span className="text-xs text-red-500 flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3" /> Required
                    </span>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size)
                        setSizeError(false)
                      }}
                      className={`px-3 py-1.5 rounded-full border text-xs transition ${
                        selectedSize === size 
                          ? 'bg-charcoal text-white border-charcoal' 
                          : 'border-gray-300 text-gray-600 hover:border-charcoal'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-charcoal text-sm">Color</h3>
                  {colorError && (
                    <span className="text-xs text-red-500 flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3" /> Required
                    </span>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color)
                        setColorError(false)
                      }}
                      className={`px-3 py-1.5 rounded-full border text-xs transition ${
                        selectedColor === color 
                          ? 'bg-charcoal text-white border-charcoal' 
                          : 'border-gray-300 text-gray-600 hover:border-charcoal'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-5">
              <h3 className="font-medium text-charcoal text-sm mb-2">Quantity</h3>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-charcoal transition"
                >
                  <FiMinus className="w-3.5 h-3.5" />
                </button>
                <span className="text-base w-10 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-charcoal transition"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {!isAdmin && (
              <div className="flex gap-3 mb-6">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-charcoal text-white py-2.5 rounded-full text-sm font-medium hover:bg-charcoal-light transition"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={handleWishlist}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-charcoal transition"
                >
                  <FiHeart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
                <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-charcoal transition">
                  <FiShare2 className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="space-y-2 pt-4 border-t border-gray-200">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-gray-500">
                  <feature.icon className="w-4 h-4 text-warm" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-light text-charcoal">You May Also Like</h2>
                <div className="w-12 h-px bg-warm mt-2" />
              </div>
              <Link to="/shop" className="flex items-center gap-1 text-sm text-gray-500 hover:text-warm transition">
                View All <FiChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/product/${relatedProduct.id}`} className="group">
                    <div className="relative overflow-hidden rounded-lg mb-2 bg-gray-100">
                      <img 
                        src={relatedProduct.image} 
                        alt={relatedProduct.name}
                        className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {relatedProduct.badge && (
                        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-charcoal text-xs px-1.5 py-0.5 rounded">
                          {relatedProduct.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-medium text-charcoal mb-0.5 line-clamp-1">{relatedProduct.name}</h3>
                    <div className="flex items-center gap-1 mb-0.5">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} className={`w-2.5 h-2.5 ${i < Math.floor(relatedProduct.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{relatedProduct.rating}</span>
                    </div>
                    <p className="text-charcoal font-medium text-sm">${relatedProduct.price}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-md flex items-center justify-center cursor-zoom-out"
          >
            <div className="relative max-w-5xl w-full mx-4">
              <img 
                src={allImages[activeImage]} 
                alt={product.name} 
                className="w-full h-auto rounded-xl max-h-[85vh] object-contain"
              />
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-4 right-4 text-white bg-black/50 w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70 transition"
              >
                ✕
              </button>
              {allImages.length > 1 && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); prevImage(); }} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition"
                  >
                    <FiChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); nextImage(); }} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition"
                  >
                    <FiChevronRight size={24} />
                  </button>
                </>
              )}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-2 rounded-full">
                {activeImage + 1} / {allImages.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductDetail
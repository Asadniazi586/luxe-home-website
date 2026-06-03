import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FiArrowRight, FiStar, FiTruck, FiRefreshCw, FiShoppingBag, FiHeart, FiChevronRight, FiPlus, FiEdit2 } from 'react-icons/fi'
import { productService } from '../services/productService'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import toast from 'react-hot-toast'

const Home = () => {
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])
  const [bestsellers, setBestsellers] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { addToCart } = useCart()
  
  const isAdmin = user?.role === 'admin'
  
  // Ref to track if toast has been shown for a product
  const lastAddedProductRef = useRef(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await productService.getProducts()
        const products = data.products || []
        setBestsellers(products.slice(0, 4))
      } catch (error) {
        console.error('Error fetching products:', error)
        setBestsellers([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.1, rootMargin: '50px' })

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleAddToCart = (product, e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Prevent duplicate toasts for the same product within 500ms
    const now = Date.now()
    if (lastAddedProductRef.current && 
        lastAddedProductRef.current.id === product._id && 
        now - lastAddedProductRef.current.time < 500) {
      return // Skip if same product added within 500ms
    }
    
    lastAddedProductRef.current = {
      id: product._id,
      time: now
    }
    
    // Pass suppressToast: true as 5th parameter to prevent CartContext from showing its own toast
    addToCart(product, 1, '', '', true)
    
    // Show single toast from Home component only
    toast.success(`${product.name} added to cart!`)
  }

  const handleEditProduct = (product, e) => {
    e.preventDefault()
    e.stopPropagation()
    window.location.href = `/admin/add-product?edit=${product._id || product.id}`
  }

  const categories = [
    {
      name: 'Sheet Sets',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop',
      path: '/shop?category=bedding',
    },
    {
      name: 'Comforters',
      image: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=1200&auto=format&fit=crop',
      path: '/shop?category=bedding',
    },
    {
      name: 'Pillows',
      image: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?q=80&w=1200&auto=format&fit=crop',
      path: '/shop?category=bedding',
    },
    {
      name: 'Bath',
      image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1200&auto=format&fit=crop',
      path: '/shop?category=bath',
    },
  ]

  const benefits = [
    { icon: FiTruck, title: 'Free Shipping', description: 'On orders over $100', delay: 0.1 },
    { icon: FiRefreshCw, title: '365-Day Returns', description: 'Hassle-free returns', delay: 0.2 },
    { icon: FiStar, title: 'Premium Quality', description: 'Best materials', delay: 0.3 },
    { icon: FiShoppingBag, title: 'Sustainably Made', description: 'Eco-friendly process', delay: 0.4 },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
  }

  if (loading) {
    return (
      <div className="bg-[#FAF9F7] min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#D4A574] border-t-[#2C2C2C] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-[#FAF9F7] overflow-hidden font-['Cormorant_Garamond',_Georgia,_serif]">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
      `}</style>

      {/* Hero Section */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative h-screen flex items-center justify-center"
      >
        <div className="absolute inset-0">
          <motion.img
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop"
            alt="Luxury bedding"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 35%' }}
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col items-center justify-center"
          >
            {/* Badge - Top element */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="inline-flex items-center justify-center mb-8"
            >
              <div className="bg-[#D4A574]/20 backdrop-blur-sm border border-[#D4A574]/40 px-2 py-1 rounded-full">
                <span className="text-[#D4A574] text-[8px] tracking-[0.2em] uppercase font-['Inter',_sans-serif] font-medium">
                  ✨ BESPOKE LUXURY
                </span>
              </div>
            </motion.div>
            
            {/* Main Heading */}
            <h1 className="font-['Cormorant_Garamond',_Georgia,_serif] font-light text-6xl sm:text-6xl md:text-7xl lg:text-8xl text-[#D4A574] tracking-tight mb-5 leading-[1.15]">
              Elevate Your<br />Sleep Experience
            </h1>
            
            {/* Description */}
            <p className="text-[#D4A574] text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed font-['Inter',_sans-serif] font-light tracking-wide">
              Premium fabrics designed for those who appreciate texture,<br />detail and timeless sophistication.
            </p>
            
            {/* Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to="/shop">
                <button className="group bg-transparent border border-white/40 text-white px-10 py-4 mb-12 text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-[#2C2C2C] hover:border-white transition-all duration-300 font-['Inter',_sans-serif] font-medium rounded-full">
                  Shop The Collection
                  <FiArrowRight className="inline ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Benefits Bar */}
      <section className="py-16 bg-white border-b border-[#E8E5E0]">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-12"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: benefit.delay }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[#FAF9F7] flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-5 h-5 text-[#D4A574]" />
                </div>
                <h3 className="text-[12px] tracking-[0.2em] uppercase text-[#2C2C2C] font-['Inter',_sans-serif] font-semibold mb-1">
                  {benefit.title}
                </h3>
                <p className="text-[12px] text-gray-400 tracking-wide font-['Inter',_sans-serif]">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-[#FAF9F7]">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#D4A574] text-[12px] tracking-[0.3em] uppercase font-['Inter',_sans-serif] font-medium">
              Signature Selections
            </span>
            <h2 className="font-['Cormorant_Garamond',_Georgia,_serif] font-light text-4xl md:text-5xl text-[#2C2C2C] mt-3 mb-4">
              Shop by Category
            </h2>
            <div className="w-16 h-px bg-[#D4A574] mx-auto mt-5" />
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {categories.map((category, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link to={category.path} className="group block">
                  <div className="relative overflow-hidden mb-5 shadow-sm rounded-2xl">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full aspect-square object-cover transition-transform duration-1000 group-hover:scale-105 rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500 rounded-2xl" />
                  </div>
                  <h3 className="text-base text-[#2C2C2C] text-center tracking-wide group-hover:text-[#D4A574] transition-colors font-['Inter',_sans-serif] font-normal">
                    {category.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#D4A574] text-[12px] tracking-[0.3em] uppercase font-['Inter',_sans-serif] font-medium">
              The Art of Premium Weaving
            </span>
            <h2 className="font-['Cormorant_Garamond',_Georgia,_serif] font-light text-4xl md:text-5xl text-[#2C2C2C] mt-3 mb-4">
              Bestsellers
            </h2>
            <div className="w-16 h-px bg-[#D4A574] mx-auto mt-5 mb-6" />
            <p className="text-gray-400 text-sm max-w-md mx-auto font-['Inter',_sans-serif] tracking-wide">
              Discover fabrics that define refinement and elevate every silhouette.
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {bestsellers.map((product) => (
              <motion.div key={product._id || product.id} variants={itemVariants} className="group">
                <Link to={`/product/${product._id || product.id}`}>
                  <div className="relative overflow-hidden mb-5 bg-[#F5F4F0] shadow-sm rounded-2xl">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full aspect-square object-cover transition-transform duration-1000 group-hover:scale-105 rounded-2xl"
                    />
                    {product.badge && (
                      <span className="absolute top-4 left-4 bg-white/95 text-[#2C2C2C] text-[10px] tracking-[0.15em] px-3 py-1 uppercase font-['Inter',_sans-serif] font-medium rounded-full">
                        {product.badge}
                      </span>
                    )}
                    {isAdmin && (
                      <button
                        onClick={(e) => handleEditProduct(product, e)}
                        className="absolute top-4 right-4 bg-white/95 p-2 rounded-full hover:bg-[#D4A574] hover:text-white transition shadow-md"
                        title="Edit Product"
                      >
                        <FiEdit2 className="w-3.5 h-3.5 text-[#2C2C2C] hover:text-white" />
                      </button>
                    )}
                  </div>
                  <h3 className="font-['Cormorant_Garamond',_Georgia,_serif] text-lg text-[#2C2C2C] mb-2 group-hover:text-[#D4A574] transition-colors tracking-wide">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-[#D4A574] fill-[#D4A574]' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-400 font-['Inter',_sans-serif]">{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-5">
                    <p className="text-[#2C2C2C] font-['Inter',_sans-serif] font-medium">${product.price}</p>
                    {product.originalPrice && (
                      <p className="text-gray-300 text-sm line-through font-['Inter',_sans-serif]">${product.originalPrice}</p>
                    )}
                  </div>
                </Link>
                {!isAdmin && (
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="w-full border border-[#2C2C2C] text-[#2C2C2C] py-3 text-[11px] tracking-[0.2em] uppercase hover:bg-[#2C2C2C] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 font-['Inter',_sans-serif] font-medium rounded-full"
                  >
                    <FiPlus className="w-4 h-4" /> Add to Cart
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16"
          >
            <Link to="/shop">
              <button className="border-b-2 border-[#2C2C2C] text-[#2C2C2C] pb-1.5 text-[12px] tracking-[0.2em] uppercase hover:text-[#D4A574] hover:border-[#D4A574] transition-all duration-300 font-['Inter',_sans-serif] font-medium">
                View All Products
                <FiChevronRight className="inline ml-2 w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-28 bg-[#FAF9F7]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-2 md:order-1"
            >
              <span className="text-[#D4A574] text-[11px] tracking-[0.3em] uppercase font-['Inter',_sans-serif] font-medium">
                The Art of Premium Weaving
              </span>
              <h2 className="font-['Cormorant_Garamond',_Georgia,_serif] font-light text-4xl md:text-5xl text-[#2C2C2C] mt-4 mb-6 leading-[1.2]">
                At Weavends, we believe fabric is more than material
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6 text-base font-['Inter',_sans-serif] font-light tracking-wide">
                It is the foundation of confidence, presence and personal expression.
                Each thread is carefully selected, each weave thoughtfully crafted to deliver comfort, durability and understated luxury.
              </p>
              <Link to="/sustainability">
                <button className="border-b-2 border-[#2C2C2C] text-[#2C2C2C] pb-1.5 text-[12px] tracking-[0.2em] uppercase hover:text-[#D4A574] hover:border-[#D4A574] transition-colors font-['Inter',_sans-serif] font-medium">
                  Discover Our Story →
                </button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-1 md:order-2"
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800"
                  alt="Premium fabric weaving"
                  className="w-full shadow-lg rounded-2xl"
                />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#D4A574]/10 rounded-2xl -z-10" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-white border-t border-[#E8E5E0]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <span className="text-[#D4A574] text-[11px] tracking-[0.3em] uppercase font-['Inter',_sans-serif] font-medium">
              Join Our Community
            </span>
            <h3 className="font-['Cormorant_Garamond',_Georgia,_serif] font-light text-3xl md:text-4xl text-[#2C2C2C] mt-3 mb-3">
              Subscribe for exclusive offers
            </h3>
            <p className="text-gray-400 text-sm mb-10 font-['Inter',_sans-serif] tracking-wide">
              Be the first to know about new collections and design inspiration
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address"
                className="flex-1 px-6 py-3.5 bg-[#FAF9F7] border border-[#E8E5E0] text-sm text-[#2C2C2C] placeholder-gray-400 focus:outline-none focus:border-[#D4A574] transition font-['Inter',_sans-serif] rounded-full"
              />
              <button className="bg-[#2C2C2C] text-white px-10 py-3.5 text-[11px] tracking-[0.2em] uppercase hover:bg-[#D4A574] transition-colors font-['Inter',_sans-serif] font-medium rounded-full">
                Subscribe
              </button>
            </div>
            <p className="text-gray-300 text-[10px] mt-5 tracking-wide font-['Inter',_sans-serif]">
              No spam. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
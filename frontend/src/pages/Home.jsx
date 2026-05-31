import React, { useEffect, useState } from 'react'
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
    addToCart(product, 1)
    toast.success(`Added ${product.name} to cart!`)
  }

  const handleEditProduct = (product, e) => {
    e.preventDefault()
    e.stopPropagation()
    // Navigate to admin add product page with edit mode
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
      <div className="bg-cream min-h-screen pt-32 flex items-center justify-center">
        <div className="w-12 h-12 border-3 border-warm border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-cream overflow-hidden">
      {/* Hero Section - Full height */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative h-screen flex items-center justify-center"
      >
        <div className="absolute inset-0">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop"
            alt="Luxury bedding"
            className="w-full h-full object-cover brightness-[0.55]"
            style={{ objectPosition: 'center 30%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/30" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="inline-block px-4 py-2 rounded-full bg-warm/40 backdrop-blur-sm text-cream text-xs tracking-wide mb-6 shadow-lg"
            >
              ✨ LUXURY BEDDING
            </motion.span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-cream font-light tracking-wide mb-4 drop-shadow-lg">
              Elevate Your<br />Sleep Experience
            </h1>
            <p className="text-cream/95 text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed font-light drop-shadow-md">
              Discover the perfect blend of comfort, style, and sustainability with our premium bedding collection.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to="/shop">
                <button className="group bg-warm text-white px-8 py-3 rounded-full text-sm font-medium tracking-wide hover:bg-warm-light transition-all shadow-lg">
                  Shop The Collection
                  <FiArrowRight className="inline ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Benefits Bar */}
      <section className="py-12 bg-white border-y border-gray-100 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
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
                <benefit.icon className="w-6 h-6 mx-auto mb-2 text-warm" />
                <h3 className="text-sm font-medium text-charcoal">{benefit.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-wide text-charcoal mb-3">Shop by Category</h2>
            <div className="w-16 h-px bg-warm mx-auto" />
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {categories.map((category, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link to={category.path} className="group">
                  <div className="relative overflow-hidden rounded-lg aspect-square mb-3">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <h3 className="text-sm font-medium text-charcoal text-center">{category.name}</h3>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bestsellers Section with Add to Cart and Edit buttons */}
      <section className="py-20 bg-cream-dark">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-wide text-charcoal mb-3">Bestsellers</h2>
            <div className="w-16 h-px bg-warm mx-auto" />
            <p className="text-gray-500 text-sm mt-4">Customer favorites loved by thousands</p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {bestsellers.map((product) => (
              <motion.div key={product._id || product.id} variants={itemVariants} className="group relative">
                <Link to={`/product/${product._id || product.id}`}>
                  <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-charcoal text-xs px-2 py-1 rounded">
                        {product.badge}
                      </span>
                    )}
                    {/* Edit Icon - Only visible to admin */}
                    {isAdmin && (
                      <button
                        onClick={(e) => handleEditProduct(product, e)}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full hover:bg-warm hover:text-white transition shadow-md"
                        title="Edit Product"
                      >
                        <FiEdit2 className="w-4 h-4 text-gray-700 hover:text-white" />
                      </button>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-charcoal mb-1 group-hover:text-warm transition">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-charcoal font-medium">${product.price}</p>
                    {product.originalPrice && (
                      <p className="text-gray-400 text-sm line-through">${product.originalPrice}</p>
                    )}
                  </div>
                </Link>
                {/* Add to Cart Button - Only for normal users (not admin) */}
                {!isAdmin && (
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="w-full bg-charcoal text-white py-2 rounded-full text-xs font-medium hover:bg-charcoal-light transition flex items-center justify-center gap-2"
                  >
                    <FiPlus className="w-3 h-3" /> Add to Cart
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
            className="text-center mt-10"
          >
            <Link to="/shop">
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-full text-sm font-medium hover:bg-charcoal hover:text-white hover:border-charcoal transition-all duration-300">
                View All Products
                <FiChevronRight className="inline ml-1 w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Banner */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 md:order-1"
            >
              <span className="text-warm text-sm tracking-wide uppercase">Sustainable Luxury</span>
              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-charcoal mt-2 mb-4">
                Ethically Crafted<br />For Better Sleep
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                Our bedding is made from 100% organic cotton, sourced from sustainable farms. 
                Experience the difference of premium craftsmanship that respects both you and the planet.
              </p>
              <Link to="/sustainability">
                <button className="border-b border-charcoal text-charcoal pb-1 text-sm font-medium hover:text-warm hover:border-warm transition-colors">
                  Learn More →
                </button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 md:order-2"
            >
              <img 
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800"
                alt="Sustainable bedding"
                className="rounded-lg shadow-lg w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-cream-dark">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-lg mx-auto"
          >
            <h3 className="text-2xl font-light text-charcoal mb-2">Join Our Community</h3>
            <p className="text-gray-500 text-sm mb-6">Subscribe for exclusive offers and design inspiration</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Your email address"
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-warm focus:ring-2 focus:ring-warm/20 transition"
              />
              <button className="bg-charcoal text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-charcoal-light transition whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-gray-400 text-xs mt-4">No spam. Unsubscribe anytime.</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
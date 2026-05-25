import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome } from 'react-icons/fi'

const NotFound = () => {
  return (
    <div className="bg-cream min-h-screen flex items-center justify-center pt-20">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-8xl md:text-9xl font-light text-charcoal mb-4">404</h1>
          <div className="w-20 h-px bg-warm mx-auto mb-6" />
          <h2 className="text-2xl font-light text-charcoal mb-2">Page Not Found</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
          <Link to="/">
            <button className="inline-flex items-center gap-2 bg-charcoal text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-charcoal-light transition">
              <FiHome className="w-4 h-4" /> Back to Home
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound
import React from 'react'
import { motion } from 'framer-motion'

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-cream z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="text-center"
      >
        <div className="w-16 h-16 border-3 border-warm border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-charcoal font-light">Loading...</p>
      </motion.div>
    </div>
  )
}

export default Loader
import React from 'react'
import { motion } from 'framer-motion'

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-[#FAF9F7] z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="text-center"
      >
        <div className="w-12 h-12 border-2 border-[#D4A574] border-t-[#2C2C2C] rounded-full animate-spin mx-auto" />
      </motion.div>
    </div>
  )
}

export default Loader
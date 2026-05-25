import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiMinus } from 'react-icons/fi'

const Accordion = ({ items, allowMultiple = false }) => {
  const [openIndexes, setOpenIndexes] = useState([])

  const toggleItem = (index) => {
    if (allowMultiple) {
      setOpenIndexes(prev =>
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      )
    } else {
      setOpenIndexes(prev => (prev.includes(index) ? [] : [index]))
    }
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleItem(index)}
            className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-50 transition"
          >
            <span className="font-medium text-charcoal">{item.question}</span>
            {openIndexes.includes(index) ? (
              <FiMinus className="w-5 h-5 text-warm flex-shrink-0" />
            ) : (
              <FiPlus className="w-5 h-5 text-warm flex-shrink-0" />
            )}
          </button>
          <AnimatePresence>
            {openIndexes.includes(index) && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-5 pt-0 text-gray-600 leading-relaxed">{item.answer}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

export default Accordion
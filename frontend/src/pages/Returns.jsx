import React from 'react'
import { motion } from 'framer-motion'
import { FiRefreshCw, FiClock, FiPackage, FiCreditCard, FiMail, FiCheckCircle } from 'react-icons/fi'

const Returns = () => {
  const steps = [
    { icon: FiMail, title: 'Contact Us', description: 'Email us within 30 days of delivery' },
    { icon: FiPackage, title: 'Pack Item', description: 'Pack item in original packaging' },
    { icon: FiRefreshCw, title: 'Ship Back', description: 'Use provided return label' },
    { icon: FiCheckCircle, title: 'Refund', description: 'Refund processed within 5-7 days' },
  ]

  return (
    <div className="bg-cream min-h-screen pt-20">
      <section className="py-16 bg-charcoal text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">Return Policy</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">365-day easy returns on all unused items</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-light text-charcoal mb-4">Our Promise</h2>
            <p className="text-gray-600 leading-relaxed">
              We want you to love your purchase. If for any reason you're not completely satisfied, 
              you may return unused items within 365 days of delivery for a full refund.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-light text-charcoal mb-6">Easy Return Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 mx-auto bg-warm/10 rounded-full flex items-center justify-center mb-3">
                    <step.icon className="w-6 h-6 text-warm" />
                  </div>
                  <h3 className="font-medium text-charcoal mb-1">{step.title}</h3>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-light text-charcoal mb-4">Return Conditions</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <FiClock className="w-5 h-5 text-warm mt-0.5" />
                <span>Items must be returned within 365 days of delivery</span>
              </li>
              <li className="flex items-start gap-3">
                <FiPackage className="w-5 h-5 text-warm mt-0.5" />
                <span>Items must be unused and in original packaging</span>
              </li>
              <li className="flex items-start gap-3">
                <FiCreditCard className="w-5 h-5 text-warm mt-0.5" />
                <span>Refunds issued to original payment method</span>
              </li>
            </ul>
          </div>

          <div className="bg-warm/10 rounded-xl p-6">
            <h3 className="text-lg font-medium text-charcoal mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-4">Our customer service team is here to assist you with returns.</p>
            <button className="bg-charcoal text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-charcoal-light transition">
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Returns
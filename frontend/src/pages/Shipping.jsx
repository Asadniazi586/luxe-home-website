import React from 'react'
import { motion } from 'framer-motion'
import { FiTruck, FiGlobe, FiClock, FiPackage, FiMapPin, FiCreditCard } from 'react-icons/fi'

const Shipping = () => {
  const shippingMethods = [
    { name: 'Standard Shipping', time: '3-7 business days', cost: '$5.99', icon: FiTruck, free: false },
    { name: 'Express Shipping', time: '2-3 business days', cost: '$12.99', icon: FiClock, free: false },
    { name: 'Overnight Shipping', time: '1-2 business days', cost: '$24.99', icon: FiPackage, free: false },
    { name: 'Free Shipping', time: '5-9 business days', cost: 'Free', icon: FiGlobe, free: true },
  ]

  return (
    <div className="bg-cream min-h-screen pt-20">
      <section className="py-16 bg-charcoal text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">Shipping Information</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Fast, reliable shipping to destinations worldwide</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <h2 className="text-2xl font-light text-charcoal mb-4">Shipping Methods</h2>
            <div className="space-y-4">
              {shippingMethods.map((method, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:border-warm transition">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-warm/10 rounded-full flex items-center justify-center">
                      <method.icon className="w-5 h-5 text-warm" />
                    </div>
                    <div>
                      <h3 className="font-medium text-charcoal">{method.name}</h3>
                      <p className="text-xs text-gray-500">{method.time}</p>
                    </div>
                  </div>
                  <div>
                    <span className={`font-medium ${method.free ? 'text-green-600' : 'text-charcoal'}`}>{method.cost}</span>
                    {method.free && <span className="text-xs text-green-600 ml-2">on orders $100+</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-medium text-charcoal mb-3 flex items-center gap-2">
                <FiMapPin className="text-warm" /> Domestic Shipping
              </h3>
              <p className="text-gray-600 text-sm mb-3">United States</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Standard: 3-7 business days</li>
                <li>• Express: 2-3 business days</li>
                <li>• Free shipping on orders over $100</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-medium text-charcoal mb-3 flex items-center gap-2">
                <FiGlobe className="text-warm" /> International Shipping
              </h3>
              <p className="text-gray-600 text-sm mb-3">Worldwide Delivery</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Canada: 5-10 business days</li>
                <li>• Europe: 7-14 business days</li>
                <li>• Asia/Pacific: 7-14 business days</li>
                <li>• Rest of World: 10-20 business days</li>
              </ul>
            </div>
          </div>

          <div className="bg-warm/10 rounded-xl p-6">
            <h3 className="text-lg font-medium text-charcoal mb-2">Order Tracking</h3>
            <p className="text-gray-600 text-sm mb-4">
              Once your order ships, you'll receive a confirmation email with tracking information. 
              You can also track your order from your account dashboard.
            </p>
            <button className="bg-charcoal text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-charcoal-light transition">
              Track Your Order
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Shipping
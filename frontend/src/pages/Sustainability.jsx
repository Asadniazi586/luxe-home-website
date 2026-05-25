import React from 'react'
import { motion } from 'framer-motion'
import { FiPackage, FiRefreshCw, FiGlobe, FiHeart, FiSun, FiDroplet, FiAward, FiShield, FiUsers, FiTrendingUp } from 'react-icons/fi'

const Sustainability = () => {
  const initiatives = [
    { icon: FiPackage, title: 'Organic Materials', description: '100% organic cotton sourced from sustainable farms' },
    { icon: FiRefreshCw, title: 'Eco-Friendly Packaging', description: '100% recyclable and biodegradable packaging' },
    { icon: FiGlobe, title: 'Carbon Neutral', description: 'Offsetting our carbon footprint through reforestation' },
    { icon: FiHeart, title: 'Ethical Production', description: 'Fair wages and safe working conditions for all workers' },
    { icon: FiSun, title: 'Renewable Energy', description: 'Manufacturing powered by solar and wind energy' },
    { icon: FiDroplet, title: 'Water Conservation', description: 'Water-efficient dyeing and finishing processes' },
  ]

  const certifications = [
    { name: 'GOTS Certified', description: 'Global Organic Textile Standard', icon: FiAward },
    { name: 'OEKO-TEX', description: 'Tested for harmful substances', icon: FiShield },
    { name: 'Fair Trade', description: 'Ethical production practices', icon: FiUsers },
    { name: 'Carbon Neutral', description: 'Certified carbon neutral', icon: FiTrendingUp },
  ]

  return (
    <div className="bg-cream min-h-screen pt-20">
      <section className="py-16 bg-charcoal text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">Our Commitment to Sustainability</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Creating beautiful products that respect our planet</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-charcoal mb-3">Our Sustainability Initiatives</h2>
            <div className="w-16 h-px bg-warm mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {initiatives.map((initiative, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm text-center group hover:shadow-md transition">
                <div className="w-16 h-16 mx-auto bg-warm/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-warm/20 transition">
                  <initiative.icon className="w-8 h-8 text-warm" />
                </div>
                <h3 className="text-lg font-medium text-charcoal mb-2">{initiative.title}</h3>
                <p className="text-gray-500 text-sm">{initiative.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-warm/10 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-light text-charcoal text-center mb-6">Certifications & Standards</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {certifications.map((cert, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                    <cert.icon className="w-6 h-6 text-warm" />
                  </div>
                  <h4 className="font-medium text-charcoal text-sm">{cert.name}</h4>
                  <p className="text-xs text-gray-500">{cert.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-light text-charcoal mb-3">Join Our Mission</h3>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Every purchase helps support sustainable practices and ethical production.
            </p>
            <a 
              href="/shop" 
              className="inline-block bg-charcoal text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-charcoal-light transition"
            >
              Shop All Products
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Sustainability
import React from 'react'
import { motion } from 'framer-motion'
import { FiEye, FiHeadphones, FiMonitor, FiMousePointer, FiUsers, FiGlobe } from 'react-icons/fi'

const Accessibility = () => {
  const commitments = [
    {
      icon: FiEye,
      title: 'Visual Accessibility',
      description: 'High contrast options, scalable text, and screen reader compatibility for visually impaired users.'
    },
    {
      icon: FiHeadphones,
      title: 'Auditory Accessibility',
      description: 'Captions and transcripts for video content, adjustable volume controls.'
    },
    {
      icon: FiMonitor,
      title: 'Keyboard Navigation',
      description: 'Full keyboard navigation support for users who cannot use a mouse.'
    },
    {
      icon: FiMousePointer,
      title: 'Motor Accessibility',
      description: 'Large clickable areas, adjustable timing, and voice control compatibility.'
    },
    {
      icon: FiUsers,
      title: 'Cognitive Accessibility',
      description: 'Clear language, consistent navigation, and helpful error messages.'
    },
    {
      icon: FiGlobe,
      title: 'International Standards',
      description: 'WCAG 2.1 AA compliant, following global accessibility standards.'
    }
  ]

  const standards = [
    { name: 'WCAG 2.1 AA', description: 'Web Content Accessibility Guidelines' },
    { name: 'Section 508', description: 'US federal accessibility standard' },
    { name: 'ADA Compliant', description: 'Americans with Disabilities Act' },
    { name: 'EN 301 549', description: 'European accessibility standard' },
  ]

  return (
    <div className="bg-cream min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-charcoal text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">Accessibility Statement</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">LUXE HOME is committed to making our website accessible to everyone</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Commitment */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-charcoal mb-3">Our Commitment</h2>
            <div className="w-12 h-px bg-warm mb-4" />
            <p className="text-gray-600 leading-relaxed">
              At LUXE HOME, we believe everyone should have equal access to our products and services. 
              We are continuously working to improve the accessibility of our website to ensure it meets 
              the needs of all users, including those with disabilities.
            </p>
          </div>

          {/* Accessibility Features */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-charcoal mb-3">Accessibility Features</h2>
            <div className="w-16 h-px bg-warm mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {commitments.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 bg-warm/10 rounded-full flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-warm" />
                </div>
                <h3 className="text-lg font-medium text-charcoal mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Standards */}
          <div className="bg-warm/10 rounded-2xl p-8 mb-12">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-light text-charcoal mb-2">Standards Compliance</h2>
              <div className="w-12 h-px bg-warm mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {standards.map((standard, index) => (
                <div key={index} className="bg-white rounded-lg p-4 text-center">
                  <h4 className="font-medium text-charcoal mb-1">{standard.name}</h4>
                  <p className="text-gray-400 text-xs">{standard.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="text-center">
            <h3 className="text-xl font-light text-charcoal mb-3">Need Assistance?</h3>
            <p className="text-gray-500 text-sm mb-4">
              If you experience any difficulty accessing our website, please contact us.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a href="tel:+15551234567" className="inline-block bg-charcoal text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-charcoal-light transition">
                Call Us
              </a>
              <a href="mailto:accessibility@luxehome.com" className="inline-block border border-charcoal text-charcoal px-6 py-2 rounded-full text-sm font-medium hover:bg-charcoal hover:text-white transition">
                Email Support
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Accessibility
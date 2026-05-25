import React from 'react'
import { motion } from 'framer-motion'

const TermsOfService = () => {
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: 'By accessing or using LUXE HOME website, you agree to be bound by these Terms of Service and all applicable laws and regulations.'
    },
    {
      title: 'Products and Pricing',
      content: 'We strive to display accurate product information and pricing. However, errors may occur. We reserve the right to correct any errors and cancel orders if necessary.'
    },
    {
      title: 'Orders and Payment',
      content: 'When you place an order, you agree to provide current, complete, and accurate payment information. We reserve the right to refuse or cancel any order at our discretion.'
    },
    {
      title: 'Shipping and Delivery',
      content: 'Estimated delivery times are provided as guidelines only. We are not responsible for delays caused by carriers or customs clearance.'
    },
    {
      title: 'Returns and Refunds',
      content: 'Our 365-day return policy allows you to return unused items within 365 days of delivery. Please see our Return Policy for complete details.'
    },
    {
      title: 'Intellectual Property',
      content: 'All content on this website, including images, text, logos, and designs, is the property of LUXE HOME and protected by copyright laws.'
    },
    {
      title: 'Limitation of Liability',
      content: 'To the maximum extent permitted by law, LUXE HOME shall not be liable for any indirect, incidental, or consequential damages arising from your use of our products or website.'
    },
    {
      title: 'Changes to Terms',
      content: 'We may update these terms at any time. Continued use of our website after changes constitutes acceptance of the new terms.'
    },
  ]

  return (
    <div className="bg-cream min-h-screen pt-20">
      <section className="py-16 bg-charcoal text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">Terms of Service</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Last updated: January 1, 2024</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl p-6 md:p-8 shadow-sm space-y-6"
        >
          <p className="text-gray-600">
            Welcome to LUXE HOME. These Terms of Service govern your use of our website and services. 
            By using our website, you agree to these terms.
          </p>

          {sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-xl font-medium text-charcoal mb-3">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          ))}

          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-medium text-charcoal mb-3">Contact Information</h2>
            <p className="text-gray-600">
              Questions about these Terms? Contact us at:<br />
              legal@luxehome.com<br />
              +1 (555) 123-4567
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TermsOfService
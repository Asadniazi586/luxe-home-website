import React from 'react'
import { motion } from 'framer-motion'

const PrivacyPolicy = () => {
  const sections = [
    {
      title: 'Information We Collect',
      content: 'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This may include your name, email address, shipping address, payment information, and order history.'
    },
    {
      title: 'How We Use Your Information',
      content: 'We use your information to process orders, communicate with you about your purchases, personalize your shopping experience, improve our website, and send marketing communications (with your consent).'
    },
    {
      title: 'Information Sharing',
      content: 'We do not sell your personal information. We may share your information with service providers who assist with order fulfillment, payment processing, and website operations. All partners are contractually obligated to protect your data.'
    },
    {
      title: 'Data Security',
      content: 'We implement industry-standard security measures to protect your personal information, including SSL encryption for all transactions and secure data storage systems.'
    },
    {
      title: 'Your Rights',
      content: 'You have the right to access, correct, or delete your personal information. You can also opt out of marketing communications at any time by clicking "unsubscribe" in our emails.'
    },
    {
      title: 'Cookies',
      content: 'We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can adjust your browser settings to disable cookies if you prefer.'
    },
  ]

  return (
    <div className="bg-cream min-h-screen pt-20">
      <section className="py-16 bg-charcoal text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">Privacy Policy</h1>
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
            At LUXE HOME, we take your privacy seriously. This policy describes how we collect, use, 
            and protect your personal information when you use our website and services.
          </p>

          {sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-xl font-medium text-charcoal mb-3">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          ))}

          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-medium text-charcoal mb-3">Contact Us</h2>
            <p className="text-gray-600">
              If you have questions about this privacy policy, please contact us at:<br />
              privacy@luxehome.com<br />
              or call +1 (555) 123-4567
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
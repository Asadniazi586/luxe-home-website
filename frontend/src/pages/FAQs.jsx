import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiMinus } from 'react-icons/fi'

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'What materials are your products made from?',
      answer: 'All our products are made from 100% organic cotton, sustainably sourced materials, and eco-friendly dyes. We prioritize natural, breathable fabrics that are gentle on your skin and the environment.'
    },
    {
      question: 'How do I care for my bedding?',
      answer: 'Machine wash cold with like colors, tumble dry low. Avoid bleach and fabric softeners to maintain the quality and softness of your bedding. Our sheets get softer with every wash!'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Yes, we ship worldwide! Shipping times and costs vary by location. You can see exact shipping costs at checkout based on your address.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 365-day return policy on all unused items in original packaging. Simply contact our customer service team to initiate a return.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-7 business days within the US. International shipping takes 7-14 business days. Expedited shipping options are available at checkout.'
    },
    {
      question: 'Are your products sustainable?',
      answer: 'Absolutely! Sustainability is at the core of everything we do. From organic materials to eco-friendly packaging and carbon-neutral shipping, we are committed to protecting our planet.'
    },
  ]

  return (
    <div className="bg-cream min-h-screen pt-20">
      {/* Hero */}
      <section className="py-16 bg-charcoal text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Find answers to common questions about our products, shipping, and policies.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition"
              >
                <span className="font-medium text-charcoal">{faq.question}</span>
                {openIndex === index ? <FiMinus className="w-5 h-5 text-warm" /> : <FiPlus className="w-5 h-5 text-warm" />}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 text-center p-8 bg-warm/10 rounded-xl">
          <h3 className="text-lg font-medium text-charcoal mb-2">Still have questions?</h3>
          <p className="text-gray-500 mb-4">We're here to help! Contact our support team.</p>
          <button className="bg-charcoal text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-charcoal-light transition">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  )
}

export default FAQs
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi'
import toast from 'react-hot-toast'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Message sent successfully!')
    setFormData({ name: '', email: '', subject: '', message: '' })
    setIsSubmitting(false)
  }

  const contactInfo = [
    { icon: FiMapPin, title: 'Visit Us', details: '123 Luxury Lane, New York, NY 10001', color: 'text-warm' },
    { icon: FiPhone, title: 'Call Us', details: '+1 (555) 123-4567', color: 'text-warm' },
    { icon: FiMail, title: 'Email Us', details: 'hello@luxehome.com', color: 'text-warm' },
    { icon: FiClock, title: 'Hours', details: 'Mon-Fri: 9am-6pm EST', color: 'text-warm' },
  ]

  return (
    <div className="bg-cream min-h-screen pt-20">
      {/* Hero */}
      <section className="py-16 bg-charcoal text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">Get in Touch</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">We'd love to hear from you. Send us a message and we'll respond within 24 hours.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-light text-charcoal mb-6">Contact Information</h2>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-warm/10 flex items-center justify-center flex-shrink-0">
                    <info.icon className={`w-6 h-6 ${info.color}`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-charcoal mb-1">{info.title}</h3>
                    <p className="text-gray-500 text-sm">{info.details}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="mt-8">
              <div className="bg-gray-200 rounded-lg h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800"
                  alt="Map"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-light text-charcoal mb-6">Send a Message</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-warm transition"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-warm transition"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-warm transition"
                    placeholder="How can we help?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-warm transition resize-none"
                    placeholder="Tell us more..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-charcoal text-white py-3 rounded-xl font-medium hover:bg-charcoal-light transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <FiSend className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Contact
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiArrowRight } from 'react-icons/fi'
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
    { icon: FiMapPin, title: 'Visit Us', details: '123 Luxury Lane, New York, NY 10001', color: 'text-[#D4A574]' },
    { icon: FiPhone, title: 'Call Us', details: '+1 (555) 123-4567', color: 'text-[#D4A574]' },
    { icon: FiMail, title: 'Email Us', details: 'hello@luxehome.com', color: 'text-[#D4A574]' },
    { icon: FiClock, title: 'Hours', details: 'Mon-Fri: 9am-6pm EST', color: 'text-[#D4A574]' },
  ]

  return (
    <div className="bg-[#FAF9F7] min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Image with low visibility */}
       <div className="absolute inset-0">
               <motion.img 
                 initial={{ scale: 1.05 }}
                 animate={{ scale: 1 }}
                 transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
                 src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800"
                 alt="About us"
                 className="w-full h-full object-cover"
                 style={{ objectPosition: 'center 40%' }}
               />
               <div className="absolute inset-0 bg-black/50" />
               <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
             </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#D4A574] text-[11px] tracking-[0.3em] uppercase font-['Inter',_sans-serif] font-medium">
              Get in Touch
            </span>
            <h1 className="font-['Cormorant_Garamond',_Georgia,_serif] font-light text-5xl md:text-6xl lg:text-7xl text-white tracking-tight mt-3 mb-4">
              Contact Us
            </h1>
            <div className="w-12 h-px bg-[#D4A574] mx-auto mb-6" />
            <p className="text-white/70 text-base max-w-2xl mx-auto font-['Inter',_sans-serif] font-light tracking-wide">
              We'd love to hear from you. Send us a message and we'll respond within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#D4A574] text-[11px] tracking-[0.3em] uppercase font-['Inter',_sans-serif] font-medium">
              Reach Out
            </span>
            <h2 className="font-['Cormorant_Garamond',_Georgia,_serif] font-light text-4xl text-[#2C2C2C] mt-2 mb-6">
              Contact Information
            </h2>
            <div className="w-12 h-px bg-[#D4A574] mb-8" />
            
            <div className="space-y-8">
              {contactInfo.map((info, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-start gap-5 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-full bg-[#D4A574]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4A574] transition-all duration-300">
                    <info.icon className={`w-5 h-5 ${info.color} group-hover:text-white transition-all duration-300`} />
                  </div>
                  <div>
                    <h3 className="font-['Cormorant_Garamond',_Georgia,_serif] text-lg text-[#2C2C2C] mb-1">
                      {info.title}
                    </h3>
                    <p className="text-gray-400 text-sm font-['Inter',_sans-serif] tracking-wide">
                      {info.details}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map */}
            <motion.div 
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="rounded-2xl overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800"
                  alt="Map"
                  className="w-full h-64 object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10 border border-[#E8E5E0]">
              <span className="text-[#D4A574] text-[11px] tracking-[0.3em] uppercase font-['Inter',_sans-serif] font-medium">
                Send a Message
              </span>
              <h2 className="font-['Cormorant_Garamond',_Georgia,_serif] font-light text-3xl text-[#2C2C2C] mt-2 mb-6">
                Let's Talk
              </h2>
              <div className="w-12 h-px bg-[#D4A574] mb-8" />
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[11px] tracking-[0.15em] uppercase text-[#2C2C2C] font-['Inter',_sans-serif] font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3.5 bg-[#FAF9F7] border border-[#E8E5E0] rounded-xl focus:outline-none focus:border-[#D4A574] focus:bg-white transition-all duration-300 font-['Inter',_sans-serif] text-sm text-[#2C2C2C]"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-[11px] tracking-[0.15em] uppercase text-[#2C2C2C] font-['Inter',_sans-serif] font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3.5 bg-[#FAF9F7] border border-[#E8E5E0] rounded-xl focus:outline-none focus:border-[#D4A574] focus:bg-white transition-all duration-300 font-['Inter',_sans-serif] text-sm text-[#2C2C2C]"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-[11px] tracking-[0.15em] uppercase text-[#2C2C2C] font-['Inter',_sans-serif] font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3.5 bg-[#FAF9F7] border border-[#E8E5E0] rounded-xl focus:outline-none focus:border-[#D4A574] focus:bg-white transition-all duration-300 font-['Inter',_sans-serif] text-sm text-[#2C2C2C]"
                    placeholder="How can we help?"
                  />
                </div>
                
                <div>
                  <label className="block text-[11px] tracking-[0.15em] uppercase text-[#2C2C2C] font-['Inter',_sans-serif] font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-5 py-3.5 bg-[#FAF9F7] border border-[#E8E5E0] rounded-xl focus:outline-none focus:border-[#D4A574] focus:bg-white transition-all duration-300 font-['Inter',_sans-serif] text-sm text-[#2C2C2C] resize-none"
                    placeholder="Tell us more..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group w-full bg-[#2C2C2C] text-white py-3.5 rounded-xl font-medium hover:bg-[#D4A574] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 font-['Inter',_sans-serif] text-[11px] tracking-[0.2em] uppercase"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <FiSend className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Contact
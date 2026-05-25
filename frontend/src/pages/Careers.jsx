import React from 'react'
import { motion } from 'framer-motion'
import { FiBriefcase, FiMapPin, FiClock, FiMail, FiAward, FiUsers, FiTrendingUp, FiHeart } from 'react-icons/fi'

const Careers = () => {
  const openPositions = [
    {
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      experience: '5+ years',
      description: 'We are looking for an experienced frontend developer to join our team...'
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'New York, NY',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Seeking a creative product designer to help shape our product line...'
    },
    {
      title: 'Customer Experience Specialist',
      department: 'Support',
      location: 'Remote',
      type: 'Full-time',
      experience: '2+ years',
      description: 'Join our support team to help customers with their shopping experience...'
    },
    {
      title: 'Sustainability Coordinator',
      department: 'Operations',
      location: 'San Francisco, CA',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Lead our sustainability initiatives and eco-friendly practices...'
    }
  ]

  const benefits = [
    { icon: FiHeart, title: 'Health Insurance', description: 'Comprehensive medical, dental, and vision coverage' },
    { icon: FiAward, title: '401(k) Matching', description: 'Competitive retirement savings plan' },
    { icon: FiTrendingUp, title: 'Growth Opportunities', description: 'Career development and learning stipends' },
    { icon: FiUsers, title: 'Team Culture', description: 'Inclusive and collaborative work environment' },
  ]

  const values = [
    'Sustainability First',
    'Customer Obsessed',
    'Innovation Driven',
    'Inclusive Culture',
    'Work-Life Balance'
  ]

  return (
    <div className="bg-cream min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-charcoal text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">Join Our Team</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Build your career with a company that values innovation and sustainability</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Why Join Us */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-charcoal mb-3">Why Join LUXE HOME?</h2>
            <div className="w-16 h-px bg-warm mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 mx-auto bg-warm/10 rounded-full flex items-center justify-center mb-3">
                  <benefit.icon className="w-6 h-6 text-warm" />
                </div>
                <h3 className="font-medium text-charcoal mb-1">{benefit.title}</h3>
                <p className="text-gray-500 text-xs">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Our Values */}
          <div className="bg-warm/10 rounded-2xl p-8 mb-16">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-light text-charcoal mb-2">Our Values</h2>
              <div className="w-12 h-px bg-warm mx-auto" />
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {values.map((value, index) => (
                <span key={index} className="px-4 py-2 bg-white rounded-full text-sm text-charcoal shadow-sm">
                  {value}
                </span>
              ))}
            </div>
          </div>

          {/* Open Positions */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-charcoal mb-3">Open Positions</h2>
            <div className="w-16 h-px bg-warm mx-auto" />
            <p className="text-gray-500 text-sm mt-4">Join us in shaping the future of home comfort</p>
          </div>

          <div className="space-y-4 mb-16">
            {openPositions.map((position, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-charcoal mb-2">{position.title}</h3>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><FiBriefcase className="w-3 h-3" /> {position.department}</span>
                      <span className="flex items-center gap-1"><FiMapPin className="w-3 h-3" /> {position.location}</span>
                      <span className="flex items-center gap-1"><FiClock className="w-3 h-3" /> {position.type}</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-3">{position.description}</p>
                  </div>
                  <button className="bg-charcoal text-white px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-charcoal-light transition">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <h3 className="text-xl font-light text-charcoal mb-3">Don't see the right fit?</h3>
            <p className="text-gray-500 text-sm mb-4">Send us your resume and we'll keep you in mind for future opportunities</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a 
                href="mailto:careers@luxehome.com" 
                className="inline-flex items-center justify-center gap-2 bg-charcoal text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-charcoal-light transition"
              >
                <FiMail className="w-4 h-4" /> careers@luxehome.com
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Careers
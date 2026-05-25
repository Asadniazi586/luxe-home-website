import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiHeart, FiStar, FiUsers, FiTruck } from 'react-icons/fi'

const About = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.1 })

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const values = [
    { icon: FiHeart, title: 'Quality First', description: 'We never compromise on quality. Every product is crafted with premium materials.' },
    { icon: FiStar, title: 'Sustainability', description: 'Committed to eco-friendly practices and sustainable sourcing.' },
    { icon: FiUsers, title: 'Customer Focus', description: 'Your satisfaction is our top priority, always.' },
    { icon: FiTruck, title: 'Fast Delivery', description: 'Quick and reliable shipping worldwide.' },
  ]

  const team = [
    { name: 'Sarah Johnson', role: 'Founder & CEO', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Michael Chen', role: 'Head of Design', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Emma Davis', role: 'Customer Experience', image: 'https://randomuser.me/api/portraits/women/68.jpg' },
  ]

  return (
    <div className="bg-cream min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600"
            alt="About us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide mb-4">About LUXE HOME</h1>
          <p className="text-lg md:text-xl font-light max-w-2xl mx-auto px-4">Creating beautiful, sustainable home essentials for modern living</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-light text-charcoal mb-4">Our Story</h2>
              <div className="w-16 h-px bg-warm mb-6" />
              <p className="text-gray-600 leading-relaxed mb-4">
                Founded in 2020, LUXE HOME was born from a simple idea: to create beautiful, 
                high-quality home essentials that don't compromise on sustainability or style.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we're proud to offer a curated collection of bedding, bath, and home decor 
                that brings comfort and elegance to homes around the world. Every product is thoughtfully 
                designed and ethically crafted with the finest materials.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800"
                alt="Our story"
                className="rounded-lg shadow-lg w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-cream-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-charcoal mb-3">Our Values</h2>
            <div className="w-16 h-px bg-warm mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <value.icon className="w-8 h-8 text-warm" />
                </div>
                <h3 className="text-lg font-medium text-charcoal mb-2">{value.title}</h3>
                <p className="text-gray-500 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-charcoal mb-3">Meet the Team</h2>
            <div className="w-16 h-px bg-warm mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-40 h-40 rounded-full mx-auto object-cover mb-4 shadow-md"
                />
                <h3 className="text-lg font-medium text-charcoal">{member.name}</h3>
                <p className="text-gray-500 text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">Join Our Community</h2>
          <p className="text-gray-300 mb-8 max-w-lg mx-auto">Sign up for exclusive offers and design inspiration</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:border-warm"
            />
            <button className="bg-warm text-white px-6 py-3 rounded-full font-medium hover:bg-warm/90 transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
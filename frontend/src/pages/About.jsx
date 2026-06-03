import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiHeart, FiStar, FiUsers, FiTruck, FiArrowRight } from 'react-icons/fi'

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
    <div className="bg-[#FAF9F7] min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[55vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.img 
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600"
            alt="About us"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 40%' }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="text-[#D4A574] text-[11px] tracking-[0.3em] uppercase font-['Inter',_sans-serif] font-medium mb-3 block">
              Our Story
            </span>
            <h1 className="font-['Cormorant_Garamond',_Georgia,_serif] font-light text-5xl md:text-6xl lg:text-7xl text-white tracking-tight mb-4">
              About LUXE HOME
            </h1>
            <div className="w-12 h-px bg-[#D4A574] mx-auto mb-5" />
            <p className="text-white/85 text-base md:text-lg font-light max-w-2xl mx-auto font-['Inter',_sans-serif] tracking-wide">
              Creating beautiful, sustainable home essentials for modern living
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-[#D4A574] text-[11px] tracking-[0.3em] uppercase font-['Inter',_sans-serif] font-medium">
                The Art of Home
              </span>
              <h2 className="font-['Cormorant_Garamond',_Georgia,_serif] font-light text-4xl md:text-5xl text-[#2C2C2C] mt-3 mb-4">
                Our Story
              </h2>
              <div className="w-12 h-px bg-[#D4A574] mb-6" />
              <p className="text-gray-500 leading-relaxed mb-5 text-base font-['Inter',_sans-serif] font-light tracking-wide">
                Founded in 2020, LUXE HOME was born from a simple idea: to create beautiful, 
                high-quality home essentials that don't compromise on sustainability or style.
              </p>
              <p className="text-gray-500 leading-relaxed text-base font-['Inter',_sans-serif] font-light tracking-wide">
                Today, we're proud to offer a curated collection of bedding, bath, and home decor 
                that brings comfort and elegance to homes around the world. Every product is thoughtfully 
                designed and ethically crafted with the finest materials.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800"
                  alt="Our story"
                  className="rounded-2xl shadow-lg w-full"
                />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#D4A574]/10 rounded-2xl -z-10" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-[#FAF9F7]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[#D4A574] text-[11px] tracking-[0.3em] uppercase font-['Inter',_sans-serif] font-medium">
              What We Believe
            </span>
            <h2 className="font-['Cormorant_Garamond',_Georgia,_serif] font-light text-4xl md:text-5xl text-[#2C2C2C] mt-3 mb-4">
              Our Values
            </h2>
            <div className="w-12 h-px bg-[#D4A574] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-5 shadow-sm group-hover:shadow-md transition-all duration-300">
                  <value.icon className="w-7 h-7 text-[#D4A574]" />
                </div>
                <h3 className="font-['Cormorant_Garamond',_Georgia,_serif] text-xl text-[#2C2C2C] mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-400 text-sm font-['Inter',_sans-serif] leading-relaxed px-2">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[#D4A574] text-[11px] tracking-[0.3em] uppercase font-['Inter',_sans-serif] font-medium">
              Behind The Brand
            </span>
            <h2 className="font-['Cormorant_Garamond',_Georgia,_serif] font-light text-4xl md:text-5xl text-[#2C2C2C] mt-3 mb-4">
              Meet the Team
            </h2>
            <div className="w-12 h-px bg-[#D4A574] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center group"
              >
                <div className="relative inline-block">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-36 h-36 rounded-full mx-auto object-cover mb-5 shadow-md group-hover:shadow-lg transition-all duration-300 ring-2 ring-transparent group-hover:ring-[#D4A574]/30"
                  />
                </div>
                <h3 className="font-['Cormorant_Garamond',_Georgia,_serif] text-xl text-[#2C2C2C] mb-1">
                  {member.name}
                </h3>
                <p className="text-[#D4A574] text-xs tracking-[0.15em] uppercase font-['Inter',_sans-serif] font-medium mb-2">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

 {/* CTA Section */}
<section className="py-24 bg-charcoal relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-r from-[#D4A574]/5 to-transparent" />
  <div className="container mx-auto px-4 text-center relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <span className="text-[#D4A574] text-[11px] tracking-[0.3em] uppercase font-['Inter',_sans-serif] font-medium">
        Join Our Journey
      </span>
      <h2 className="font-['Cormorant_Garamond',_Georgia,_serif] font-light text-4xl md:text-5xl text-white mt-3 mb-4">
        Join Our Community
      </h2>
      <div className="w-12 h-px bg-[#D4A574] mx-auto mb-6" />
      <p className="text-white/80 text-base mb-10 max-w-lg mx-auto font-['Inter',_sans-serif] font-light tracking-wide">
        Sign up for exclusive offers and design inspiration
      </p>
      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input 
          type="email" 
          placeholder="Your email address"
          className="flex-1 px-6 py-3.5 bg-white/10 border border-white/30 rounded-full text-white placeholder:text-white/50 focus:outline-none focus:border-[#D4A574] focus:bg-white/20 transition-all duration-300 font-['Inter',_sans-serif] text-sm"
        />
        <button className="group bg-[#D4A574] text-white/70 px-8 py-3.5 text-[11px] tracking-[0.2em] uppercase hover:bg-amber-500 cursor-pointer transition-all duration-300 font-['Inter',_sans-serif] font-medium rounded-full inline-flex items-center justify-center gap-2">
          Subscribe
          <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  </div>
</section>
    </div>
  )
}

export default About
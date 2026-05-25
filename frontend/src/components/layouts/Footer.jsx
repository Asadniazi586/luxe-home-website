import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart, FiInstagram, FiTwitter, FiFacebook, FiMail, FiMapPin, FiPhone, FiAward } from 'react-icons/fi'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'SHOP',
      links: [
        { name: 'All Products', path: '/shop' },
        { name: 'Bedding', path: '/shop?category=bedding' },
        { name: 'Bath', path: '/shop?category=bath' },
        { name: 'Home Decor', path: '/shop?category=decor' },
      
      ]
    },
    {
      title: 'SUPPORT',
      links: [
        { name: 'FAQs', path: '/faqs' },
        { name: 'Returns', path: '/returns' },
        { name: 'Shipping', path: '/shipping' },
        { name: 'Contact', path: '/contact' },
      ]
    },
    {
      title: 'COMPANY',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Sustainability', path: '/sustainability' },
        { name: 'Press', path: '/press' },
        { name: 'Careers', path: '/careers' },
      ]
    },
    {
      title: 'LEGAL',
      links: [
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Accessibility', path: '/accessibility' },
        { name: 'Cookie Policy', path: '/cookies' },
      ]
    },
  ]

  const socialIcons = [
    { icon: FiInstagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: FiFacebook, href: 'https://facebook.com', label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:text-sky-500' },
  ]

  const paymentIcons = [
    '💳', '💎', '🪙', '🔒'
  ]

  return (
    <footer className="bg-charcoal text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-xs font-semibold text-warm mb-4 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      to={link.path}
                      className="text-gray-400 text-xs hover:text-warm transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-10" />

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="text-center lg:text-left">
            <h2 className="text-xl tracking-wide font-light text-warm">LUXE HOME</h2>
            <p className="text-gray-500 text-xs mt-1">Premium bedding & home decor</p>
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-2">
              <FiMapPin className="w-3.5 h-3.5 text-warm" />
              <span className="text-gray-400 text-xs">New York, NY</span>
            </div>
            <div className="flex items-center gap-2">
              <FiPhone className="w-3.5 h-3.5 text-warm" />
              <a href="tel:+15551234567" className="text-gray-400 text-xs hover:text-warm transition">+1 (555) 123-4567</a>
            </div>
            <div className="flex items-center gap-2">
              <FiMail className="w-3.5 h-3.5 text-warm" />
              <a href="mailto:hello@luxehome.com" className="text-gray-400 text-xs hover:text-warm transition">hello@luxehome.com</a>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            {socialIcons.map((social, idx) => (
              <motion.a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className={`text-gray-400 ${social.color} transition-all duration-300`}
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Payment & Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Payment Icons */}
            <div className="flex gap-3 order-2 md:order-1">
              {paymentIcons.map((icon, idx) => (
                <span key={idx} className="text-lg opacity-60">{icon}</span>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-center order-1 md:order-2">
              <p className="text-gray-500 text-xs flex items-center justify-center gap-1">
                Made with <FiHeart className="w-3 h-3 text-red-500 animate-pulse" /> by LUXE HOME
              </p>
              <p className="text-gray-500 text-xs mt-1">© {currentYear} All rights reserved.</p>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-2 order-3">
              <FiAward className="w-4 h-4 text-warm" />
              <span className="text-gray-500 text-xs">Premium Quality Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
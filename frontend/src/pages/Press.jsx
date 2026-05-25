import React from 'react'
import { motion } from 'framer-motion'
import { FiExternalLink, FiCalendar, FiUser, FiBookmark } from 'react-icons/fi'

const Press = () => {
  const pressArticles = [
    {
      id: 1,
      title: 'LUXE HOME Named Best Sustainable Bedding Brand 2024',
      date: 'March 15, 2024',
      author: 'Sarah Johnson',
      source: 'Home & Living Magazine',
      excerpt: 'LUXE HOME has been recognized for its commitment to organic materials and eco-friendly manufacturing processes...',
      link: '#',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600'
    },
    {
      id: 2,
      title: 'The Future of Sleep: How LUXE HOME is Revolutionizing Bedding',
      date: 'February 10, 2024',
      author: 'Michael Chen',
      source: 'Tech Home Review',
      excerpt: 'With innovative fabrics and sustainable practices, LUXE HOME is changing the way we think about comfort...',
      link: '#',
      image: 'https://images.unsplash.com/photo-1584646098378-0874589d76fe?w=600'
    },
    {
      id: 3,
      title: 'LUXE HOME Expands Collection with New Eco-Friendly Line',
      date: 'January 5, 2024',
      author: 'Emma Davis',
      source: 'Design Weekly',
      excerpt: 'The new collection features organic cotton sheets and bamboo-based fabrics that are both luxurious and sustainable...',
      link: '#',
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=600'
    },
    {
      id: 4,
      title: 'Interview: The Vision Behind LUXE HOME',
      date: 'December 12, 2023',
      author: 'James Wilson',
      source: 'Entrepreneur Today',
      excerpt: 'Founder shares insights on building a sustainable brand in the competitive home decor market...',
      link: '#',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600'
    }
  ]

  const mediaKits = [
    { name: 'Brand Guidelines', size: '2.5 MB', type: 'PDF' },
    { name: 'Logo Assets', size: '1.8 MB', type: 'ZIP' },
    { name: 'Press Photos', size: '5.2 MB', type: 'ZIP' },
    { name: 'Company Fact Sheet', size: '0.9 MB', type: 'PDF' },
  ]

  return (
    <div className="bg-cream min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-charcoal text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">Press & Media</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Latest news, articles, and media resources</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Featured Press */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-charcoal mb-3">In the News</h2>
            <div className="w-16 h-px bg-warm mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {pressArticles.map((article, index) => (
              <div key={article.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-warm/90 text-white text-xs px-2 py-1 rounded">
                    Featured
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><FiCalendar className="w-3 h-3" /> {article.date}</span>
                    <span className="flex items-center gap-1"><FiUser className="w-3 h-3" /> {article.author}</span>
                  </div>
                  <h3 className="text-lg font-medium text-charcoal mb-2">{article.title}</h3>
                  <p className="text-gray-500 text-sm mb-2">{article.source}</p>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{article.excerpt}</p>
                  <a 
                    href={article.link} 
                    className="inline-flex items-center gap-1 text-warm text-sm font-medium hover:gap-2 transition-all"
                  >
                    Read Full Article <FiExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Media Kit Section */}
          <div className="bg-warm/10 rounded-2xl p-8 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-light text-charcoal mb-2">Media Kit</h2>
              <p className="text-gray-500 text-sm">Download resources for press use</p>
              <div className="w-12 h-px bg-warm mx-auto mt-3" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {mediaKits.map((kit, index) => (
                <div key={index} className="bg-white rounded-lg p-4 text-center hover:shadow-md transition">
                  <div className="w-10 h-10 mx-auto bg-warm/20 rounded-lg flex items-center justify-center mb-2">
                    <FiBookmark className="w-5 h-5 text-warm" />
                  </div>
                  <h4 className="font-medium text-charcoal text-sm">{kit.name}</h4>
                  <p className="text-gray-400 text-xs mt-1">{kit.size} • {kit.type}</p>
                  <button className="mt-2 text-warm text-xs font-medium hover:underline">Download</button>
                </div>
              ))}
            </div>
          </div>

          {/* Press Contact */}
          <div className="text-center">
            <h3 className="text-xl font-light text-charcoal mb-3">Press Inquiries</h3>
            <p className="text-gray-500 text-sm mb-4">For media inquiries, please contact our press team</p>
            <a 
              href="mailto:press@luxehome.com" 
              className="inline-block bg-charcoal text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-charcoal-light transition"
            >
              press@luxehome.com
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Press
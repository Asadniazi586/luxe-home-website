import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiCheck, FiX, FiSettings, FiInfo } from 'react-icons/fi'

const CookiePolicy = () => {
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false,
  })

  const cookieTypes = [
    {
      id: 'necessary',
      name: 'Necessary Cookies',
      required: true,
      description: 'These cookies are essential for the website to function properly. They enable basic features like page navigation and access to secure areas.',
      examples: ['Session management', 'Authentication', 'Security']
    },
    {
      id: 'functional',
      name: 'Functional Cookies',
      required: false,
      description: 'These cookies enhance the functionality of our website by remembering your preferences and choices.',
      examples: ['Language preferences', 'Location settings', 'Remember me']
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      required: false,
      description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
      examples: ['Page views', 'Bounce rate', 'User journey']
    },
    {
      id: 'marketing',
      name: 'Marketing Cookies',
      required: false,
      description: 'These cookies track your online activity to help us deliver more relevant advertising and personalized content.',
      examples: ['Ad targeting', 'Social media integration', 'Retargeting']
    }
  ]

  const handlePreferenceChange = (id) => {
    if (id !== 'necessary') {
      setPreferences(prev => ({ ...prev, [id]: !prev[id] }))
    }
  }

  const savePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences))
    alert('Your preferences have been saved')
  }

  return (
    <div className="bg-cream min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-charcoal text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">Cookie Policy</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Last updated: January 1, 2024</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Introduction */}
          <div className="mb-8">
            <h2 className="text-2xl font-light text-charcoal mb-3">What Are Cookies?</h2>
            <div className="w-12 h-px bg-warm mb-4" />
            <p className="text-gray-600 leading-relaxed mb-4">
              Cookies are small text files that are placed on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences, 
              understanding how you use our site, and showing you relevant content.
            </p>
          </div>

          {/* Cookie Settings */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="bg-warm/10 p-6 border-b border-gray-100">
              <h2 className="text-xl font-light text-charcoal mb-2">Your Cookie Preferences</h2>
              <p className="text-gray-500 text-sm">Choose which cookies you want to accept</p>
            </div>
            
            <div className="divide-y divide-gray-100">
              {cookieTypes.map((cookie) => (
                <div key={cookie.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-charcoal">{cookie.name}</h3>
                        {cookie.required && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">Required</span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm mb-2">{cookie.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {cookie.examples.map((example, idx) => (
                          <span key={idx} className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{example}</span>
                        ))}
                      </div>
                    </div>
                    <div className="ml-4">
                      {cookie.required ? (
                        <div className="w-10 h-5 bg-warm rounded-full flex items-center px-0.5">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handlePreferenceChange(cookie.id)}
                          className={`w-10 h-5 rounded-full transition-colors duration-300 flex items-center ${
                            preferences[cookie.id] ? 'bg-warm' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                            preferences[cookie.id] ? 'translate-x-5' : 'translate-x-0.5'
                          }`} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 p-6 flex justify-end">
              <button
                onClick={savePreferences}
                className="bg-charcoal text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-charcoal-light transition"
              >
                Save Preferences
              </button>
            </div>
          </div>

          {/* How We Use Cookies */}
          <div className="mb-8">
            <h2 className="text-2xl font-light text-charcoal mb-3">How We Use Cookies</h2>
            <div className="w-12 h-px bg-warm mb-4" />
            <p className="text-gray-600 leading-relaxed mb-4">
              We use cookies to improve your browsing experience, analyze site traffic, 
              personalize content, and serve targeted advertisements. You can control 
              your cookie preferences at any time through our cookie settings panel.
            </p>
          </div>

          {/* Managing Cookies */}
          <div className="mb-8">
            <h2 className="text-2xl font-light text-charcoal mb-3">Managing Cookies</h2>
            <div className="w-12 h-px bg-warm mb-4" />
            <p className="text-gray-600 leading-relaxed mb-4">
              Most web browsers allow you to control cookies through their settings. 
              You can usually find these settings in the "Options" or "Preferences" menu of your browser.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {['Chrome', 'Firefox', 'Safari', 'Edge'].map(browser => (
                <div key={browser} className="bg-gray-50 rounded-lg p-3 text-center">
                  <span className="text-sm text-charcoal">{browser}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-warm/10 rounded-2xl p-6 text-center">
            <FiInfo className="w-8 h-8 text-warm mx-auto mb-3" />
            <h3 className="text-lg font-medium text-charcoal mb-2">Questions About Cookies?</h3>
            <p className="text-gray-500 text-sm mb-4">If you have any questions about our use of cookies, please contact us.</p>
            <a href="mailto:privacy@luxehome.com" className="text-warm text-sm font-medium hover:underline">
              privacy@luxehome.com
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CookiePolicy
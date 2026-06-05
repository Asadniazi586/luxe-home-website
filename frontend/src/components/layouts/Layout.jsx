import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = ({ children }) => {
  const location = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname])

  // Check if on home page
  const isHomePage = location.pathname === '/'

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <main className={`flex-grow ${isHomePage ? 'pt-0 md:pt-16' : 'pt-0 md:pt-16'}`}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
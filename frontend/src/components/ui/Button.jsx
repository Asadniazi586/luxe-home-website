import React from 'react'

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const variants = {
    primary: 'bg-charcoal text-white hover:bg-charcoal-light',
    secondary: 'border border-charcoal text-charcoal hover:bg-charcoal hover:text-white',
    outline: 'border border-gray-300 text-gray-600 hover:border-warm hover:text-warm',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  return (
    <button
      className={`rounded-full font-medium transition-all duration-300 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
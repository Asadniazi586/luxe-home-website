import React from 'react'
import { FiStar } from 'react-icons/fi'

const Rating = ({ rating, reviewCount, size = 'sm' }) => {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={`${sizes[size]} ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
      {reviewCount && <span className="text-xs text-gray-500">({reviewCount})</span>}
    </div>
  )
}

export default Rating
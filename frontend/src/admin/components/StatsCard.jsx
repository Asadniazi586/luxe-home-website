import React from 'react'
import { motion } from 'framer-motion'

const StatsCard = ({ title, value, icon: Icon, color, change }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm p-6 border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <p className="text-2xl font-semibold text-gray-800">{value}</p>
          {change && (
            <p className={`text-xs mt-2 ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change > 0 ? `+${change}%` : `${change}%`} from last month
            </p>
          )}
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
    </motion.div>
  )
}

export default StatsCard
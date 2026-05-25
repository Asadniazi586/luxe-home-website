import React, { useState, useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

const AnimatedCounter = ({ end, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const started = useRef(false)

  useEffect(() => {
    if (inView && !started.current) {
      started.current = true
      let start = 0
      const increment = end / (duration * 60)
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)
      return () => clearInterval(timer)
    }
  }, [inView, end, duration])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

export default AnimatedCounter
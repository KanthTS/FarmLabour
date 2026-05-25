import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export default function AnimatedCounter({ end, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    if (!inView) return
    setCount(0)
    const startTime = performance.now()
    const step = (now) => {
      const progress = Math.min((now - startTime) / (duration * 1000), 1)
      const eased = 1 - (1 - progress) ** 3
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, end, duration])

  return (
    <span ref={ref} className="home-stat__num">
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

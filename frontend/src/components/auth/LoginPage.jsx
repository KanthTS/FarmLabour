import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import LoginBackground from './LoginBackground'
import LoginHeroVisual from './LoginHeroVisual'
import LoginCard from './LoginCard'
import './login.css'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function LoginPage() {
  useEffect(() => {
    const prevBody = document.body.style.overflow
    const prevHtml = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevBody
      document.documentElement.style.overflow = prevHtml
    }
  }, [])

  return (
    <section className="auth-signin auth-signin--fixed">
      <LoginBackground />
      <div className="auth-signin__shell">
        <div className="auth-signin__top">
          <Link to="/" className="auth-signin__back">
            ← Farm Labour
          </Link>
        </div>

        <motion.div
          className="auth-signin__grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <LoginHeroVisual containerVariants={containerVariants} itemVariants={itemVariants} />
          <LoginCard containerVariants={containerVariants} itemVariants={itemVariants} />
        </motion.div>
      </div>
    </section>
  )
}

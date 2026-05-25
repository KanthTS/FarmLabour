import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import HomeSplitSection from './HomeSplitSection'
import imgEmpower from '../../images/home-empower.jpg'

export default function CTASection() {
  const nav = useNavigate()

  return (
    <HomeSplitSection
      id="get-started"
      badge="Join today"
      title="Empowering Agriculture"
      titleAccent="Through Technology"
      subtitle="Join thousands of farmers and labourers building a stronger rural workforce. Start hiring or finding work today."
      image={imgEmpower}
      imageAlt="Empowering agriculture through technology"
      className="home-split--cta"
    >
      <div className="home-hero__cta" style={{ marginTop: '1.5rem' }}>
        <motion.button
          type="button"
          className="home-glow-btn home-glow-btn--primary"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => nav('/signup')}
        >
          Get Started Free
        </motion.button>
        <motion.button
          type="button"
          className="home-glow-btn home-glow-btn--outline"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => nav('/signin')}
        >
          Sign In
        </motion.button>
      </div>
    </HomeSplitSection>
  )
}

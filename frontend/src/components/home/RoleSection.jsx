import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import HomeSplitSection from './HomeSplitSection'
import imgRole from '../../images/home-role-panel.jpg'

export default function RoleSection() {
  const nav = useNavigate()

  return (
    <HomeSplitSection
      id="join-platform"
      badge="Farmer Labour Portal"
      title="Empowering Agriculture"
      titleAccent="Through Technology"
      subtitle="Smart jobs. Trusted people. Better tomorrow. Choose your role and join the platform today."
      image={imgRole}
      imageAlt="Farmer and labourer connecting on the platform"
      className="home-split--role"
    >
      <div className="home-hero__cta" style={{ marginTop: '1.5rem' }}>
        <motion.button
          type="button"
          className="home-glow-btn home-glow-btn--primary"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => nav('/signup')}
        >
          I am a Farmer
        </motion.button>
        <motion.button
          type="button"
          className="home-glow-btn home-glow-btn--outline"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => nav('/signup')}
        >
          I am a Labourer
        </motion.button>
      </div>
    </HomeSplitSection>
  )
}

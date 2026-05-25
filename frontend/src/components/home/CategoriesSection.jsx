import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import HomeSplitSection from './HomeSplitSection'
import imgCategories from '../../images/home-categories-panel.jpg'

export default function CategoriesSection() {
  const nav = useNavigate()

  return (
    <HomeSplitSection
      id="job-categories"
      badge="Farm work types"
      title="Popular Job"
      titleAccent="Categories"
      subtitle="Harvesting, planting, irrigation, tractor work, pesticide spraying, dairy, fencing — find the right job for every season."
      image={imgCategories}
      imageAlt="Popular job categories for farm work"
      reverse
      className="home-split--categories"
    >
      <motion.button
        type="button"
        className="home-glow-btn home-glow-btn--primary"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => nav('/signup')}
        style={{ marginTop: '1.5rem' }}
      >
        Browse Jobs
      </motion.button>
    </HomeSplitSection>
  )
}

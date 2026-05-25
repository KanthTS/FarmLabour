import { motion } from 'framer-motion'
import AnimatedCounter from './AnimatedCounter'
import { usePlatformStats } from '../../hooks/usePlatformStats'

export default function StatsSection() {
  const { stats } = usePlatformStats()

  const items = [
    { label: 'Total Farmers', end: stats.farmers, suffix: '+' },
    { label: 'Total Labourers', end: stats.labourers, suffix: '+' },
    { label: 'Jobs Posted', end: stats.jobsPosted, suffix: '+' },
    { label: 'Successful Hirings', end: stats.successfulHirings, suffix: '+' },
  ]

  return (
    <section className="home-section home-stats">
      <div className="home-container">
        <motion.div
          className="home-section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="home-hero__badge">Growing network</span>
          <h2 className="home-section-title">Platform at a Glance</h2>
          <p className="home-section-sub">
            Real numbers from farmers and labourers joining Farm Labour every day.
          </p>
        </motion.div>
        <div className="home-stats__grid">
          {items.map((s, i) => (
            <motion.div
              key={s.label}
              className="home-stats__card home-glass"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(34, 197, 94, 0.2)' }}
            >
              <AnimatedCounter end={s.end} suffix={s.suffix} />
              <span className="home-stat__label">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

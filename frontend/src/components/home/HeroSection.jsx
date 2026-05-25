import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import imgHero from '../../images/home-hero.png'
import HomeHeroStats from './HomeHeroStats'

export default function HeroSection({ refreshKey = 0 }) {
  const nav = useNavigate()

  return (
    <section className="home-hero home-section home-section--hero">
      <div className="home-container home-split__grid">
        <motion.div
          className="home-split__content"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65 }}
        >
          <span className="home-hero__badge">Rural empowerment · Smart agriculture</span>
          <h1 className="home-split__title">
            Connecting Farmers with{' '}
            <span className="home-hero__title-accent">Skilled Labour</span>
          </h1>
          <p className="home-split__subtitle">
            Post jobs, find skilled labourers and grow together. Reach nearby workers
            with transparent wages and trusted profiles.
          </p>
          <div className="home-hero__cta">
            <motion.button
              type="button"
              className="home-glow-btn home-glow-btn--primary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => nav('/signup')}
            >
              Post a Job →
            </motion.button>
            <motion.button
              type="button"
              className="home-glow-btn home-glow-btn--outline"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => nav('/signup')}
            >
              Find Work →
            </motion.button>
          </div>
          <HomeHeroStats refreshKey={refreshKey} />
        </motion.div>

        <motion.figure
          className="home-split__figure"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          <div className="home-split__frame home-glass">
            <img
              src={imgHero}
              alt="Connecting farmers with skilled labour"
              className="home-split__img"
            />
            <div className="home-split__shine" aria-hidden />
          </div>
        </motion.figure>
      </div>
    </section>
  )
}

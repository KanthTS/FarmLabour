import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import imgHowItWorks from '../../images/home-how-it-works.png'

export default function HowItWorksSection() {
  const nav = useNavigate()

  return (
    <section id="how-it-works" className="home-section home-how-split">
      <div className="home-container home-split__grid">
        <motion.div
          className="home-split__content"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.55 }}
        >
          <span className="home-hero__badge">Simple 4-step process</span>
          <h2 className="home-split__title">
            How It <span className="home-hero__title-accent">Works</span>
          </h2>
          <p className="home-split__subtitle">
            Farmers post jobs, labourers apply, work gets assigned, and everyone earns —
            four clear steps on one platform.
          </p>
          <motion.button
            type="button"
            className="home-glow-btn home-glow-btn--primary"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => nav('/signup')}
            style={{ marginTop: '1.5rem' }}
          >
            Get Started →
          </motion.button>
        </motion.div>

        <motion.figure
          className="home-split__figure home-how-split__figure"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          <div className="home-how-showcase__frame">
            <img
              src={imgHowItWorks}
              alt="How it works: Post a Job, Labourers Apply, Work Assigned, Work and Earn"
              className="home-how-showcase__img"
            />
          </div>
        </motion.figure>
      </div>
    </section>
  )
}

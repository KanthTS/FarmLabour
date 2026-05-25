import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function HomeImagePanel({
  id,
  badge,
  title,
  description,
  image,
  imageAlt,
  imageLabel,
  ctaText,
  ctaPath = '/signup',
  reverse = false,
}) {
  const nav = useNavigate()

  return (
    <section id={id} className={`home-showcase home-section ${reverse ? 'home-showcase--reverse' : ''}`}>
      <div className="home-container home-showcase__grid">
        <motion.div
          className="home-showcase__content"
          initial={{ opacity: 0, x: reverse ? 24 : -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
        >
          <span className="home-showcase__badge">{badge}</span>
          <h2 className="home-showcase__title">{title}</h2>
          <p className="home-showcase__desc">{description}</p>
          <motion.button
            type="button"
            className="home-glow-btn home-glow-btn--primary"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => nav(ctaPath)}
          >
            {ctaText}
          </motion.button>
        </motion.div>

        <motion.figure
          className="home-showcase__figure"
          initial={{ opacity: 0, x: reverse ? -24 : 24, rotateY: reverse ? 8 : -8 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="home-showcase__frame home-glass">
            <img src={image} alt={imageAlt} className="home-showcase__img" />
            <div className="home-showcase__shine" />
            <figcaption className="home-showcase__caption">{imageLabel}</figcaption>
          </div>
        </motion.figure>
      </div>
    </section>
  )
}

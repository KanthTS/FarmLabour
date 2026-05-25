import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function HomeVisualBlock({
  id,
  image,
  alt,
  primaryCta,
  secondaryCta,
  className = '',
}) {
  const nav = useNavigate()

  return (
    <section id={id} className={`home-visual-block home-section ${className}`}>
      <div className="home-container">
        <motion.figure
          className="home-visual-block__figure"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55 }}
        >
          <div className="home-visual-block__frame home-glass">
            <img src={image} alt={alt} className="home-visual-block__img" />
            <div className="home-visual-block__shine" aria-hidden />
          </div>
          {(primaryCta || secondaryCta) && (
            <div className="home-visual-block__actions">
              {primaryCta && (
                <motion.button
                  type="button"
                  className="home-glow-btn home-glow-btn--primary"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => nav(primaryCta.path)}
                >
                  {primaryCta.label}
                </motion.button>
              )}
              {secondaryCta && (
                <motion.button
                  type="button"
                  className="home-glow-btn home-glow-btn--outline"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => nav(secondaryCta.path)}
                >
                  {secondaryCta.label}
                </motion.button>
              )}
            </div>
          )}
        </motion.figure>
      </div>
    </section>
  )
}

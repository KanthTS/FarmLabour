import { motion } from 'framer-motion'

export default function HomeStackSection({
  id,
  image,
  imageAlt,
  badge,
  title,
  titleAccent,
  subtitle,
  children,
  className = '',
}) {
  return (
    <section id={id} className={`home-stacked home-section ${className}`}>
      <div className="home-container">
        <motion.figure
          className="home-stacked__figure"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55 }}
        >
          <div className="home-stacked__frame">
            <img src={image} alt={imageAlt} className="home-stacked__img" />
          </div>
        </motion.figure>

        <motion.div
          className="home-stacked__content"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          {badge && <span className="home-hero__badge">{badge}</span>}
          <h2 className="home-stacked__title">
            {title}
            {titleAccent && (
              <>
                {' '}
                <span className="home-hero__title-accent">{titleAccent}</span>
              </>
            )}
          </h2>
          {subtitle && <p className="home-stacked__subtitle">{subtitle}</p>}
          {children}
        </motion.div>
      </div>
    </section>
  )
}

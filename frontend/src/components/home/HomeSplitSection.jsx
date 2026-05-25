import { motion } from 'framer-motion'

export default function HomeSplitSection({
  id,
  badge,
  title,
  titleAccent,
  subtitle,
  image,
  imageAlt,
  reverse = false,
  children,
  className = '',
  asDiv = false,
}) {
  const Tag = asDiv ? 'div' : 'section'
  return (
    <Tag
      id={asDiv ? undefined : id}
      className={`home-split ${asDiv ? '' : 'home-section'} ${reverse ? 'home-split--reverse' : ''} ${className}`}
    >
      <div className="home-container home-split__grid">
        <motion.div
          className="home-split__content"
          initial={{ opacity: 0, x: reverse ? 24 : -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.55 }}
        >
          {badge && <span className="home-hero__badge">{badge}</span>}
          <h2 className="home-split__title">
            {title}
            {titleAccent && (
              <>
                {' '}
                <span className="home-hero__title-accent">{titleAccent}</span>
              </>
            )}
          </h2>
          {subtitle && <p className="home-split__subtitle">{subtitle}</p>}
          {children}
        </motion.div>

        <motion.figure
          className="home-split__figure"
          initial={{ opacity: 0, x: reverse ? -24 : 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          <div className="home-split__frame home-glass">
            <img src={image} alt={imageAlt} className="home-split__img" />
            <div className="home-split__shine" aria-hidden />
          </div>
        </motion.figure>
      </div>
    </Tag>
  )
}

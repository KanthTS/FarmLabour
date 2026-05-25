import { motion } from 'framer-motion'

export default function LoginImageCard({ src, title, subtitle, delay = 0 }) {
  return (
    <motion.figure
      className="login-image-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, delay }}
    >
      <div className="login-image-card__border">
        <img src={src} alt={title} className="login-image-card__img" />
      </div>
      <figcaption className="login-image-card__caption">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </figcaption>
    </motion.figure>
  )
}

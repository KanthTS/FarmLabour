import { motion } from 'framer-motion'

const particles = ['🌾', '🍃', '🌱', '🚜', '🌾', '🍃', '🌱']

export default function HomeBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 60% at 50% -20%, rgba(34, 197, 94, 0.22), transparent 55%), radial-gradient(ellipse 50% 40% at 100% 50%, rgba(234, 179, 8, 0.08), transparent), radial-gradient(ellipse 40% 30% at 0% 80%, rgba(22, 163, 74, 0.12), transparent), linear-gradient(180deg, #030712 0%, #0f172a 50%, #030712 100%)',
        }}
      />
      {particles.map((icon, i) => (
        <motion.span
          key={i}
          className="absolute text-lg opacity-30 sm:text-2xl"
          style={{
            left: `${8 + (i * 13) % 85}%`,
            top: `${5 + (i * 17) % 90}%`,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.15, 0.45, 0.15],
            rotate: [0, 15, 0],
          }}
          transition={{
            duration: 5 + i * 0.7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        >
          {icon}
        </motion.span>
      ))}
      <motion.div
        className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-[100px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-amber-500/10 blur-[90px]"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
      />
    </div>
  )
}

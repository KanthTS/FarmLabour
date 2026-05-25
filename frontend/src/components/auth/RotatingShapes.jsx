import { motion } from 'framer-motion'

export default function RotatingShapes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -left-24 top-[12%] h-72 w-72 rounded-[40%] border border-purple-500/30 bg-gradient-to-br from-purple-600/20 to-transparent blur-sm"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotate: 360, y: [0, 24, 0] }}
        transition={{ rotate: { duration: 28, repeat: Infinity, ease: 'linear' }, y: { duration: 8, repeat: Infinity } }}
      />
      <motion.div
        className="absolute -right-16 bottom-[18%] h-56 w-56 rounded-full border-2 border-cyan-400/25 bg-cyan-500/10 shadow-[0_0_60px_rgba(34,211,238,0.25)]"
        animate={{ rotate: -360, scale: [1, 1.08, 1] }}
        transition={{ rotate: { duration: 22, repeat: Infinity, ease: 'linear' }, scale: { duration: 6, repeat: Infinity } }}
      />
      <motion.div
        className="absolute left-[38%] top-[8%] h-32 w-32 rotate-45 border border-violet-400/40 bg-violet-600/10"
        animate={{ rotate: [45, 225, 45], x: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[10%] left-[12%] h-40 w-40 rounded-3xl border border-blue-500/20 bg-gradient-to-tr from-blue-600/15 to-purple-600/10"
        style={{ transform: 'perspective(800px) rotateX(55deg)' }}
        animate={{ rotateZ: 360 }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

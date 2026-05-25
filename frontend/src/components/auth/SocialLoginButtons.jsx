import { motion } from 'framer-motion'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { FaMicrosoft } from 'react-icons/fa'

const providers = [
  { id: 'google', label: 'Google', icon: FcGoogle, className: 'hover:border-white/30' },
  { id: 'github', label: 'GitHub', icon: FaGithub, className: 'hover:border-white/30' },
  { id: 'microsoft', label: 'Microsoft', icon: FaMicrosoft, className: 'hover:border-white/30' },
]

export default function SocialLoginButtons({ onSocialClick }) {
  return (
    <div className="mt-6">
      <div className="relative flex items-center gap-3 py-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Or continue with
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
      <div className="mt-4 grid min-w-0 grid-cols-3 gap-2 sm:gap-3">
        {providers.map((p, i) => {
          const Icon = p.icon
          return (
            <motion.button
              key={p.id}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSocialClick(p.label)}
              className={`flex min-w-0 items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2 py-2.5 text-xs text-slate-300 backdrop-blur-md transition-colors sm:gap-2 sm:px-3 sm:text-sm ${p.className}`}
              aria-label={`Sign in with ${p.label}`}
            >
              <Icon className="shrink-0 text-lg" />
              <span className="truncate">{p.label}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

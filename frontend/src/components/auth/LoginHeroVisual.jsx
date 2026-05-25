import { motion } from 'framer-motion'
import { MdCheck } from 'react-icons/md'
import imgPostJob from '../../images/login-post-job.jpg'
import imgFindWork from '../../images/login-find-work.jpg'
import imgWorkflow from '../../images/login-workflow.jpg'
import imgEmpower from '../../images/login-empower.jpg'
import LoginImageCard from './LoginImageCard'

const images = [
  { src: imgPostJob, title: 'Post a Job', subtitle: 'For farmers' },
  { src: imgFindWork, title: 'Find Work', subtitle: 'For labour' },
  { src: imgWorkflow, title: 'Hire & Pay', subtitle: 'Full workflow' },
  { src: imgEmpower, title: 'Join Platform', subtitle: 'Get started' },
]

const perks = [
  'Post jobs or find daily farm work nearby',
  'Track applications and hires in one place',
  'Secure sign-in for farmers and workers',
]

export default function LoginHeroVisual({ containerVariants, itemVariants }) {
  return (
    <motion.aside
      className="auth-signin__visual auth-signin__visual--scroll"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="auth-signin__visual-inner">
        <motion.span className="auth-signin__badge" variants={itemVariants}>
          🌾 Farm Labour
        </motion.span>
        <motion.h2 variants={itemVariants}>
          Connecting farmers &amp; workers
        </motion.h2>
        <motion.p variants={itemVariants}>
          Sign in to manage jobs, applications, and hires on India&apos;s farm work network.
        </motion.p>

        <motion.ul className="auth-signin__perks" variants={containerVariants}>
          {perks.map((text) => (
            <motion.li key={text} variants={itemVariants}>
              <span className="auth-signin__perk-icon"><MdCheck /></span>
              {text}
            </motion.li>
          ))}
        </motion.ul>

        <motion.div className="auth-signin__images" variants={itemVariants}>
          {images.map((item, i) => (
            <LoginImageCard key={item.title} {...item} delay={0.08 + i * 0.06} />
          ))}
        </motion.div>
      </div>
    </motion.aside>
  )
}

import { motion } from 'framer-motion'
import { MdCheck } from 'react-icons/md'
import imgPostJob from '../../images/home-post-job.jpg'
import imgFindWork from '../../images/home-find-work.jpg'
import imgWorkflow from '../../images/home-workflow.jpg'
import imgEmpower from '../../images/home-empower.jpg'
import LoginImageCard from './LoginImageCard'

const images = [
  { src: imgPostJob, title: 'Post a Job', subtitle: 'For farmers' },
  { src: imgFindWork, title: 'Find Work', subtitle: 'For labour' },
  { src: imgWorkflow, title: 'Hire & Pay', subtitle: 'Full workflow' },
  { src: imgEmpower, title: 'Get Started', subtitle: 'Join free' },
]

const perks = [
  'Free to sign up — start in under a minute',
  'Connect with verified farmers and workers',
  'Manage jobs and applications from your profile',
]

export default function SignUpHeroVisual({ containerVariants, itemVariants }) {
  return (
    <motion.aside
      className="auth-signin__visual"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.span className="auth-signin__badge" variants={itemVariants}>
        🌾 Farm Labour
      </motion.span>
      <motion.h2 variants={itemVariants}>
        Join India&apos;s farm work network
      </motion.h2>
      <motion.p variants={itemVariants}>
        Post jobs as a farmer or find daily farm work as labour — all in one place.
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
    </motion.aside>
  )
}

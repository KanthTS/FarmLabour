import { motion } from 'framer-motion'
import imgFarmer from '../../images/home-hero.png'
import imgLabour from '../../images/home-role-panel.jpg'

export default function SignUpBackground() {
  return (
    <div className="signup-bg" aria-hidden>
      <div className="signup-bg__gradient" />
      <div className="signup-bg__orb signup-bg__orb--1" />
      <div className="signup-bg__orb signup-bg__orb--2" />

      <motion.div
        className="signup-bg__visual signup-bg__visual--1"
        animate={{ y: [0, -16, 0], rotateZ: [-2, 2, -2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="signup-bg__frame">
          <img src={imgFarmer} alt="" />
        </div>
      </motion.div>

      <motion.div
        className="signup-bg__visual signup-bg__visual--2"
        animate={{ y: [0, 14, 0], rotateZ: [2, -2, 2] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <div className="signup-bg__frame">
          <img src={imgLabour} alt="" />
        </div>
      </motion.div>
    </div>
  )
}

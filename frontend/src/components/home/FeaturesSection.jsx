import { motion } from 'framer-motion'
import {
  MdPostAdd,
  MdLocationOn,
  MdLock,
  MdNotificationsActive,
  MdPhoneAndroid,
  MdAutoAwesome,
} from 'react-icons/md'
import HomeSplitSection from './HomeSplitSection'
import imgFeatures from '../../images/home-workflow.jpg'

const features = [
  { icon: MdPostAdd, title: 'Easy Job Posting', desc: 'Publish farm jobs with wages and dates in under 2 minutes.' },
  { icon: MdLocationOn, title: 'Nearby Labour Search', desc: 'Match workers close to your fields for faster arrival.' },
  { icon: MdLock, title: 'Secure Communication', desc: 'Chat and share details safely within the platform.' },
  { icon: MdNotificationsActive, title: 'Real-time Updates', desc: 'Instant alerts on applications, hires, and job status.' },
  { icon: MdPhoneAndroid, title: 'Mobile Friendly', desc: 'Designed for smartphones used in rural areas.' },
  { icon: MdAutoAwesome, title: 'Smart Matching System', desc: 'Skills and location-based pairing for better fits.' },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="home-section home-split--features">
      <div className="home-container">
        <HomeSplitSection
          asDiv
          badge="Built for the field"
          title="Platform"
          titleAccent="Features"
          subtitle="Technology that feels simple for farmers and labourers alike — post jobs, find work, and stay connected."
          image={imgFeatures}
          imageAlt="Farm labour platform features and workflow"
          reverse
          className="home-split--inline"
        />
        <div className="home-features__grid" style={{ marginTop: '2.5rem' }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="home-features__card home-glass"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: (i % 3) * 0.08 }}
              whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(34, 197, 94, 0.15)' }}
            >
              <div className="home-features__icon">
                <f.icon />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

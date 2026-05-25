import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MdEmail,
  MdPhone,
  MdSchedule,
  MdCheckCircle,
  MdAgriculture,
} from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import client from '../../api/client'
import './Footer.css'

function Footer() {
  const { register, handleSubmit } = useForm()
  const [submitted, setSubmitted] = useState(false)
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  async function contacting(values) {
    try {
      const res = await client.post('/contact-api/contact', values)
      if (res.data.message === 'contact') {
        setSubmitted(true)
      }
    } catch {
      // silent for now
    }
  }

  return (
    <footer className="site-footer">
      <div className="site-footer__top-glow" aria-hidden />
      <div className="site-footer__orb site-footer__orb--1" aria-hidden />
      <div className="site-footer__orb site-footer__orb--2" aria-hidden />

      <div className="site-footer__inner">
        {submitted ? (
          <motion.div
            className="site-footer__thanks site-footer__glass"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="site-footer__thanks-icon">
              <MdCheckCircle />
            </div>
            <h3>Thank you for reaching out!</h3>
            <p>We&apos;ve received your message and will get back to you shortly.</p>
          </motion.div>
        ) : (
          <div className="site-footer__grid">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="d-flex align-items-center gap-2 mb-2">
                <MdAgriculture className="text-success fs-4" />
                <span className="site-footer__brand-title">{t('app.name')}</span>
              </div>
              <p className="site-footer__brand-desc">
                Empowering farmers and labourers across rural India with smart hiring,
                transparent wages, and trusted connections.
              </p>
              <div className="site-footer__badges">
                <span className="site-footer__badge">🌾 Agriculture first</span>
                <span className="site-footer__badge">✓ Verified network</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              <h4 className="site-footer__heading">Quick links</h4>
              <ul className="site-footer__links">
                <li><Link to="/signup">Create account</Link></li>
                <li><Link to="/signin">Sign in</Link></li>
                <li><Link to="/#how-it-works">How it works</Link></li>
              </ul>

              <h4 className="site-footer__heading mt-4">Contact</h4>
              <div className="site-footer__contact-item">
                <div className="site-footer__contact-icon"><MdEmail /></div>
                <div>
                  <strong>Email</strong>
                  <span>usagemail1234@gmail.com</span>
                </div>
              </div>
              <div className="site-footer__contact-item">
                <div className="site-footer__contact-icon"><MdPhone /></div>
                <div>
                  <strong>Phone</strong>
                  <span>+91 9XXXXXXXXX</span>
                </div>
              </div>
              <div className="site-footer__contact-item">
                <div className="site-footer__contact-icon"><MdSchedule /></div>
                <div>
                  <strong>Hours</strong>
                  <span>10:00 AM – 5:00 PM (IST)</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="site-footer__form-wrap"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.16 }}
            >
              <div className="site-footer__glass">
                <h5 className="site-footer__form-title">Quick contact</h5>
                <p className="site-footer__form-sub">
                  Questions about jobs, hiring, or your account? Send us a message.
                </p>
                <form onSubmit={handleSubmit(contacting)}>
                  <div className="site-footer__row">
                    <div className="site-footer__field">
                      <label htmlFor="footer-first">First name</label>
                      <input
                        id="footer-first"
                        placeholder="e.g. Ramu"
                        {...register('firstName')}
                      />
                    </div>
                    <div className="site-footer__field">
                      <label htmlFor="footer-last">Last name</label>
                      <input
                        id="footer-last"
                        placeholder="e.g. Naik"
                        {...register('lastName')}
                      />
                    </div>
                  </div>
                  <div className="site-footer__field">
                    <label htmlFor="footer-email">Email</label>
                    <input
                      id="footer-email"
                      type="email"
                      placeholder="you@example.com"
                      {...register('email')}
                    />
                  </div>
                  <div className="site-footer__field">
                    <label htmlFor="footer-msg">Message</label>
                    <textarea
                      id="footer-msg"
                      rows={3}
                      placeholder="Tell us how we can help..."
                      {...register('message')}
                    />
                  </div>
                  <button type="submit" className="site-footer__submit">
                    Send message
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <div className="site-footer__bottom">
        <p className="site-footer__copyright mb-0">
          © {year} {t('app.name')}. All rights reserved.
        </p>
        <p className="site-footer__tagline mb-0">
          Connecting farmers with skilled labour · Built for rural India
        </p>
      </div>
    </footer>
  )
}

export default Footer

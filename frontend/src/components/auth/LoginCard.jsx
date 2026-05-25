import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub, FaMicrosoft } from 'react-icons/fa'
import client from '../../api/client'
import { createObj } from '../contexts/FarmerLabourContext'

const socialProviders = [
  { id: 'google', label: 'Google', icon: FcGoogle },
  { id: 'github', label: 'GitHub', icon: FaGithub },
  { id: 'microsoft', label: 'Microsoft', icon: FaMicrosoft },
]

export default function LoginCard({ containerVariants, itemVariants }) {
  const { login } = useContext(createObj)
  const savedEmail = typeof window !== 'undefined' ? localStorage.getItem('fl_remember_email') : ''
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: savedEmail || '', password: '' },
  })
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(!!savedEmail)
  const [isLoading, setIsLoading] = useState(false)
  const [socialNotice, setSocialNotice] = useState('')
  const nav = useNavigate()

  async function onSubmit(values) {
    try {
      setIsLoading(true)
      setServerError('')
      const res = await client.post('/auth/login', values)
      if (rememberMe) {
        localStorage.setItem('fl_remember_email', values.email)
      } else {
        localStorage.removeItem('fl_remember_email')
      }
      login(res.data.user, res.data.token)
      const path = res.data.user.role === 'farmer'
        ? `/farmerprofile/${res.data.user.email}`
        : `/labourprofile/${res.data.user.email}`
      nav(path)
    } catch (err) {
      setServerError(err.response?.data?.message || 'Unable to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      className="auth-signin__form-wrap auth-signin__form-wrap--scroll"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="auth-signin__form-inner">
        <motion.div variants={itemVariants}>
          <h3>Welcome back</h3>
          <p className="auth-signin__subtitle">
            Sign in with your email and password to continue.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <motion.div className="auth-signin__field" variants={itemVariants}>
            <label htmlFor="email">Email</label>
            <div className="auth-signin__input-wrap">
              <MdEmail className="auth-signin__input-icon" aria-hidden />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email', { required: 'Email is required' })}
              />
            </div>
            {errors.email && <p className="auth-signin__error">{errors.email.message}</p>}
          </motion.div>

          <motion.div className="auth-signin__field" variants={itemVariants}>
            <label htmlFor="password">Password</label>
            <div className="auth-signin__input-wrap">
              <MdLock className="auth-signin__input-icon" aria-hidden />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                style={{ paddingRight: '2.75rem' }}
                {...register('password', { required: 'Password is required' })}
              />
              <button
                type="button"
                className="auth-signin__toggle-pw"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>
            {errors.password && <p className="auth-signin__error">{errors.password.message}</p>}
          </motion.div>

          <motion.div className="auth-signin__row-meta" variants={itemVariants}>
            <label className="auth-signin__remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <button
              type="button"
              className="auth-signin__forgot"
              onClick={() => setSocialNotice('Password reset will be available soon.')}
            >
              Forgot password?
            </button>
          </motion.div>

          {serverError && (
            <motion.div className="auth-signin__server-error" variants={itemVariants}>
              {serverError}
            </motion.div>
          )}
          {socialNotice && (
            <motion.div className="auth-signin__notice" variants={itemVariants}>
              {socialNotice}
            </motion.div>
          )}

          <motion.button
            type="submit"
            className="auth-signin__submit"
            disabled={isLoading}
            variants={itemVariants}
          >
            {isLoading ? (
              <>
                <span className="login-spinner" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </motion.button>
        </form>

        <motion.div variants={itemVariants}>
          <div className="auth-signin__social-divider">
            <span />
            <p>Or continue with</p>
            <span />
          </div>
          <div className="auth-signin__social-grid">
            {socialProviders.map((p) => {
              const Icon = p.icon
              return (
                <button
                  key={p.id}
                  type="button"
                  className="auth-signin__social-btn"
                  onClick={() =>
                    setSocialNotice(`${p.label} sign-in is coming soon. Use email and password for now.`)
                  }
                  aria-label={`Sign in with ${p.label}`}
                >
                  <Icon style={{ fontSize: '1.1rem', flexShrink: 0 }} />
                  <span>{p.label}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        <motion.p className="auth-signin__footer" variants={itemVariants}>
          New to Farm Labour? <Link to="/signup">Create an account</Link>
        </motion.p>
      </div>
    </motion.div>
  )
}

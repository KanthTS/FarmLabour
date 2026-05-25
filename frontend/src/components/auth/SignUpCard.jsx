import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MdAgriculture,
  MdGroups,
  MdPerson,
  MdEmail,
  MdLock,
} from 'react-icons/md'
import client from '../../api/client'
import { createObj } from '../contexts/FarmerLabourContext'

export default function SignUpCard({ containerVariants, itemVariants }) {
  const { login } = useContext(createObj)
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: { role: '' },
  })
  const [serverError, setServerError] = useState('')
  const nav = useNavigate()
  const selectedRole = watch('role')

  async function onSubmit(values) {
    try {
      setServerError('')
      const res = await client.post('/auth/register', values)
      login(res.data.user, res.data.token)
      const path = res.data.user.role === 'farmer'
        ? `/farmerprofile/${res.data.user.email}`
        : `/labourprofile/${res.data.user.email}`
      nav(path)
    } catch (err) {
      setServerError(err.response?.data?.message || 'Unable to sign up')
    }
  }

  function selectRole(role) {
    setValue('role', role, { shouldValidate: true })
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
          <h3>Create your account</h3>
          <p className="auth-signin__subtitle">
            Pick your role and fill in your details below.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <input type="hidden" {...register('role', { required: 'Select your role' })} />

          <motion.div variants={itemVariants}>
            <span className="auth-signin__role-label">I am joining as</span>
            <div className="auth-signin__roles">
              <button
                type="button"
                className={`auth-signin__role-card ${selectedRole === 'farmer' ? 'auth-signin__role-card--active' : ''}`}
                onClick={() => selectRole('farmer')}
                aria-pressed={selectedRole === 'farmer'}
              >
                <div className="auth-signin__role-icon"><MdAgriculture /></div>
                <strong>Farmer</strong>
                <span>Post jobs &amp; hire workers</span>
              </button>
              <button
                type="button"
                className={`auth-signin__role-card ${selectedRole === 'labour' ? 'auth-signin__role-card--active' : ''}`}
                onClick={() => selectRole('labour')}
                aria-pressed={selectedRole === 'labour'}
              >
                <div className="auth-signin__role-icon"><MdGroups /></div>
                <strong>Labour</strong>
                <span>Find &amp; apply for work</span>
              </button>
            </div>
            {errors.role && <p className="auth-signin__error">{errors.role.message}</p>}
          </motion.div>

          <motion.div className="auth-signin__row" variants={itemVariants}>
            <div className="auth-signin__field">
              <label htmlFor="signup-firstName">First name</label>
              <div className="auth-signin__input-wrap">
                <MdPerson className="auth-signin__input-icon" aria-hidden />
                <input
                  id="signup-firstName"
                  placeholder="e.g. Ramu"
                  {...register('firstName', { required: 'First name required' })}
                />
              </div>
              {errors.firstName && <p className="auth-signin__error">{errors.firstName.message}</p>}
            </div>
            <div className="auth-signin__field">
              <label htmlFor="signup-lastName">Last name</label>
              <div className="auth-signin__input-wrap">
                <MdPerson className="auth-signin__input-icon" aria-hidden />
                <input
                  id="signup-lastName"
                  placeholder="e.g. Naik"
                  {...register('lastName')}
                />
              </div>
            </div>
          </motion.div>

          <motion.div className="auth-signin__field" variants={itemVariants}>
            <label htmlFor="signup-email">Email</label>
            <div className="auth-signin__input-wrap">
              <MdEmail className="auth-signin__input-icon" aria-hidden />
              <input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                {...register('email', { required: 'Email is required' })}
              />
            </div>
            {errors.email && <p className="auth-signin__error">{errors.email.message}</p>}
          </motion.div>

          <motion.div className="auth-signin__field" variants={itemVariants}>
            <label htmlFor="signup-password">Password</label>
            <div className="auth-signin__input-wrap">
              <MdLock className="auth-signin__input-icon" aria-hidden />
              <input
                id="signup-password"
                type="password"
                placeholder="At least 6 characters"
                {...register('password', {
                  required: 'Password required',
                  minLength: { value: 6, message: 'Min 6 characters' },
                })}
              />
            </div>
            {errors.password && <p className="auth-signin__error">{errors.password.message}</p>}
          </motion.div>

          {serverError && (
            <motion.div className="auth-signin__server-error" variants={itemVariants}>
              {serverError}
            </motion.div>
          )}

          <motion.button
            type="submit"
            className="auth-signin__submit"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            Create account
          </motion.button>
        </form>

        <motion.p className="auth-signin__footer" variants={itemVariants}>
          Already have an account? <Link to="/signin">Sign in</Link>
        </motion.p>
      </div>
    </motion.div>
  )
}

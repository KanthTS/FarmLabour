import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import client from '../../api/client'
import { createObj } from '../contexts/FarmerLabourContext'

function Signin() {
  const { login } = useContext(createObj)
  const { register, handleSubmit, formState:{ errors } } = useForm()
  const [serverError, setServerError] = useState('')
  const nav = useNavigate()

  async function onSubmit(values) {
    try {
      setServerError('')
      const res = await client.post('/auth/login', values)
      login(res.data.user, res.data.token)
      const path = res.data.user.role === 'farmer'
        ? `/farmerprofile/${res.data.user.email}`
        : `/labourprofile/${res.data.user.email}`
      nav(path)
    } catch (err) {
      setServerError(err.response?.data?.message || 'Unable to sign in')
    }
  }

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '80vh', background: 'radial-gradient(circle at top, #0f9d58 0, #0b4220 45%, #020617 100%)' }}
    >
      <div className="container" style={{ maxWidth: '420px' }}>
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card border-0 shadow rounded-4">
              <div className="card-body p-4">
                <h3 className="mb-1 text-center">Welcome back</h3>
                <p className="text-muted small text-center mb-4">
                  Sign in to manage your farm jobs and applications.
                </p>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="you@example.com"
                      {...register('email', { required:'Email is required' })}
                    />
                    {errors.email && <p className="text-danger small">{errors.email.message}</p>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="••••••••"
                      {...register('password', { required:'Password is required' })}
                    />
                    {errors.password && <p className="text-danger small">{errors.password.message}</p>}
                  </div>
                  {serverError && <p className="text-danger small mb-2">{serverError}</p>}
                  <button className="btn btn-success w-100 mt-2" type="submit">
                    Sign in
                  </button>
                </form>
                <div className="text-center mt-3 small text-muted">
                  New to Farm Labour?{' '}
                  <Link to="/signup" className="text-decoration-none">
                    Create an account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signin

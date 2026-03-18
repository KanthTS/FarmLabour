import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import client from '../../api/client'
import { createObj } from '../contexts/FarmerLabourContext'

function SignUp() {
  const { login } = useContext(createObj)
  const { register, handleSubmit, formState:{ errors } } = useForm()
  const [serverError, setServerError] = useState('')
  const nav = useNavigate()

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

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight:'60vh',
        background:'radial-gradient(circle at top, #3b82f6 0, #1d4ed8 30%, #020617 85%)'
      }}
    >
      <div className="container" style={{ maxWidth:'520px' }}>
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card border-0 shadow rounded-4">
              <div className="card-body p-4">
                <h3 className="mb-1 text-center">Create your Farm Labour account</h3>
                <p className="text-muted small text-center mb-4">
                  Choose your role and start posting or finding farm jobs.
                </p>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className={`btn btn-sm flex-fill ${ /* simple visual toggle */ '' }`}
                        onClick={() => { }}
                      />
                    </div>
                    <select
                      className="form-select mt-2"
                      {...register('role',{required:'Select your role'})}
                    >
                      <option value="">Select role</option>
                      <option value="farmer">Farmer</option>
                      <option value="labour">Labour</option>
                    </select>
                    {errors.role && <p className="text-danger small">{errors.role.message}</p>}
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">First Name</label>
                      <input
                        className="form-control"
                        placeholder="e.g. Ramu"
                        {...register('firstName',{required:'First name required'})}
                      />
                      {errors.firstName && <p className="text-danger small">{errors.firstName.message}</p>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Last Name</label>
                      <input
                        className="form-control"
                        placeholder="e.g. Naik"
                        {...register('lastName')}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="you@example.com"
                      {...register('email',{required:'Email is required'})}
                    />
                    {errors.email && <p className="text-danger small">{errors.email.message}</p>}
                  </div>
                  <div className="mt-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Min 6 characters"
                      {...register('password',{
                        required:'Password required',
                        minLength:{value:6,message:'Min 6 characters'}
                      })}
                    />
                    {errors.password && <p className="text-danger small">{errors.password.message}</p>}
                  </div>
                  {serverError && <p className="text-danger small mt-2">{serverError}</p>}
                  <button className="btn btn-success w-100 mt-3" type="submit">
                    Sign up
                  </button>
                </form>
                <div className="text-center mt-3 small text-muted">
                  Already have an account?{' '}
                  <Link to="/signin" className="text-decoration-none">
                    Sign in
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

export default SignUp

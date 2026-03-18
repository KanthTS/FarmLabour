import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import client from '../../api/client'

function Footer() {
  const { register, handleSubmit, formState:{ errors } } = useForm()
  const [submitted, setSubmitted] = useState(false)

  async function contacting(values) {
    try {
      const res = await client.post('/contact-api/contact', values)
      if (res.data.message === 'contact') {
        setSubmitted(true)
      }
    } catch (e) {
      // keep footer silent on error for now
    }
  }

  const year = new Date().getFullYear()

  return (
    <footer className="mt-5 bg-dark text-light">
      <div className="container py-5">
        {submitted ? (
          <div className="text-center py-4">
            <h3 className="mb-2">Thank you for contacting us!</h3>
            <p className="text-secondary mb-0">We’ve received your message and will get back to you shortly.</p>
          </div>
        ) : (
          <div className="row g-4 align-items-start">
            <div className="col-md-5">
              <h4 className="fw-bold">Need help with hiring or work?</h4>
              <p className="text-secondary mt-2">
                Reach out and our team will assist you with using the platform, job postings, and worker applications.
              </p>
              <div className="mt-4">
                <div className="mb-2">
                  <div className="text-uppercase text-secondary small">Email</div>
                  <div className="fw-semibold">usagemail1234@gmail.com</div>
                </div>
                <div className="mb-2">
                  <div className="text-uppercase text-secondary small">Phone</div>
                  <div className="fw-semibold">+91 9XXXXXXXXX</div>
                </div>
                <div className="mb-2">
                  <div className="text-uppercase text-secondary small">Hours</div>
                  <div className="fw-semibold">10:00 AM – 5:00 PM (IST)</div>
                </div>
              </div>
            </div>

            <div className="col-md-7">
              <div className="card bg-dark border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3">Quick contact</h5>
                  <form onSubmit={handleSubmit(contacting)}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">First Name</label>
                        <input
                          className="form-control bg-black text-light border-secondary"
                          placeholder="e.g. Ramu"
                          {...register('firstName')}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Last Name</label>
                        <input
                          className="form-control bg-black text-light border-secondary"
                          placeholder="e.g. Naik"
                          {...register('lastName')}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control bg-black text-light border-secondary"
                          placeholder="you@example.com"
                          {...register('email')}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Message</label>
                        <textarea
                          className="form-control bg-black text-light border-secondary"
                          rows={3}
                          placeholder="Tell us how we can help..."
                          {...register('message')}
                        />
                      </div>
                      <div className="col-12">
                        <button type="submit" className="btn btn-warning w-100 mt-2">
                          Send message
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="border-top border-secondary text-center py-3 small text-secondary">
        © {year} Farm Labour. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer


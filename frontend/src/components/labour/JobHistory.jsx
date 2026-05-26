import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineCurrencyRupee,
  HiOutlineBriefcase,
} from 'react-icons/hi'
import client from '../../api/client'
import { createObj } from '../contexts/FarmerLabourContext'
import thumbChilli from '../../images/home-post-job.jpg'
import thumbCotton from '../../images/home-hero-panel.jpg'
import thumbField from '../../images/home-categories-panel.jpg'
import './LabourDashboard.css'

const JOB_THUMBS = [thumbChilli, thumbCotton, thumbField]

const STATUS_LABELS = {
  hired: { text: 'In progress', className: 'ld-status ld-status--hired' },
  shortlisted: { text: 'Shortlisted', className: 'ld-status ld-status--shortlisted' },
}

function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatINR(n) {
  return `₹${Number(n || 0).toLocaleString('en-IN')}`
}

function JobHistory() {
  const { currentUser } = useContext(createObj)
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (!currentUser?.email || currentUser.role !== 'labour') return

    let cancelled = false

    async function load() {
      setLoading(true)
      setErr('')
      try {
        const res = await client.get('/labour-api/my-jobs')
        if (!cancelled) setItems(res.data?.payload || [])
      } catch {
        try {
          const fallback = await client.get('/applications/mine')
          const apps = (fallback.data?.payload || []).filter((a) =>
            ['hired', 'shortlisted'].includes(a.status)
          )
          if (!cancelled) setItems(apps.map((a) => ({ ...a, job: null })))
        } catch {
          if (!cancelled) setErr('Failed to load your jobs. Please try again.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [currentUser?.email, currentUser?.role])

  if (!currentUser || currentUser.role !== 'labour') {
    return <p className="ld-loading">Please sign in as a labourer.</p>
  }

  return (
    <div className="labour-dashboard">
      <div className="ld-card ld-page-head">
        <div>
          <h3>My Jobs</h3>
          <p className="ld-job__meta" style={{ marginTop: '0.35rem' }}>
            Jobs you are shortlisted for or currently working on in Mantralayam area.
          </p>
        </div>
        <button type="button" className="ld-apply-btn" onClick={() => navigate('jobs')}>
          Find more jobs
        </button>
      </div>

      {loading && <p className="ld-loading">Loading your jobs…</p>}
      {err && <p className="ld-alert ld-alert--err">{err}</p>}

      {!loading && !err && items.length === 0 && (
        <div className="ld-card ld-empty-state">
          <HiOutlineBriefcase style={{ fontSize: '2.5rem', color: '#94a3b8' }} />
          <h4>No active jobs yet</h4>
          <p className="ld-job__meta">
            Apply to jobs from Find Jobs. When a farmer hires you, the job appears here.
          </p>
          <button type="button" className="ld-apply-btn" onClick={() => navigate('jobs')}>
            Browse jobs
          </button>
        </div>
      )}

      {!loading &&
        items.map((item, index) => {
          const job = item.job
          const status = STATUS_LABELS[item.status] || {
            text: item.status,
            className: 'ld-status',
          }
          const location =
            job &&
            [job.village, job.mandal, job.city, job.location].filter(Boolean).join(', ')
          const title = job?.title || `Job #${String(item.jobId).slice(-6)}`

          return (
            <article key={item._id} className="ld-card ld-myjob-card">
              <div className="ld-job">
                <img src={JOB_THUMBS[index % JOB_THUMBS.length]} alt="" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="ld-myjob-card__top">
                    <h4 className="ld-job-item__title" style={{ margin: 0 }}>
                      {title}
                    </h4>
                    <span className={status.className}>{status.text}</span>
                  </div>

                  {job ? (
                    <>
                      <div className="ld-job__meta" style={{ marginTop: '0.35rem' }}>
                        <HiOutlineLocationMarker style={{ verticalAlign: 'middle' }} />{' '}
                        {location || 'Mantralayam, AP'}
                      </div>
                      <div className="ld-job__tags" style={{ marginTop: '0.35rem' }}>
                        <span className="ld-tag ld-tag--green">
                          {job.Timings || '10:00 AM – 5:00 PM'}
                        </span>
                        {job.farmerName && (
                          <span className="ld-tag">Farmer: {job.farmerName}</span>
                        )}
                      </div>
                      <div className="ld-myjob-card__meta">
                        <span>
                          <HiOutlineCalendar /> {formatDate(job.startDate)} –{' '}
                          {formatDate(job.endDate)}
                        </span>
                        <span className="ld-wage">
                          <HiOutlineCurrencyRupee style={{ verticalAlign: 'middle' }} />
                          {formatINR(job.wages)}/day
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="ld-job__meta" style={{ marginTop: '0.5rem' }}>
                      Applied {formatDate(item.dateOfCreation)} · Skills: {item.skills || '—'}
                    </p>
                  )}

                  <p className="ld-job__meta" style={{ marginTop: '0.5rem' }}>
                    Application: {formatDate(item.dateOfCreation)}
                  </p>
                </div>
              </div>

              {job?.jobId && (
                <button
                  type="button"
                  className="ld-link-btn"
                  style={{ marginTop: '0.75rem', width: '100%', textAlign: 'center' }}
                  onClick={() => navigate(`${job.jobId}`, { state: job })}
                >
                  View job details
                </button>
              )}
            </article>
          )
        })}
    </div>
  )
}

export default JobHistory

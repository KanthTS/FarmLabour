import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../../api/client'
import { createObj } from '../contexts/FarmerLabourContext'
import './LabourDashboard.css'

const STATUS_STYLES = {
  applied: 'ld-status',
  shortlisted: 'ld-status ld-status--shortlisted',
  hired: 'ld-status ld-status--hired',
  rejected: 'ld-status ld-status--rejected',
  withdrawn: 'ld-status',
}

function MyApplications() {
  const { currentUser } = useContext(createObj)
  const navigate = useNavigate()
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (!currentUser?.email) return

    let cancelled = false

    async function load() {
      setLoading(true)
      setErr('')
      try {
        const res = await client.get('/applications/mine')
        if (!cancelled) setApps(res.data?.payload || [])
      } catch {
        if (!cancelled) setErr('Failed to load applications')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [currentUser?.email])

  return (
    <div className="labour-dashboard">
      <div className="ld-card ld-page-head">
        <div>
          <h3>My Applications</h3>
          <p className="ld-job__meta" style={{ marginTop: '0.35rem' }}>
            Track every job you have applied for.
          </p>
        </div>
        <button type="button" className="ld-apply-btn" onClick={() => navigate('jobs')}>
          Find jobs
        </button>
      </div>

      {loading && <p className="ld-loading">Loading applications…</p>}
      {err && <p className="ld-alert ld-alert--err">{err}</p>}

      {!loading && !err && apps.length === 0 && (
        <div className="ld-card ld-empty-state">
          <h4>No applications yet</h4>
          <p className="ld-job__meta">Start applying to jobs near Mantralayam.</p>
          <button type="button" className="ld-apply-btn" onClick={() => navigate('jobs')}>
            Browse jobs
          </button>
        </div>
      )}

      {!loading &&
        apps.map((app) => (
          <article key={app._id} className="ld-card ld-myjob-card">
            <div className="ld-myjob-card__top">
              <div>
                <h4 className="ld-job-item__title" style={{ margin: 0 }}>
                  {app.fullname}
                </h4>
                <p className="ld-job__meta" style={{ marginTop: '0.25rem' }}>
                  {app.experience} · {app.workinghours || '10:00 AM – 5:00 PM'}
                </p>
                <p className="ld-job__meta">{app.location}</p>
                <p className="ld-job__meta">Skills: {app.skills}</p>
              </div>
              <span className={STATUS_STYLES[app.status] || 'ld-status'}>{app.status}</span>
            </div>
            <p className="ld-job__meta" style={{ marginTop: '0.65rem' }}>
              Applied {new Date(app.dateOfCreation).toLocaleDateString('en-IN')}
            </p>
          </article>
        ))}
    </div>
  )
}

export default MyApplications

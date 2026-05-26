import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiOutlineClipboardList,
  HiUsers,
  HiOutlineBell,
  HiOutlineCurrencyRupee,
  HiOutlineLocationMarker,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineCreditCard,
  HiOutlineCheck,
  HiOutlineX,
  HiPlus,
  HiUserGroup,
} from 'react-icons/hi'
import { createObj } from '../contexts/FarmerLabourContext'
import client from '../../api/client'
import heroBanner from '../../images/farmer-dashboard-hero.png'
import thumbChilli from '../../images/home-post-job.jpg'
import thumbCotton from '../../images/home-hero-panel.jpg'
import thumbField from '../../images/home-categories-panel.jpg'
import './FarmerDashboard.css'

const JOB_THUMBS = [thumbChilli, thumbCotton, thumbField]

function formatINR(amount) {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`
}

function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function FarmerDashboard() {
  const { currentUser } = useContext(createObj)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeLabourers: 0,
    pendingApplications: 0,
    completedJobs: 0,
    totalSpending: 0,
  })
  const [overview, setOverview] = useState({ active: 0, completed: 0, pending: 0 })
  const [recentJobs, setRecentJobs] = useState([])
  const [recentApplications, setRecentApplications] = useState([])

  const locationLabel = currentUser?.location || 'Mantralayam, Kurnool'

  const loadDashboard = useCallback(async () => {
    if (!currentUser) return
    setLoading(true)
    try {
      const res = await client.get('/farmer/dashboard')
      const payload = res.data?.payload || {}
      setStats(payload.stats || {})
      setOverview(payload.overview || { active: 0, completed: 0, pending: 0 })
      setRecentJobs(payload.recentJobs || [])
      setRecentApplications(payload.recentApplications || [])
    } catch {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          client.get('/jobs', { params: { search: '' } }),
          client.get('/applications/mine'),
        ])
        const jobs = (jobsRes.data?.payload || []).filter(
          (job) => job?.farmerData?.email === currentUser.email
        )
        const apps = appsRes.data?.payload || []
        const active = jobs.filter((j) => j.isJobActive)
        const completed = jobs.filter((j) => !j.isJobActive)
        const pending = apps.filter((a) => ['applied', 'shortlisted'].includes(a.status))
        const hired = apps.filter((a) => a.status === 'hired')
        const spend = hired.reduce((sum, app) => {
          const job = jobs.find((j) => String(j._id) === String(app.jobId))
          return sum + (job?.wages || 0)
        }, 0)

        setStats({
          totalJobs: jobs.length,
          activeLabourers: new Set(hired.map((a) => a.labourData?.email).filter(Boolean)).size,
          pendingApplications: pending.length,
          completedJobs: completed.length,
          totalSpending: spend,
        })
        setOverview({
          active: active.length,
          completed: completed.length,
          pending: pending.length,
        })
        setRecentJobs(jobs.slice(0, 5))
        setRecentApplications(apps.slice(0, 6))
      } catch {
        /* keep empty state */
      }
    } finally {
      setLoading(false)
    }
  }, [currentUser])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const handleApplication = async (id, status) => {
    try {
      await client.patch(`/applications/${id}`, { status })
      loadDashboard()
    } catch {
      /* ignore */
    }
  }

  const statCards = [
    {
      label: 'Total Jobs',
      value: stats.totalJobs,
      icon: HiOutlineClipboardList,
      trend: '+20% this month',
      up: true,
    },
    {
      label: 'Active Labourers',
      value: stats.activeLabourers,
      icon: HiUsers,
      trend: '↑ 15% this month',
      up: true,
    },
    {
      label: 'Pending Applications',
      value: stats.pendingApplications,
      icon: HiOutlineBell,
      trend: '↓ 5% this month',
      up: false,
    },
    {
      label: 'Completed Jobs',
      value: stats.completedJobs,
      icon: HiOutlineChartBar,
      trend: '↑ 28% this month',
      up: true,
    },
    {
      label: 'Total Spending',
      value: formatINR(stats.totalSpending),
      icon: HiOutlineCurrencyRupee,
      trend: '↑ 18% this month',
      up: true,
      isMoney: true,
    },
  ]

  const overviewTotal = overview.active + overview.completed + overview.pending || 1
  const donutStyle = {
    background: `conic-gradient(
      #22c55e 0 ${(overview.active / overviewTotal) * 100}%,
      #38bdf8 ${(overview.active / overviewTotal) * 100}% ${((overview.active + overview.completed) / overviewTotal) * 100}%,
      #fbbf24 ${((overview.active + overview.completed) / overviewTotal) * 100}% 100%
    )`,
  }

  const quickActions = [
    { label: 'Post a Job', icon: HiOutlineDocumentText, path: 'createpost' },
    { label: 'Find Labour', icon: HiUserGroup, path: 'alljobs' },
    { label: 'My Jobs', icon: HiOutlineChartBar, path: 'myjobs' },
    { label: 'Payments', icon: HiOutlineCreditCard, path: 'jobs' },
  ]

  if (loading && !recentJobs.length) {
    return <div className="fd-loading">Loading your dashboard…</div>
  }

  return (
    <div className="farmer-dashboard">
      <section className="fd-hero-row">
        <div className="fd-hero">
          <div className="fd-hero__inner">
            <div className="fd-hero__copy">
              <h2>
                Find Skilled Labour For Your <span>Farm Easily.</span>
              </h2>
              <p>Connect with trusted labourers near you and get the job done efficiently.</p>
              <div className="fd-hero__actions">
                <button
                  type="button"
                  className="fd-btn-primary"
                  onClick={() => navigate('createpost')}
                >
                  <HiPlus /> Post a Job
                </button>
                <button
                  type="button"
                  className="fd-btn-outline"
                  onClick={() => navigate('alljobs')}
                >
                  <HiUserGroup className="text-success" /> Hire Labour
                </button>
              </div>
            </div>
            <div className="fd-hero__visual">
              <img src={heroBanner} alt="Farmer in the field" />
              <div className="fd-hero__bubble">
                Today is a <strong>Great day for farming!</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="fd-aside-stack">
          <div className="fd-card">
            <div className="fd-weather-top">
              <div>
                <p className="fd-card__sub" style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#16a34a', fontWeight: 600 }}>
                  {locationLabel}
                </p>
                <p className="fd-weather-temp">28°C</p>
                <p className="fd-card__sub">Partly Cloudy</p>
              </div>
              <div style={{ fontSize: '2rem' }} aria-hidden>☁️</div>
            </div>
            <div className="fd-weather-meta">
              <div><span>Humidity</span><span>65%</span></div>
              <div><span>Rain Chance</span><span>20%</span></div>
              <div><span>Wind</span><span>12 km/h</span></div>
            </div>
            <div className="fd-tip">
              <strong>Farming Tip — </strong>
              Good time to irrigate your crops in the morning.
            </div>
          </div>

          <div className="fd-card">
            <h3>Quick Actions</h3>
            <div className="fd-quick-grid">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.label}
                    type="button"
                    className="fd-quick-item"
                    onClick={() => navigate(action.path)}
                  >
                    <span><Icon /></span>
                    <span>{action.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="fd-stats" aria-label="Dashboard statistics">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <article key={card.label} className="fd-stat">
              <div className="fd-stat__head">
                <span className="fd-stat__label">{card.label}</span>
                <span className="fd-stat__icon"><Icon /></span>
              </div>
              <p className="fd-stat__value">
                {card.isMoney ? card.value : card.value}
              </p>
              <p className={`fd-stat__trend ${card.up ? 'fd-stat__trend--up' : 'fd-stat__trend--down'}`}>
                {card.trend}
              </p>
            </article>
          )
        })}
      </section>

      <section className="fd-content-row">
        <div className="fd-two-col">
          <div className="fd-card">
            <div className="fd-section-head">
              <div>
                <h3>Recent Job Posts</h3>
                <p className="fd-card__sub">Your latest postings and action status.</p>
              </div>
              <button type="button" className="fd-link-btn" onClick={() => navigate('myjobs')}>
                View All
              </button>
            </div>
            {recentJobs.length === 0 ? (
              <p className="fd-empty">No jobs posted yet. Create your first job.</p>
            ) : (
              recentJobs.map((job, index) => (
                <article key={job._id || job.jobId} className="fd-job-item">
                  <img src={JOB_THUMBS[index % JOB_THUMBS.length]} alt="" />
                  <div>
                    <div className="fd-job-item__title">{job.title}</div>
                    <div className="fd-job-item__meta">
                      <span>
                        <HiOutlineLocationMarker style={{ verticalAlign: 'middle' }} />{' '}
                        {job.location}
                      </span>
                      <span>{formatDate(job.DateOfCreation || job.createdAt)}</span>
                      <span>{job.workersNeeded} workers</span>
                    </div>
                  </div>
                  <div className="fd-job-item__right">
                    <div className="fd-job-item__wage">{formatINR(job.wages)}/day</div>
                    <span
                      className={`fd-badge ${job.isJobActive ? 'fd-badge--active' : 'fd-badge--done'}`}
                      style={{ marginTop: '0.35rem' }}
                    >
                      {job.isJobActive ? 'Active' : 'Completed'}
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="fd-card">
            <div className="fd-section-head">
              <div>
                <h3>Recent Applications</h3>
                <p className="fd-card__sub">Pending candidates waiting for your review.</p>
              </div>
              <button type="button" className="fd-link-btn fd-link-btn--ghost" onClick={() => navigate('app')}>
                View All
              </button>
            </div>
            {recentApplications.length === 0 ? (
              <p className="fd-empty">No applications yet.</p>
            ) : (
              recentApplications.map((app) => {
                const name = app.fullname || app.labourData?.nameOfLabour || 'Applicant'
                const avatar =
                  app.labourData?.profileImageUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=15803d&color=ffffff&size=64`
                const canAct = ['applied', 'shortlisted'].includes(app.status)
                return (
                  <article key={app._id} className="fd-app-item">
                    <img src={avatar} alt="" />
                    <div>
                      <div className="fd-app-item__name">{name}</div>
                      <div className="fd-app-item__exp">{app.experience || 'Experience N/A'}</div>
                      <div className="fd-app-item__exp">
                        {formatINR(app.jobWages || 0)}/day · {app.jobTitle}
                      </div>
                    </div>
                    <div className="fd-app-actions">
                      {canAct ? (
                        <>
                          <button
                            type="button"
                            className="fd-icon-btn fd-icon-btn--ok"
                            aria-label="Accept"
                            onClick={() => handleApplication(app._id, 'hired')}
                          >
                            <HiOutlineCheck />
                          </button>
                          <button
                            type="button"
                            className="fd-icon-btn fd-icon-btn--no"
                            aria-label="Reject"
                            onClick={() => handleApplication(app._id, 'rejected')}
                          >
                            <HiOutlineX />
                          </button>
                        </>
                      ) : (
                        <span
                          className={`fd-badge ${
                            app.status === 'hired'
                              ? 'fd-badge--active'
                              : app.status === 'rejected'
                                ? 'fd-badge--pending'
                                : 'fd-badge--done'
                          }`}
                        >
                          {app.status}
                        </span>
                      )}
                    </div>
                  </article>
                )
              })
            )}
          </div>
        </div>

        <aside className="fd-aside-stack">
          <div className="fd-card">
            <div className="fd-section-head">
              <div>
                <h3>Job Overview</h3>
                <p className="fd-card__sub">Your farm activity at a glance.</p>
              </div>
              <span className="fd-badge fd-badge--done">This Month</span>
            </div>
            <div className="fd-donut-wrap">
              <div className="fd-donut" style={donutStyle}>
                <div className="fd-donut__center">{stats.totalJobs}</div>
              </div>
            </div>
            <div className="fd-overview-row">
              <span><span className="fd-dot" style={{ background: '#22c55e' }} /> Active</span>
              <strong>{overview.active}</strong>
            </div>
            <div className="fd-overview-row">
              <span><span className="fd-dot" style={{ background: '#38bdf8' }} /> Completed</span>
              <strong>{overview.completed}</strong>
            </div>
            <div className="fd-overview-row">
              <span><span className="fd-dot" style={{ background: '#fbbf24' }} /> Pending</span>
              <strong>{overview.pending}</strong>
            </div>
          </div>

          <div className="fd-premium">
            <span style={{ fontSize: '1.5rem' }} aria-hidden>🚜</span>
            <p style={{ margin: 0, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.14em', opacity: 0.85 }}>
              Upgrade to Premium
            </p>
            <h3>More visibility, more labourers</h3>
            <p>Get priority support and premium exposure for your postings.</p>
            <button type="button">Upgrade Now</button>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default FarmerDashboard

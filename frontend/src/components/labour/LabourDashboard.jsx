import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiOutlineBriefcase,
  HiOutlineCheckCircle,
  HiOutlineClipboardList,
  HiOutlineCurrencyRupee,
  HiOutlineLocationMarker,
} from 'react-icons/hi'
import { createObj } from '../contexts/FarmerLabourContext'
import client from '../../api/client'
import heroPhoto from '../../images/labour-dashboard-hero.png'
import thumbChilli from '../../images/home-post-job.jpg'
import thumbCotton from '../../images/home-hero-panel.jpg'
import thumbField from '../../images/home-categories-panel.jpg'
import './LabourDashboard.css'

const JOB_THUMBS = [thumbChilli, thumbCotton, thumbField]

function formatINR(n) {
  return `₹${Number(n || 0).toLocaleString('en-IN')}`
}

function formatDate(v) {
  if (!v) return '—'
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function LabourDashboard() {
  const { currentUser, profileCompletion, applyProfileStats } = useContext(createObj)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    applications: 0,
    shortlisted: 0,
    hired: 0,
    earnings: 0,
  })
  const [latestJobs, setLatestJobs] = useState([])
  const [upcomingWork, setUpcomingWork] = useState(null)
  const [skills, setSkills] = useState([])
  const [experienceYears, setExperienceYears] = useState(0)
  const [locationLabel, setLocationLabel] = useState('Mantralayam, Kurnool')
  const [appliedJobIds, setAppliedJobIds] = useState([])

  const displayName = useMemo(() => {
    if (!currentUser) return 'Labour'
    return `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim()
  }, [currentUser])

  const avatarUrl =
    currentUser?.profileImageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=15803d&color=ffffff&size=128`

  const loadDashboard = useCallback(async () => {
    if (!currentUser) return
    setLoading(true)
    try {
      const res = await client.get('/labour-api/dashboard')
      const p = res.data?.payload || {}
      setStats(p.stats || {})
      setLatestJobs(p.latestJobs || [])
      setUpcomingWork(p.upcomingWork || null)
      applyProfileStats(currentUser, p.profileCompletion, p.profileBreakdown)
      setAppliedJobIds((p.appliedJobIds || []).map(String))
      setSkills(p.skills || currentUser.skills || [])
      setExperienceYears(p.experienceYears ?? currentUser.experienceYears ?? 0)
      setLocationLabel(p.location || currentUser.location || 'Mantralayam, Kurnool')
    } catch {
      try {
        const [appsRes, jobsRes] = await Promise.all([
          client.get('/applications/mine'),
          client.get('/jobs', { params: { search: '' } }),
        ])
        const apps = appsRes.data?.payload || []
        const jobs = jobsRes.data?.payload || []
        setStats({
          applications: apps.length,
          shortlisted: apps.filter((a) => a.status === 'shortlisted').length,
          hired: apps.filter((a) => a.status === 'hired').length,
          earnings: apps.filter((a) => a.status === 'hired').length * 1200,
        })
        setLatestJobs(jobs.slice(0, 5))
        setSkills(currentUser.skills || ['Harvesting', 'Planting'])
        applyProfileStats(currentUser, null, null)
      } catch {
        /* empty */
      }
    } finally {
      setLoading(false)
    }
  }, [currentUser, applyProfileStats])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const defaultSkills =
    skills.length > 0
      ? skills
      : ['Harvesting', 'Planting', 'Weeding', 'Irrigation']

  if (loading && !latestJobs.length) {
    return <div className="ld-loading">Loading your dashboard…</div>
  }

  const upcomingJob = upcomingWork?.job

  return (
    <div className="labour-dashboard">
      <section className="ld-hero-row">
        <div className="ld-hero">
          <div className="ld-hero__bg" aria-hidden />
          <div className="ld-hero__content">
            <h2>
              Find Jobs, Earn Daily.
              <br />
              Build a Better Tomorrow.
            </h2>
            <p>Explore farm jobs near you and connect with trusted farmers in Mantralayam mandal.</p>
            <div className="ld-hero__actions">
              <button type="button" className="ld-btn-white" onClick={() => navigate('jobs')}>
                Find Jobs
              </button>
              <button
                type="button"
                className="ld-btn-outline"
                onClick={() => navigate('myapplications')}
              >
                View My Applications
              </button>
            </div>
          </div>
          <img src={heroPhoto} alt="" className="ld-hero__photo" />
        </div>

        <div className="ld-aside-stack">
          <div className="ld-profile-card">
            <img src={avatarUrl} alt="" />
            <h4>{displayName}</h4>
            <p>Labour</p>
            <div className="ld-rating">★ 4.5 · 120 reviews</div>
            <div className="ld-profile-meta">
              <span>{experienceYears || 5} Years</span>
              <span>{locationLabel}</span>
            </div>
            <button type="button" className="ld-view-profile" onClick={() => navigate('settings')}>
              View Profile
            </button>
          </div>
        </div>
      </section>

      <section className="ld-stats" aria-label="Statistics">
        <article className="ld-stat">
          <div className="ld-stat__icon ld-stat__icon--purple">
            <HiOutlineClipboardList />
          </div>
          <div className="ld-stat__value">{stats.applications}</div>
          <div className="ld-stat__label">Total Jobs Applied</div>
        </article>
        <article className="ld-stat">
          <div className="ld-stat__icon ld-stat__icon--green">
            <HiOutlineCheckCircle />
          </div>
          <div className="ld-stat__value">{stats.shortlisted}</div>
          <div className="ld-stat__label">You are shortlisted</div>
        </article>
        <article className="ld-stat">
          <div className="ld-stat__icon ld-stat__icon--blue">
            <HiOutlineBriefcase />
          </div>
          <div className="ld-stat__value">{stats.hired}</div>
          <div className="ld-stat__label">Jobs in Progress</div>
        </article>
        <article className="ld-stat">
          <div className="ld-stat__icon ld-stat__icon--yellow">
            <HiOutlineCurrencyRupee />
          </div>
          <div className="ld-stat__value">{formatINR(stats.earnings)}</div>
          <div className="ld-stat__label">This Month</div>
        </article>
      </section>

      <section className="ld-main-row">
        <div className="ld-card">
          <div className="ld-card__head">
            <h3>Latest Job Opportunities</h3>
            <button type="button" className="ld-link" onClick={() => navigate('jobs')}>
              View All Jobs
            </button>
          </div>
          {latestJobs.length === 0 ? (
            <p className="ld-empty">No jobs available in Mantralayam right now. Check back soon.</p>
          ) : (
            latestJobs.map((job, i) => {
              const applied = appliedJobIds.includes(String(job._id))
              return (
              <article key={job._id || job.jobId} className="ld-job">
                <img src={JOB_THUMBS[i % JOB_THUMBS.length]} alt="" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="ld-job__title">{job.title}</div>
                  <div className="ld-job__tags">
                    <span className="ld-tag ld-tag--green">{job.Timings || '10:00 AM – 5:00 PM'}</span>
                    <span className="ld-tag">Farm work</span>
                  </div>
                  <div className="ld-job__meta">
                    <HiOutlineLocationMarker style={{ verticalAlign: 'middle' }} />{' '}
                    {[job.village, job.mandal, job.city].filter(Boolean).join(', ') || job.location}
                    {' · '}
                    {formatDate(job.startDate)}
                  </div>
                  <div className="ld-job__footer">
                    <span>
                      <span className="ld-wage">{formatINR(job.wages)}/day</span>
                      <span className="ld-job__meta"> · {job.workersNeeded} workers needed</span>
                    </span>
                    {applied ? (
                      <span className="ld-tag ld-tag--green">Applied</span>
                    ) : (
                      <button
                        type="button"
                        className="ld-apply-btn"
                        onClick={() =>
                          navigate(`apply`, { state: { jobId: job._id, job } })
                        }
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              </article>
            )})
          )}
        </div>

        <aside className="ld-aside-stack">
          <div className="ld-card">
            <div className="ld-card__head">
              <h3>My Skills</h3>
              <button type="button" className="ld-link" onClick={() => navigate('settings')}>
                Edit
              </button>
            </div>
            <div className="ld-skills">
              {defaultSkills.map((s) => (
                <span key={s} className="ld-skill">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="ld-card">
            <div className="ld-card__head">
              <h3>Recent Messages</h3>
              <button type="button" className="ld-link" onClick={() => navigate('messages')}>
                View All
              </button>
            </div>
            <div className="ld-message">
              <img
                src="https://ui-avatars.com/api/?name=Suresh+Reddy&background=15803d&color=fff&size=64"
                alt=""
              />
              <div style={{ flex: 1 }}>
                <div className="ld-message__name">Suresh Reddy</div>
                <div className="ld-message__text">Are you available tomorrow for chili work?</div>
              </div>
              <span className="ld-message__time">2h</span>
            </div>
            <div className="ld-message">
              <img
                src="https://ui-avatars.com/api/?name=John+Kumar&background=0d9488&color=fff&size=64"
                alt=""
              />
              <div style={{ flex: 1 }}>
                <div className="ld-message__name">John Kumar</div>
                <div className="ld-message__text">Your application has been shortlisted.</div>
              </div>
              <span className="ld-message__time">1d</span>
            </div>
          </div>

          {upcomingJob && (
            <div className="ld-card">
              <h3>Upcoming Work</h3>
              <div className="ld-upcoming" style={{ marginTop: '0.75rem' }}>
                <h4>{upcomingJob.title}</h4>
                <p>
                  {[upcomingJob.village, upcomingJob.mandal].filter(Boolean).join(', ') ||
                    upcomingJob.location}
                </p>
                <p>
                  {formatDate(upcomingJob.startDate)} · {formatINR(upcomingJob.wages)}/day ·{' '}
                  {upcomingJob.Timings || '10:00 AM – 5:00 PM'}
                </p>
              </div>
            </div>
          )}

          {(profileCompletion ?? 0) < 100 && (
            <div className="ld-card" style={{ background: '#f0fdf4' }}>
              <h3>Complete your profile</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.5rem 0' }}>
                {profileCompletion ?? 0}% completed — get more job matches.
              </p>
              <div
                style={{
                  height: 8,
                  borderRadius: 999,
                  background: '#dcfce7',
                  overflow: 'hidden',
                  marginBottom: '0.75rem',
                }}
              >
                <div
                  style={{
                    width: `${profileCompletion ?? 0}%`,
                    height: '100%',
                    background: '#16a34a',
                    borderRadius: 999,
                  }}
                />
              </div>
              <button type="button" className="ld-apply-btn" onClick={() => navigate('settings')}>
                Complete Now →
              </button>
            </div>
          )}
        </aside>
      </section>
    </div>
  )
}

export default LabourDashboard

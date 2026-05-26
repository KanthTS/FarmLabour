import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineLocationMarker, HiOutlineSearch } from 'react-icons/hi'
import { createObj } from '../contexts/FarmerLabourContext'
import client from '../../api/client'
import thumbChilli from '../../images/home-post-job.jpg'
import thumbCotton from '../../images/home-hero-panel.jpg'
import thumbField from '../../images/home-categories-panel.jpg'
import './FarmerDashboard.css'

const JOB_THUMBS = [thumbChilli, thumbCotton, thumbField]

function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function AllJobs() {
  const { currentUser } = useContext(createObj)
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => {
    if (!currentUser) return
    const load = async () => {
      setLoading(true)
      setErr('')
      try {
        const res = await client.get('/jobs', { params: { search: '' } })
        const all = res.data?.payload || []
        const others = all.filter(
          (job) =>
            job.isJobActive !== false &&
            job.farmerData?.email &&
            job.farmerData.email !== currentUser.email
        )
        setJobs(others)
      } catch {
        setErr('Could not load jobs. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [currentUser])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const loc = location.trim().toLowerCase()
    return jobs.filter((job) => {
      const matchTitle = !q || job.title?.toLowerCase().includes(q)
      const matchLoc =
        !loc ||
        job.location?.toLowerCase().includes(loc) ||
        job.city?.toLowerCase().includes(loc) ||
        job.village?.toLowerCase().includes(loc)
      return matchTitle && matchLoc
    })
  }, [jobs, search, location])

  if (!currentUser) return null

  return (
    <div className="farmer-dashboard">
      <div className="fd-card">
        <h3>All Jobs</h3>
        <p className="fd-card__sub">
          Browse active jobs posted by other farmers on the platform.
        </p>

        <div className="fd-alljobs-filters">
          <div className="fd-alljobs-search">
            <HiOutlineSearch />
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <input
            type="text"
            className="fd-alljobs-location"
            placeholder="Filter by location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      {loading && <p className="fd-loading">Loading jobs…</p>}
      {err && <p className="fd-empty" style={{ color: '#dc2626' }}>{err}</p>}

      {!loading && !err && filtered.length === 0 && (
        <p className="fd-empty">No jobs from other farmers right now.</p>
      )}

      {!loading &&
        filtered.map((job, index) => {
          const farmerName =
            job.farmerData?.nameOfFarmer || job.farmerData?.email?.split('@')[0] || 'Farmer'
          const avatar =
            job.farmerData?.profileImageUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(farmerName)}&background=15803d&color=ffffff&size=64`

          return (
            <article key={job._id || job.jobId} className="fd-card fd-alljobs-card">
              <div className="fd-job-item" style={{ marginBottom: 0, border: 0, background: 'transparent' }}>
                <img src={JOB_THUMBS[index % JOB_THUMBS.length]} alt="" />
                <div style={{ flex: 1 }}>
                  <div className="fd-job-item__title">{job.title}</div>
                  <div className="fd-job-item__meta">
                    <span>
                      <HiOutlineLocationMarker style={{ verticalAlign: 'middle' }} />{' '}
                      {[job.village, job.mandal, job.city, job.location].filter(Boolean).join(', ')}
                    </span>
                    <span>{formatDate(job.DateOfCreation || job.createdAt)}</span>
                    <span>{job.workersNeeded} workers · ₹{job.wages}/day</span>
                  </div>
                  <p className="fd-alljobs-desc">
                    {job.content?.length > 140 ? `${job.content.slice(0, 140)}…` : job.content}
                  </p>
                  <div className="fd-alljobs-poster">
                    <img src={avatar} alt="" />
                    <span>Posted by {farmerName}</span>
                  </div>
                </div>
                <div className="fd-job-item__right">
                  <span className="fd-badge fd-badge--active">Open</span>
                  <button
                    type="button"
                    className="fd-link-btn"
                    style={{ marginTop: '0.5rem', display: 'block' }}
                    onClick={() => navigate(`${job.jobId}`, { state: job })}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </article>
          )
        })}
    </div>
  )
}

export default AllJobs

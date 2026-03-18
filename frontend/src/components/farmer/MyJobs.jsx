import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../../api/client'
import { createObj } from '../contexts/FarmerLabourContext'

function MyJobs() {
  const { currentUser } = useContext(createObj)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    if (!currentUser) return
    const load = async () => {
      setLoading(true)
      try {
        const res = await client.get('/jobs', { params: { search: '' } })
        const mine = res.data.payload.filter(j => j.farmerData?.email === currentUser.email)
        setJobs(mine)
      } catch (e) {
        setErr('Failed to load jobs')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [currentUser])

  if (!currentUser) return null

  return (
    <div className="fl-page">
    <div className="container">
      <div className="fl-card p-3 mb-3 d-flex justify-content-between align-items-center">
        <div>
          <div className="fl-section-title">My Jobs</div>
          <div className="small fl-muted">Manage your postings and review applicants.</div>
        </div>
        <button className="btn btn-success" onClick={()=>nav(`/farmerprofile/${currentUser.email}/createpost`)}>Post new job</button>
      </div>
      {loading && <p>Loading...</p>}
      {err && <p className="text-danger">{err}</p>}
      {jobs.map(job=>(
        <div className="card fl-card fl-card-hover mb-3" key={job._id}>
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">{job.title}</h5>
              <div className="text-muted small">{job.location} • ₹{job.wages}/day • {job.fieldSize}Acres</div>
              <div className="badge text-bg-secondary mt-2">{job.isJobActive ? 'Open' : 'Closed'}</div>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary btn-sm" onClick={()=>nav(`/farmerprofile/${currentUser.email}/${job.jobId}`,{state:job})}>View</button>
              <button className="btn btn-outline-secondary btn-sm" onClick={()=>nav(`/farmerprofile/${currentUser.email}/app`,{state:{jobId:job._id}})}>Applications</button>
            </div>
          </div>
        </div>
      ))}
      {!loading && jobs.length===0 && <p className="text-muted">No jobs yet. Create your first posting.</p>}
    </div>
    </div>
  )
}

export default MyJobs

import React, { useEffect, useState, useContext } from 'react'
import client from '../../api/client'
import { createObj } from '../contexts/FarmerLabourContext'

function MyApplications() {
  const { currentUser } = useContext(createObj)
  const [apps,setApps]=useState([])
  const [loading,setLoading]=useState(false)
  const [err,setErr]=useState('')

  useEffect(()=>{
    if(!currentUser) return
    const load=async()=>{
      setLoading(true)
      try{
        const res=await client.get('/applications/mine')
        setApps(res.data.payload || [])
      }catch(e){
        setErr('Failed to load applications')
      }finally{
        setLoading(false)
      }
    }
    load()
  },[currentUser])

  return (
    <div className="container py-3">
      <h4 className="mb-3">My Applications</h4>
      {loading && <p>Loading...</p>}
      {err && <p className="text-danger">{err}</p>}
      {apps.map(app=>(
        <div className="card shadow-sm mb-3" key={app._id}>
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-1">{app.fullname}</h6>
              <div className="text-muted small">Job: {app.jobId}</div>
              <div className="badge text-bg-secondary mt-1">{app.status}</div>
            </div>
            <div className="text-end small text-muted">
              {new Date(app.dateOfCreation).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
      {!loading && apps.length===0 && <p className="text-muted">No applications yet. Start applying to jobs.</p>}
    </div>
  )
}

export default MyApplications

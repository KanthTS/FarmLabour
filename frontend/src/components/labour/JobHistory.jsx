import React, { useContext, useEffect, useState } from 'react'
import client from '../../api/client'
import { createObj } from '../contexts/FarmerLabourContext'

function JobHistory(){
  const {currentUser}=useContext(createObj)
  const [apps,setApps]=useState([])
  const [loading,setLoading]=useState(false)

  useEffect(()=>{
    const load=async()=>{
      setLoading(true)
      try{
        const res=await client.get('/applications/mine')
        const done=(res.data.payload||[]).filter(a=>a.status==='hired' || a.status==='completed')
        setApps(done)
      }finally{
        setLoading(false)
      }
    }
    if(currentUser?.role==='labour') load()
  },[currentUser])

  if(!currentUser || currentUser.role!=='labour') return null

  return(
    <div className="container py-3">
      <h4>Job history</h4>
      {loading && <p>Loading...</p>}
      {apps.map(a=>(
        <div className="card shadow-sm mb-2" key={a._id}>
          <div className="card-body d-flex justify-content-between">
            <div>
              <div className="fw-semibold">Job: {a.jobId}</div>
              <div className="text-muted small">Status: {a.status}</div>
              <div className="text-muted small">Skills: {a.skills}</div>
            </div>
            <div className="text-muted small">{new Date(a.dateOfCreation).toLocaleDateString()}</div>
          </div>
        </div>
      ))}
      {!loading && apps.length===0 && <p className="text-muted">No job history yet.</p>}
    </div>
  )
}

export default JobHistory

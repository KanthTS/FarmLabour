 import React, { useContext, useEffect, useState } from 'react'
import { createObj } from '../contexts/FarmerLabourContext'
import client from '../../api/client'

function HiredWorkers(){
  const {currentUser}=useContext(createObj)
  const [apps,setApps]=useState([])
  const [loading,setLoading]=useState(false)

  useEffect(()=>{
    const load=async()=>{
      setLoading(true)
      try{
        const res=await client.get('/applications/mine')
        const hired=(res.data.payload||[]).filter(a=>a.status==='hired')
        setApps(hired)
      }finally{
        setLoading(false)
      }
    }
    if(currentUser?.role==='farmer') load()
  },[currentUser])

  if(!currentUser || currentUser.role!=='farmer') return null

  return(
    <div className="fl-page">
    <div className="container">
      <div className="fl-card p-3 mb-3">
        <div className="fl-section-title">Hired workers</div>
        <div className="small fl-muted">People you have hired for your jobs.</div>
      </div>
      {loading && <p>Loading...</p>}
      {apps.map(a=>(
        <div className="card fl-card fl-card-hover mb-2" key={a._id}>
          <div className="card-body d-flex justify-content-between">
            <div>
              <div className="fw-semibold">{a.fullname}</div>
              <div className="text-muted small">Job: {a.jobId}</div>
              <div className="text-muted small">Skills: {a.skills}</div>
            </div>
            <div className="badge text-bg-success">Hired</div>
          </div>
        </div>
      ))}
      {!loading && apps.length===0 && <p className="text-muted">No hired workers yet.</p>}
    </div>
    </div>
  )
}

export default HiredWorkers

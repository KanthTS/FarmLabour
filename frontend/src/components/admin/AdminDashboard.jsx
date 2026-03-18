import React, { useEffect, useState, useContext } from 'react'
import client from '../../api/client'
import { createObj } from '../contexts/FarmerLabourContext'

function AdminDashboard() {
  const { currentUser } = useContext(createObj)
  const [summary,setSummary]=useState(null)
  const [users,setUsers]=useState([])
  const [jobs,setJobs]=useState([])
  const [err,setErr]=useState('')

  useEffect(()=>{
    const load=async()=>{
      try{
        const [s,u,j]=await Promise.all([
          client.get('/admin/analytics/summary'),
          client.get('/admin/users'),
          client.get('/jobs')
        ])
        setSummary(s.data.payload)
        setUsers(u.data.payload)
        setJobs(j.data.payload)
      }catch(e){
        setErr('Failed to load admin data')
      }
    }
    if(currentUser?.role==='admin') load()
  },[currentUser])

  if(!currentUser || currentUser.role!=='admin') return null

  return (
    <div className="container py-4">
      <h3 className="mb-3">Admin Dashboard</h3>
      {err && <p className="text-danger">{err}</p>}
      {summary && (
        <div className="row mb-4">
          <div className="col-md-4"><div className="card shadow-sm p-3">Users: {summary.users}</div></div>
          <div className="col-md-4"><div className="card shadow-sm p-3">Jobs: {summary.jobs}</div></div>
          <div className="col-md-4"><div className="card shadow-sm p-3">Applications: {summary.applications}</div></div>
        </div>
      )}
      <h5>Users</h5>
      <div className="table-responsive mb-4">
        <table className="table table-sm">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
          <tbody>
            {users.map(u=>(
              <tr key={u._id}>
                <td>{u.firstName} {u.lastName}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isActive ? 'Active' : 'Suspended'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h5>Jobs</h5>
      <div className="table-responsive">
        <table className="table table-sm">
          <thead><tr><th>Title</th><th>Farmer</th><th>Status</th></tr></thead>
          <tbody>
            {jobs.map(j=>(
              <tr key={j._id}>
                <td>{j.title}</td>
                <td>{j.farmerData?.email}</td>
                <td>{j.isJobActive?'Open':'Closed'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminDashboard

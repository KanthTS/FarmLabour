import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import client from '../../api/client'
import { createObj } from '../contexts/FarmerLabourContext'
import './LabourDashboard.css'

function LabourMe() {
  const { currentUser, setCurrentUser } = useContext(createObj)
  const { register, handleSubmit, reset } = useForm()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (!currentUser) return
    const load = async () => {
      setLoading(true)
      setErr('')
      try {
        const res = await client.get('/labour-api/me')
        reset({
          firstName: res.data.user?.firstName || '',
          lastName: res.data.user?.lastName || '',
          phoneNo: res.data.user?.phoneNo || '',
          location: res.data.user?.location || '',
          profileImageUrl: res.data.user?.profileImageUrl || '',
          skills: (res.data.user?.skills || []).join(', '),
          tools: (res.data.user?.tools || []).join(', '),
          experienceYears: res.data.user?.experienceYears ?? 0,
          preferredWage: res.data.user?.preferredWage ?? '',
          availability: res.data.user?.availability || ''
        })
      } catch (e) {
        setErr('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [currentUser, reset])

  async function onSave(values) {
    setSaving(true)
    setErr('')
    try {
      const payload = {
        ...values,
        skills: values.skills ? values.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        tools: values.tools ? values.tools.split(',').map(s => s.trim()).filter(Boolean) : [],
        experienceYears: Number(values.experienceYears || 0),
        preferredWage: values.preferredWage === '' ? undefined : Number(values.preferredWage)
      }
      const res = await client.put('/labour-api/me', payload)
      if (res.data?.user) setCurrentUser({ ...currentUser, ...res.data.user })
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (!currentUser) return null

  return (
    <div className="labour-dashboard">
      <div className="ld-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3 style={{ margin: 0 }}>My Profile</h3>
                <p className="ld-job__meta" style={{ marginTop: '0.35rem' }}>Update skills, experience and Mantralayam area location.</p>
              </div>
            </div>

            {loading && <p>Loading...</p>}
            {err && <p className="text-danger">{err}</p>}

            {!loading && (
              <form onSubmit={handleSubmit(onSave)}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">First Name</label>
                    <input className="form-control" {...register('firstName')} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last Name</label>
                    <input className="form-control" {...register('lastName')} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input className="form-control" {...register('phoneNo')} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Location</label>
                    <input className="form-control" {...register('location')} />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Profile Image URL</label>
                    <input className="form-control" {...register('profileImageUrl')} />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Skills (comma separated)</label>
                    <input className="form-control" placeholder="Harvesting, Ploughing" {...register('skills')} />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Tools (comma separated)</label>
                    <input className="form-control" placeholder="Tractor, Sprayer" {...register('tools')} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Experience (years)</label>
                    <input type="number" min="0" className="form-control" {...register('experienceYears')} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Preferred Wage</label>
                    <input type="number" min="0" className="form-control" {...register('preferredWage')} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Availability</label>
                    <input className="form-control" placeholder="Weekends / Full-time" {...register('availability')} />
                  </div>
                </div>
                <div className="d-flex justify-content-end mt-4">
                  <button className="ld-apply-btn" type="submit" disabled={saving} style={{ padding: '0.65rem 1.5rem' }}>
                    {saving ? 'Saving...' : 'Save profile'}
                  </button>
                </div>
              </form>
            )}
      </div>
    </div>
  )
}

export default LabourMe


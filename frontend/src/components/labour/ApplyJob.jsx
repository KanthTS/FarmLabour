import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createObj } from '../contexts/FarmerLabourContext'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import client from '../../api/client'
import {
  SERVICE_STATE_LABEL,
  SERVICE_DISTRICT,
  SERVICE_MANDAL,
  SERVICE_REGION_NOTE,
  getVillages,
  buildLocationLabel,
} from '../../locationData'
import {
  HiOutlineCheckCircle,
  HiOutlineLocationMarker,
  HiOutlineClock,
} from 'react-icons/hi'
import './LabourDashboard.css'
import '../farmer/CreatePost.css'

const WORKING_HOURS = [
  '10:00 AM – 5:00 PM',
  '6:00 AM – 2:00 PM',
  '7:00 AM – 4:00 PM',
  '8:00 AM – 5:00 PM',
  'Full day (flexible)',
]

function ApplyJob() {
  const loc = useLocation()
  const { jobId: paramJobId } = useParams()
  const jobId = loc.state?.job?._id || loc.state?.jobId || loc.state || paramJobId
  const jobPreview = loc.state?.job

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: { workinghours: '10:00 AM – 5:00 PM' },
  })
  const { currentUser } = useContext(createObj)
  const nav = useNavigate()

  const [alreadyApplied, setAlreadyApplied] = useState(false)
  const [existingApp, setExistingApp] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [checking, setChecking] = useState(true)

  const villages = getVillages(SERVICE_DISTRICT, SERVICE_MANDAL)

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'labour') {
      nav('/signin')
      return
    }

    const displayName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim()
    const locStr = currentUser.location || ''
    const village =
      villages.find((v) => locStr.toLowerCase().includes(v.toLowerCase())) || ''

    reset({
      fullname: displayName,
      experience: currentUser.experienceYears
        ? `${currentUser.experienceYears} years`
        : '',
      skills: (currentUser.skills || []).join(', '),
      workinghours: currentUser.availability?.includes('10')
        ? '10:00 AM – 5:00 PM'
        : '10:00 AM – 5:00 PM',
      village,
    })

    if (!jobId) {
      setChecking(false)
      return
    }

    const check = async () => {
      try {
        const res = await client.get(`/jobs/${jobId}/applied`)
        if (res.data?.applied) {
          setAlreadyApplied(true)
          setExistingApp(res.data.payload)
        }
      } catch {
        /* ignore */
      } finally {
        setChecking(false)
      }
    }
    check()
  }, [currentUser, jobId, nav, reset, villages])

  async function onSubmit(obj) {
    setFormError('')
    if (!jobId) {
      setFormError('Job not found. Go back and select a job.')
      return
    }
    if (!obj.village) {
      setFormError('Select your village in Mantralayam mandal.')
      return
    }

    const location = buildLocationLabel({
      village: obj.village,
      mandal: SERVICE_MANDAL,
      district: SERVICE_DISTRICT,
    })

    setSubmitting(true)
    try {
      const res = await client.post(`/jobs/${jobId}/applications`, {
        fullname: obj.fullname,
        experience: obj.experience,
        workinghours: obj.workinghours,
        skills: obj.skills,
        location,
        applicationId: `${Date.now()}`,
      })
      if (res.status === 201) {
        nav(`/labourprofile/${currentUser.email}/myapplications`)
      }
    } catch (e) {
      if (e.response?.status === 409) {
        setAlreadyApplied(true)
        setExistingApp(e.response.data?.payload)
        setFormError('You have already applied to this job.')
      } else {
        setFormError(e.response?.data?.message || 'Could not submit application.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (!currentUser) return null

  if (checking) {
    return <p className="ld-loading">Checking application status…</p>
  }

  if (alreadyApplied) {
    return (
      <div className="labour-dashboard">
        <div className="ld-card ld-applied-banner">
          <HiOutlineCheckCircle className="ld-applied-banner__icon" />
          <h3>Already applied</h3>
          <p className="ld-job__meta">
            You submitted an application for this job
            {existingApp?.status ? ` (status: ${existingApp.status})` : ''}. You cannot apply
            again.
          </p>
          <div className="ld-hero__actions" style={{ marginTop: '1rem' }}>
            <button
              type="button"
              className="ld-btn-white"
              style={{ color: '#15803d' }}
              onClick={() => nav(`/labourprofile/${currentUser.email}/myapplications`)}
            >
              View My Applications
            </button>
            <button
              type="button"
              className="ld-btn-outline"
              style={{ borderColor: '#16a34a', color: '#166534' }}
              onClick={() => nav(`/labourprofile/${currentUser.email}/jobs`)}
            >
              Find other jobs
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="labour-dashboard apply-job">
      {jobPreview && (
        <div className="ld-card ld-apply-job-preview">
          <h3>{jobPreview.title}</h3>
          <p className="ld-job__meta">
            ₹{jobPreview.wages}/day · {jobPreview.Timings || '10:00 AM – 5:00 PM'} ·{' '}
            {[jobPreview.village, jobPreview.mandal].filter(Boolean).join(', ') ||
              jobPreview.location}
          </p>
        </div>
      )}

      <div className="ld-card">
        <h3>Apply for this job</h3>
        <p className="ld-job__meta" style={{ marginTop: '0.35rem' }}>
          Fill in your details. Location must be in Mantralayam mandal, AP.
        </p>
      </div>

      <p className="create-post__region-note">{SERVICE_REGION_NOTE}</p>
      {formError && <p className="ld-alert ld-alert--err">{formError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="create-post__form">
        <section className="ld-card create-post__section">
          <h4 className="create-post__section-title">Your details</h4>
          <div className="create-post__grid">
            <label className="create-post__field">
              <span>Full name</span>
              <input
                type="text"
                {...register('fullname', { required: 'Full name is required' })}
              />
              {errors.fullname && <em>{errors.fullname.message}</em>}
            </label>
            <label className="create-post__field">
              <span>Experience</span>
              <input
                type="text"
                placeholder="e.g. 5 years"
                {...register('experience', { required: 'Experience is required' })}
              />
              {errors.experience && <em>{errors.experience.message}</em>}
            </label>
            <label className="create-post__field">
              <span>
                <HiOutlineClock style={{ verticalAlign: 'middle' }} /> Working hours
              </span>
              <select {...register('workinghours', { required: true })}>
                {WORKING_HOURS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </label>
            <label className="create-post__field">
              <span>Skills</span>
              <input
                type="text"
                placeholder="Harvesting, Weeding, Planting"
                {...register('skills', { required: 'Skills are required' })}
              />
              {errors.skills && <em>{errors.skills.message}</em>}
            </label>
          </div>
        </section>

        <section className="ld-card create-post__section">
          <h4 className="create-post__section-title">
            <HiOutlineLocationMarker /> Your location
          </h4>
          <div className="create-post__grid">
            <label className="create-post__field">
              <span>State</span>
              <input type="text" value={SERVICE_STATE_LABEL} disabled className="is-disabled" />
            </label>
            <label className="create-post__field">
              <span>District</span>
              <input type="text" value={SERVICE_DISTRICT} disabled className="is-disabled" />
            </label>
            <label className="create-post__field">
              <span>Mandal</span>
              <input type="text" value={SERVICE_MANDAL} disabled className="is-disabled" />
            </label>
            <label className="create-post__field create-post__field--full">
              <span>Village</span>
              <select {...register('village', { required: 'Select your village' })}>
                <option value="">Select village in Mantralayam mandal</option>
                {villages.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              {errors.village && <em>{errors.village.message}</em>}
            </label>
          </div>
        </section>

        <div className="create-post__actions">
          <button
            type="button"
            className="fd-btn-outline"
            onClick={() => nav(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ld-apply-btn"
            disabled={submitting}
            style={{ padding: '0.7rem 1.75rem' }}
          >
            {submitting ? 'Submitting…' : 'Submit application'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ApplyJob

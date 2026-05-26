import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { createObj } from '../contexts/FarmerLabourContext'
import client from '../../api/client'
import {
  SERVICE_STATE_LABEL,
  SERVICE_DISTRICT,
  SERVICE_MANDAL,
  SERVICE_REGION_NOTE,
  getVillages,
  buildLocationLabel,
} from '../../locationData'
import './LabourDashboard.css'
import '../farmer/CreatePost.css'
import '../farmer/FarmerDashboard.css'

const VILLAGES = getVillages(SERVICE_DISTRICT, SERVICE_MANDAL)

function matchVillage(location) {
  if (!location) return ''
  const loc = location.toLowerCase()
  return VILLAGES.find((v) => loc.includes(v.toLowerCase())) || ''
}

function userToFormValues(user) {
  return {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNo: user?.phoneNo || '',
    village: matchVillage(user?.location),
    profileImageUrl: user?.profileImageUrl || '',
    skills: (user?.skills || []).join(', '),
    tools: (user?.tools || []).join(', '),
    experienceYears: user?.experienceYears ?? '',
    preferredWage: user?.preferredWage ?? '',
    availability: user?.availability || '10:00 AM – 5:00 PM',
  }
}

function LabourSettings() {
  const navigate = useNavigate()
  const {
    currentUser,
    setCurrentUser,
    applyProfileStats,
    profileCompletion,
    profileBreakdown,
    logout,
  } = useContext(createObj)

  const defaultValues = useMemo(() => userToFormValues(currentUser), [currentUser])

  const { register, handleSubmit, reset, watch } = useForm({ defaultValues })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [err, setErr] = useState('')

  const selectedVillage = watch('village')

  useEffect(() => {
    if (!currentUser?.email) return

    let cancelled = false

    async function load() {
      setLoading(true)
      setErr('')
      try {
        const res = await client.get('/labour-api/me')
        if (cancelled) return

        const user = res.data.user || currentUser
        setCurrentUser(user)
        applyProfileStats(user, res.data.profileCompletion, res.data.profileBreakdown)
        reset(userToFormValues(user))
      } catch {
        if (!cancelled) {
          reset(userToFormValues(currentUser))
          applyProfileStats(currentUser, null, null)
          setErr('Could not reach server. Showing saved profile — you can still edit and save.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [currentUser?.email])

  async function onSave(values) {
    if (!values.village) {
      setErr('Please select your village in Mantralayam mandal.')
      return
    }

    setSaving(true)
    setErr('')
    setMessage('')
    try {
      const location = buildLocationLabel({
        village: values.village,
        mandal: SERVICE_MANDAL,
        district: SERVICE_DISTRICT,
      })
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNo: values.phoneNo,
        location,
        profileImageUrl: values.profileImageUrl || '',
        skills: values.skills
          ? values.skills.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        tools: values.tools
          ? values.tools.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        experienceYears: Number(values.experienceYears || 0),
        preferredWage: values.preferredWage === '' ? undefined : Number(values.preferredWage),
        availability: values.availability,
      }
      const res = await client.put('/labour-api/me', payload)
      const user = res.data.user
      setCurrentUser(user)
      applyProfileStats(user, res.data.profileCompletion, res.data.profileBreakdown)
      reset(userToFormValues(user))
      setMessage('Profile saved successfully.')
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to save profile.')
    } finally {
      setSaving(false)
    }
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  if (!currentUser) {
    return <p className="ld-loading">Please sign in to view settings.</p>
  }

  const displayName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim()
  const avatar =
    currentUser.profileImageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || 'L')}&background=15803d&color=ffffff&size=128`

  return (
    <div className="labour-dashboard">
      <div className="ld-card">
        <h3>Settings</h3>
        <p className="ld-job__meta" style={{ marginTop: '0.35rem' }}>
          Manage your profile. Location must be in Mantralayam mandal, AP.
        </p>
      </div>

      <div className="ld-card ld-settings-completion">
        <div
          className="ld-settings-completion__ring"
          style={{ '--pct': `${profileCompletion ?? 0}%` }}
        >
          <span>{profileCompletion ?? 0}%</span>
        </div>
        <div>
          <h4 style={{ margin: '0 0 0.35rem' }}>Profile completion</h4>
          <p className="ld-job__meta" style={{ margin: 0 }}>
            Same percentage as the sidebar — updated when you save.
          </p>
        </div>
      </div>

      {profileBreakdown?.length > 0 && (
        <div className="ld-card">
          <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem' }}>What counts toward 100%</h4>
          <ul className="ld-checklist">
            {profileBreakdown.map((item) => (
              <li key={item.field} className={item.complete ? 'is-done' : ''}>
                <span>{item.complete ? '✓' : '○'}</span>
                {item.field}
                {item.weight != null && (
                  <span className="ld-checklist__weight"> ({item.weight}%)</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {message && <p className="ld-alert ld-alert--ok">{message}</p>}
      {err && <p className="ld-alert ld-alert--err">{err}</p>}

      {loading && <p className="ld-loading">Loading settings…</p>}

      <form onSubmit={handleSubmit(onSave)} className="create-post__form">
        <fieldset disabled={loading} style={{ border: 0, margin: 0, padding: 0, opacity: loading ? 0.7 : 1 }}>
          <section className="ld-card create-post__section">
            <div className="ld-settings-profile-row">
              <img src={avatar} alt="" />
              <div>
                <strong>{displayName || 'Labour'}</strong>
                <p className="ld-job__meta">{currentUser.email}</p>
              </div>
            </div>

            <div className="create-post__grid" style={{ marginTop: '1rem' }}>
              <label className="create-post__field">
                <span>First name</span>
                <input type="text" {...register('firstName', { required: true })} />
              </label>
              <label className="create-post__field">
                <span>Last name</span>
                <input type="text" {...register('lastName')} />
              </label>
              <label className="create-post__field">
                <span>Phone</span>
                <input type="tel" {...register('phoneNo')} />
              </label>
              <label className="create-post__field">
                <span>Profile image URL</span>
                <input type="url" {...register('profileImageUrl')} />
              </label>
            </div>
          </section>

          <section className="ld-card create-post__section">
            <h4 className="create-post__section-title">Location (Mantralayam, AP)</h4>
            <p className="create-post__region-note" style={{ marginBottom: '1rem' }}>
              {SERVICE_REGION_NOTE}
            </p>
            <div className="create-post__grid">
              <label className="create-post__field">
                <span>State</span>
                <input type="text" value={SERVICE_STATE_LABEL} disabled className="is-disabled" readOnly />
              </label>
              <label className="create-post__field">
                <span>District</span>
                <input type="text" value={SERVICE_DISTRICT} disabled className="is-disabled" readOnly />
              </label>
              <label className="create-post__field">
                <span>Mandal</span>
                <input type="text" value={SERVICE_MANDAL} disabled className="is-disabled" readOnly />
              </label>
              <label className="create-post__field create-post__field--full">
                <span>Your village</span>
                <select {...register('village', { required: true })}>
                  <option value="">Select village</option>
                  {VILLAGES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                {selectedVillage && (
                  <small style={{ color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                    {buildLocationLabel({
                      village: selectedVillage,
                      mandal: SERVICE_MANDAL,
                      district: SERVICE_DISTRICT,
                    })}
                  </small>
                )}
              </label>
            </div>
          </section>

          <section className="ld-card create-post__section">
            <h4 className="create-post__section-title">Work details</h4>
            <div className="create-post__grid">
              <label className="create-post__field create-post__field--full">
                <span>Skills (comma separated)</span>
                <input placeholder="Harvesting, Planting, Weeding" {...register('skills')} />
              </label>
              <label className="create-post__field">
                <span>Experience (years)</span>
                <input type="number" min="0" {...register('experienceYears')} />
              </label>
              <label className="create-post__field">
                <span>Preferred wage (₹/day)</span>
                <input type="number" min="0" {...register('preferredWage')} />
              </label>
              <label className="create-post__field create-post__field--full">
                <span>Availability</span>
                <select {...register('availability')}>
                  <option value="10:00 AM – 5:00 PM">10:00 AM – 5:00 PM</option>
                  <option value="6:00 AM – 2:00 PM">6:00 AM – 2:00 PM</option>
                  <option value="7:00 AM – 4:00 PM">7:00 AM – 4:00 PM</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </label>
            </div>
          </section>

          <div className="create-post__actions">
            <button type="submit" className="ld-apply-btn" disabled={saving || loading} style={{ padding: '0.7rem 1.5rem' }}>
              {saving ? 'Saving…' : 'Save settings'}
            </button>
          </div>
        </fieldset>
      </form>

      <div className="ld-card ld-settings-signout">
        <h4 style={{ margin: '0 0 0.35rem', fontSize: '1rem' }}>Sign out</h4>
        <p className="ld-job__meta" style={{ margin: '0 0 0.75rem' }}>
          Log out of Farm Labour on this device.
        </p>
        <button type="button" className="fd-settings-logout" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  )
}

export default LabourSettings

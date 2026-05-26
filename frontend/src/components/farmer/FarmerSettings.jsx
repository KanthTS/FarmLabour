import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { createObj } from '../contexts/FarmerLabourContext'
import client from '../../api/client'
import './FarmerDashboard.css'

function FarmerSettings() {
  const { currentUser, setCurrentUser, logout } = useContext(createObj)
  const navigate = useNavigate()
  const { register, handleSubmit, reset, watch } = useForm()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [err, setErr] = useState('')

  const profileImageUrl = watch('profileImageUrl')

  useEffect(() => {
    if (!currentUser) return
    const load = async () => {
      setLoading(true)
      setErr('')
      try {
        const res = await client.get('/farmer-api/me')
        const user = res.data.user || currentUser
        reset({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phoneNo: user.phoneNo || '',
          location: user.location || '',
          profileImageUrl: user.profileImageUrl || '',
          email: user.email || currentUser.email,
        })
      } catch {
        reset({
          firstName: currentUser.firstName || '',
          lastName: currentUser.lastName || '',
          phoneNo: currentUser.phoneNo || '',
          location: currentUser.location || '',
          profileImageUrl: currentUser.profileImageUrl || '',
          email: currentUser.email || '',
        })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [currentUser, reset])

  async function onSave(values) {
    setSaving(true)
    setErr('')
    setMessage('')
    try {
      const res = await client.put('/farmer-api/me', {
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNo: values.phoneNo,
        location: values.location,
        profileImageUrl: values.profileImageUrl,
      })
      const updated = res.data.user
      setCurrentUser({ ...currentUser, ...updated })
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

  if (!currentUser) return null

  const displayName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim()
  const avatar =
    profileImageUrl ||
    currentUser.profileImageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=15803d&color=ffffff&size=128`

  return (
    <div className="farmer-dashboard">
      <div className="fd-card">
        <h3>Settings</h3>
        <p className="fd-card__sub">Manage your farmer profile and account preferences.</p>
      </div>

      {loading && <p className="fd-loading">Loading settings…</p>}

      {!loading && (
        <>
          <div className="fd-card fd-settings-profile">
            <img src={avatar} alt="" className="fd-settings-avatar" />
            <div>
              <p className="fd-settings-name">{displayName}</p>
              <p className="fd-card__sub">{currentUser.email}</p>
              <span className="fd-badge fd-badge--active">Farmer account</span>
            </div>
          </div>

          {message && <p className="fd-settings-alert fd-settings-alert--ok">{message}</p>}
          {err && <p className="fd-settings-alert fd-settings-alert--err">{err}</p>}

          <form onSubmit={handleSubmit(onSave)} className="fd-card fd-settings-form">
            <h4 className="fd-settings-section-title">Profile information</h4>
            <div className="fd-settings-grid">
              <label className="fd-settings-field">
                <span>First name</span>
                <input type="text" {...register('firstName', { required: true })} />
              </label>
              <label className="fd-settings-field">
                <span>Last name</span>
                <input type="text" {...register('lastName')} />
              </label>
              <label className="fd-settings-field">
                <span>Phone number</span>
                <input type="tel" placeholder="+91 98765 43210" {...register('phoneNo')} />
              </label>
              <label className="fd-settings-field">
                <span>Location</span>
                <input type="text" placeholder="Village, District, State" {...register('location')} />
              </label>
              <label className="fd-settings-field fd-settings-field--full">
                <span>Profile image URL</span>
                <input type="url" placeholder="https://..." {...register('profileImageUrl')} />
              </label>
              <label className="fd-settings-field fd-settings-field--full">
                <span>Email</span>
                <input type="email" disabled {...register('email')} />
                <small>Email cannot be changed here.</small>
              </label>
            </div>

            <div className="fd-settings-actions">
              <button type="submit" className="fd-btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>

          <div className="fd-card fd-settings-form">
            <h4 className="fd-settings-section-title">Account</h4>
            <p className="fd-card__sub">
              Password change and two-factor authentication will be available in a future update.
            </p>
          </div>

          <div className="fd-card fd-settings-danger">
            <h4 className="fd-settings-section-title">Sign out</h4>
            <p className="fd-card__sub">Log out of Farm Labour on this device.</p>
            <button type="button" className="fd-settings-logout" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default FarmerSettings

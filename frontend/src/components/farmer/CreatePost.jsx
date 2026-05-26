import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createObj } from '../contexts/FarmerLabourContext'
import { useForm } from 'react-hook-form'
import client from '../../api/client'
import { useTranslation } from 'react-i18next'
import {
  SERVICE_STATE_CODE,
  SERVICE_STATE_LABEL,
  SERVICE_REGION_NOTE,
  SERVICE_DISTRICT,
  SERVICE_MANDAL,
  getVillages,
  getZipcode,
  buildLocationLabel,
  isServiceLocation,
} from '../../locationData'
import {
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineCurrencyRupee,
  HiOutlineUsers,
} from 'react-icons/hi'
import './FarmerDashboard.css'
import './CreatePost.css'

const TIMING_OPTIONS = [
  '10:00 AM – 5:00 PM',
  '6:00 AM – 2:00 PM',
  '7:00 AM – 4:00 PM',
  '8:00 AM – 5:00 PM',
  '6:00 AM – 6:00 PM (Full day)',
  'Flexible / Discuss on call',
]

function CreatePost() {
  const nav = useNavigate()
  const [minDate, setMinDate] = useState('')
  const [district, setDistrict] = useState('')
  const [mandal, setMandal] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      state: SERVICE_STATE_CODE,
      Timings: TIMING_OPTIONS[0],
    },
  })

  const { currentUser } = useContext(createObj)
  const { t } = useTranslation()

  const villages = getVillages(SERVICE_DISTRICT, SERVICE_MANDAL)
  const selectedVillage = watch('village')

  useEffect(() => {
    setMinDate(new Date().toISOString().split('T')[0])
    setDistrict(SERVICE_DISTRICT)
    setMandal(SERVICE_MANDAL)
    setValue('city', SERVICE_DISTRICT)
    setValue('mandal', SERVICE_MANDAL)
    if (!currentUser || currentUser.role !== 'farmer') {
      nav('/signin')
    }
  }, [currentUser, nav, setValue])

  useEffect(() => {
    if (selectedVillage && district && mandal) {
      const zip = getZipcode(district, mandal, selectedVillage)
      if (zip) setValue('zipcode', zip)
    }
  }, [selectedVillage, district, mandal, setValue])

  async function onSubmit(obj) {
    setFormError('')

    if (!isServiceLocation({ district, mandal, village: obj.village })) {
      setFormError('Please select a village under Mantralayam mandal only.')
      return
    }

    const payload = {
      ...obj,
      state: SERVICE_STATE_CODE,
      city: district,
      mandal,
      village: obj.village,
      location: buildLocationLabel({
        village: obj.village,
        mandal,
        district,
      }),
      fieldSize: String(obj.fieldSize),
      zipcode: Number(obj.zipcode),
      farmerData: {
        nameOfFarmer: currentUser.firstName,
        email: currentUser.email,
        profileImageUrl: currentUser.profileImageUrl || '',
      },
      reviewData: {
        nameOfFarmer: currentUser.firstName,
        rating: 5,
        comment: '',
        profileImageUrl: currentUser.profileImageUrl || '',
      },
    }

    setSubmitting(true)
    try {
      const res = await client.post('/jobs', payload)
      if (res.status === 201) {
        nav(`/farmerprofile/${currentUser.email}/myjobs`)
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Something went wrong while posting the job.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!currentUser) return null

  return (
    <div className="farmer-dashboard create-post">
      <div className="fd-card create-post__header">
        <div>
          <h3>{t('createPost.title', { defaultValue: 'Post a Job' })}</h3>
          <p className="fd-card__sub">
            Share work details so skilled labourers near you can apply.
          </p>
        </div>
        <span className="create-post__region-badge">
          <HiOutlineLocationMarker /> {SERVICE_STATE_LABEL}
        </span>
      </div>

      <div className="create-post__region-note">
        <strong>Service area:</strong> {SERVICE_REGION_NOTE}
      </div>

      {formError && <p className="fd-settings-alert fd-settings-alert--err">{formError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="create-post__form">
        <input type="hidden" {...register('state')} value={SERVICE_STATE_CODE} />
        <input type="hidden" {...register('city')} value={district} />
        <input type="hidden" {...register('mandal')} value={mandal} />

        <section className="fd-card create-post__section">
          <h4 className="create-post__section-title">Job details</h4>
          <div className="create-post__grid">
            <label className="create-post__field create-post__field--full">
              <span>Job title</span>
              <input
                type="text"
                placeholder="e.g. Chili harvesting, Cotton picking"
                {...register('title', { required: 'Job title is required' })}
              />
              {errors.title && <em>{errors.title.message}</em>}
            </label>

            <label className="create-post__field create-post__field--full">
              <span>Description</span>
              <textarea
                rows={3}
                placeholder="Describe the work, crop, tools provided, etc."
                {...register('content', { required: 'Description is required' })}
              />
              {errors.content && <em>{errors.content.message}</em>}
            </label>

            <label className="create-post__field">
              <span>Field size (acres)</span>
              <input
                type="number"
                min="0.5"
                step="0.5"
                placeholder="e.g. 5"
                {...register('fieldSize', { required: 'Field size is required', min: 0.5 })}
              />
              {errors.fieldSize && <em>{errors.fieldSize.message}</em>}
            </label>

            <label className="create-post__field">
              <span>
                <HiOutlineCurrencyRupee style={{ verticalAlign: 'middle' }} /> Daily wage (₹)
              </span>
              <input
                type="number"
                min="100"
                step="50"
                placeholder="e.g. 600"
                {...register('wages', { required: 'Wage is required', min: 100 })}
              />
              {errors.wages && <em>{errors.wages.message}</em>}
            </label>

            <label className="create-post__field">
              <span>
                <HiOutlineUsers style={{ verticalAlign: 'middle' }} /> Workers needed
              </span>
              <input
                type="number"
                min="1"
                max="200"
                placeholder="e.g. 10"
                {...register('workersNeeded', { required: 'Required', min: 1 })}
              />
              {errors.workersNeeded && <em>{errors.workersNeeded.message}</em>}
            </label>

            <label className="create-post__field">
              <span>
                <HiOutlineCalendar style={{ verticalAlign: 'middle' }} /> Work timings
              </span>
              <select {...register('Timings', { required: 'Select timings' })}>
                {TIMING_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.Timings && <em>{errors.Timings.message}</em>}
            </label>
          </div>
        </section>

        <section className="fd-card create-post__section">
          <h4 className="create-post__section-title">
            <HiOutlineLocationMarker /> Location (Andhra Pradesh)
          </h4>
          <p className="fd-card__sub create-post__location-hint">
            Select your village — {villages.length} villages under Mantralayam mandal (PIN 518345).
          </p>

          <div className="create-post__grid">
            <label className="create-post__field">
              <span>State</span>
              <input type="text" value={SERVICE_STATE_LABEL} disabled className="is-disabled" />
            </label>

            <label className="create-post__field">
              <span>District</span>
              <input
                type="text"
                value={SERVICE_DISTRICT}
                disabled
                className="is-disabled"
                readOnly
              />
            </label>

            <label className="create-post__field">
              <span>Mandal</span>
              <input
                type="text"
                value={SERVICE_MANDAL}
                disabled
                className="is-disabled"
                readOnly
              />
            </label>

            <label className="create-post__field create-post__field--full">
              <span>Village</span>
              <select {...register('village', { required: 'Select a village' })}>
                <option value="">Select village in Mantralayam mandal</option>
                {villages.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              {errors.village && <em>{errors.village.message}</em>}
            </label>

            <label className="create-post__field">
              <span>PIN code</span>
              <input
                type="number"
                readOnly
                placeholder="Auto-filled"
                {...register('zipcode', { required: 'PIN is required' })}
              />
              {errors.zipcode && <em>{errors.zipcode.message}</em>}
            </label>
          </div>
        </section>

        <section className="fd-card create-post__section">
          <h4 className="create-post__section-title">Schedule</h4>
          <div className="create-post__grid">
            <label className="create-post__field">
              <span>Start date</span>
              <input
                type="date"
                min={minDate}
                {...register('startDate', { required: 'Start date is required' })}
              />
              {errors.startDate && <em>{errors.startDate.message}</em>}
            </label>

            <label className="create-post__field">
              <span>End date</span>
              <input
                type="date"
                min={minDate}
                {...register('endDate', { required: 'End date is required' })}
              />
              {errors.endDate && <em>{errors.endDate.message}</em>}
            </label>
          </div>
        </section>

        <div className="create-post__actions">
          <button
            type="button"
            className="fd-btn-outline"
            onClick={() => nav(`/farmerprofile/${currentUser.email}/`)}
          >
            Cancel
          </button>
          <button type="submit" className="fd-btn-primary" disabled={submitting}>
            {submitting ? 'Publishing…' : t('createPost.publish', { defaultValue: 'Publish job' })}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePost

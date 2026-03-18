import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useParams } from 'react-router-dom'
import { createObj } from '../contexts/FarmerLabourContext'
import client from '../../api/client'
import { useTranslation } from 'react-i18next'

function FarmerProfile() {
  const { currentUser } = useContext(createObj)
  const { email } = useParams()
  const { t } = useTranslation()
  const [activeJobsCount, setActiveJobsCount] = useState(null)
  const [applicationsCount, setApplicationsCount] = useState(null)
  const [hiredCount, setHiredCount] = useState(null)

  const displayName = useMemo(() => {
    if (!currentUser) return 'Farmer'
    return `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim()
  }, [currentUser])

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'farmer') return

    const load = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          client.get('/jobs', { params: { search: '' } }),
          client.get('/applications/mine'),
        ])

        const jobs = jobsRes.data?.payload || []
        const myActiveJobs = jobs.filter(
          (j) => j?.farmerData?.email === currentUser.email && j?.isJobActive
        )
        setActiveJobsCount(myActiveJobs.length)

        const apps = appsRes.data?.payload || []
        setApplicationsCount(apps.length)
        setHiredCount(apps.filter((a) => a?.status === 'hired').length)
      } catch (e) {
        setActiveJobsCount(0)
        setApplicationsCount(0)
        setHiredCount(0)
      }
    }

    load()
  }, [currentUser])

  return (
    <div className="container py-4">
      <div className="p-4 rounded-4 mb-3" style={{ background: 'linear-gradient(120deg, #0f9d58, #34a853)', color: 'white' }}>
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
          <div>
            <div className="fw-semibold text-uppercase small">{t('farmer.workspace')}</div>
            <h3 className="mb-1">{displayName}</h3>
            <div className="text-light text-opacity-75 small">{email}</div>
          </div>
          <div className="d-flex gap-3">
            <div className="bg-white text-dark rounded-3 px-3 py-2 shadow-sm text-center">
              <div className="small text-muted">{t('farmer.activeJobs')}</div>
              <div className="fs-5 fw-semibold">{activeJobsCount ?? '–'}</div>
            </div>
            <div className="bg-white text-dark rounded-3 px-3 py-2 shadow-sm text-center">
              <div className="small text-muted">{t('farmer.applications')}</div>
              <div className="fs-5 fw-semibold">{applicationsCount ?? '–'}</div>
            </div>
            <div className="bg-white text-dark rounded-3 px-3 py-2 shadow-sm text-center">
              <div className="small text-muted">{t('farmer.hiredWorkers')}</div>
              <div className="fs-5 fw-semibold">{hiredCount ?? '–'}</div>
            </div>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-2 mt-3">
          <Link className="btn btn-light btn-sm" to="jobs">{t('farmer.browseJobs')}</Link>
          <Link className="btn btn-outline-light btn-sm" to="createpost">{t('farmer.postJob')}</Link>
          <Link className="btn btn-outline-light btn-sm" to="app">{t('farmer.applications')}</Link>
          <Link className="btn btn-outline-light btn-sm" to="hired">{t('farmer.hired')}</Link>
          <Link className="btn btn-outline-light btn-sm" to="myjobs">{t('farmer.myJobs')}</Link>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-3">
        <div className="card-body d-flex flex-wrap gap-3">
          <div className="flex-grow-1">
            <div className="fw-semibold">{t('farmer.quickActions')}</div>
            <div className="text-muted small">{t('farmer.quickActionsSub')}</div>
            <div className="d-flex flex-wrap gap-2 mt-3">
              <Link className="btn btn-primary" to="createpost">{t('farmer.createPosting')}</Link>
              <Link className="btn btn-outline-success" to="app">{t('farmer.reviewApplications')}</Link>
              <Link className="btn btn-outline-secondary" to="hired">{t('farmer.viewHired')}</Link>
            </div>
          </div>
          <div className="vr d-none d-md-block" />
          <div className="d-flex flex-column gap-2" style={{ minWidth: '220px' }}>
            <div className="small text-muted">{t('farmer.account')}</div>
            <span className="badge text-bg-success w-fit">{t('farmer.farmerAccount')}</span>
            <span className="badge text-bg-light border w-fit">{t('farmer.secureLoginActive')}</span>
            <span className="badge text-bg-light border w-fit">{t('farmer.chatReviewsAvailable')}</span>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  )
}

export default FarmerProfile

import React from 'react'

import { Link,Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
function LabourProfile() {
  const { t } = useTranslation()
  
  return (
    <div className="fl-page">
      <div className="container">
        <div className="fl-card p-3 mb-3 fl-pill-nav">
          <div className="d-flex flex-wrap gap-2">
            <Link to="me" className="btn btn-outline-dark btn-sm">My Profile</Link>
            <Link to="jobs" className="btn btn-success btn-sm">{t('labour.jobs')}</Link>
            <Link to="app" className="btn btn-outline-success btn-sm">{t('labour.applications')}</Link>
            <Link to="myapplications" className="btn btn-outline-primary btn-sm">My Applications</Link>
            <Link to="history" className="btn btn-outline-secondary btn-sm">Job History</Link>
          </div>
        </div>
        <Outlet/>
      </div>
    </div>
  )
}

export default LabourProfile
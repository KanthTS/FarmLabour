import React from 'react'
import { useNavigate } from 'react-router-dom'
import './FarmerDashboard.css'

function FarmerComingSoon({ title, description }) {
  const navigate = useNavigate()

  return (
    <div className="farmer-dashboard">
      <div className="fd-card fd-coming-soon">
        <span className="fd-coming-soon__icon" aria-hidden>🚧</span>
        <h3>{title}</h3>
        <p className="fd-card__sub">{description}</p>
        <p className="fd-coming-soon__note">This feature is planned for a future update.</p>
        <button type="button" className="fd-btn-primary" onClick={() => navigate('')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}

export default FarmerComingSoon

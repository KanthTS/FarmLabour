import { useContext, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { createObj } from '../contexts/FarmerLabourContext'
import HomeBackground from './HomeBackground'
import HeroSection from './HeroSection'
import HowItWorksSection from './HowItWorksSection'
import RoleSection from './RoleSection'
import CategoriesSection from './CategoriesSection'
import FeaturesSection from './FeaturesSection'
import StatsSection from './StatsSection'
import CTASection from './CTASection'
import './home.css'

export default function HomePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useContext(createObj)

  useEffect(() => {
    if (currentUser?.role === 'farmer') {
      navigate(`/farmerprofile/${currentUser.email}`)
    }
    if (currentUser?.role === 'labour') {
      navigate(`/labourprofile/${currentUser.email}`)
    }
  }, [currentUser?.role, currentUser?.email, navigate])

  return (
    <div className="home-page">
      <HomeBackground />
      <HeroSection refreshKey={location.key} />
      <HowItWorksSection />
      <RoleSection />
      <CategoriesSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
    </div>
  )
}

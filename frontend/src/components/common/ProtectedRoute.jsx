import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { createObj } from '../contexts/FarmerLabourContext'

function ProtectedRoute({ allowedRoles }) {
  const { currentUser, loading } = useContext(createObj)
  if (loading) return null
  if (!currentUser) return <Navigate to="/signin" replace />
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}

export default ProtectedRoute

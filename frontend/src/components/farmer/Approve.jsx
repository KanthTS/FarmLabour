import React, { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { createObj } from '../contexts/FarmerLabourContext'


function Approve() {
  const {currentUser,setCurrentUser}=useContext(createObj)
   const loc=useLocation()
  
   const state=loc.state
   console.log("state",state)
  return (
    <div>
      <div className="text-center fs-4 text-success" style={{border:'solid 1px ',}}>Approved Successfully </div>
      <div>
    
      
      </div>
    </div>
  )
}

export default Approve
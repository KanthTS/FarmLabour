import React from 'react'

import { Link,Outlet } from 'react-router-dom'
function LabourProfile() {
  
  return (
    <div >
       <div className=" d-flex justify-content-around fs-5  m-5"  style={{boxShadow:"0px 2px 6px 2px"}}>
      <div className="text-success m-3" style={{border:"solid ",padding:'5px'}}>
        <Link to="jobs">Jobs</Link>
        </div>
        <div className="text-success m-3" style={{border:"solid ",padding:'5px'}} >
                 <Link to="app">Applications</Link>
               </div>
      
      </div>
     
      <Outlet/>
    </div>
  )
}

export default LabourProfile
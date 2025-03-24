import React from 'react' 
import {Link, Outlet} from 'react-router-dom'
function FarmerProfile() {

  return (
    <div>
      <div className=" d-flex justify-content-around fs-5  m-5">
      <div className="text-success ">
        <Link to="jobs">Jobs</Link>
        </div>
        <div className="text-success ">
          <Link to="createpost">CreatePost</Link>
          </div>
        <div className="text-success">
          <Link to="app">Applications</Link>
        </div>
      </div>
     
      <Outlet/>
    </div>
  )
}

export default FarmerProfile
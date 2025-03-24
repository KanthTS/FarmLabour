import React, { useContext } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useClerk, useUser} from '@clerk/clerk-react'
import { createObj } from '../contexts/FarmerLabourContext'
function Header() {
   const {signOut}=useClerk()
   const {currentUser,setCurrentUser}=useContext(createObj)
   const {isSignedIn,user,isLoaded}=useUser()
   const nav=useNavigate()
   console.log(isLoaded);
   console.log(isSignedIn);
   console.log(user)
   async function signedOut(){
        setCurrentUser(null)
        nav('/')
        await signOut()
   }
  return (
 
  <div className="bg-black">
    <div className="d-flex justify-content-between m-3  header">
      <div>
      <ul >
        <li className="nav-link m-2 text-white" style={{fontSize:"25px",marginTop:"10px"}}>Farm Labour</li>
      </ul>
      
      </div>
      <div >
       {
        !isSignedIn?<>
         <ul className="d-flex "style={{fontSize:"16px",marginTop:"10px"}}>
          <li className="nav-link m-2 px-4 ">
            <Link to="/"className="u" >Home</Link>
          </li>
          <li className="nav-link m-2 px-4 ">
            <Link to="howitworks"className="u" >How It Works</Link>
          </li>
          {/* <li className="nav-link m-2 px-4 ">
            <Link to="joblistings"className="u" >Job Listings</Link>
          </li> */}
          <li className="nav-link m-2 px-4 ">
            <Link to="about"className="u" >About</Link>
          </li>
          <li className="nav-link m-2 px-4">
            <Link to="signin" className="u">SignIn</Link>
          </li>
          <li className="nav-link m-2 px-4">
            <Link to="signup" className="u">SignUp</Link>
          </li>
        </ul>
        </>:<>
          <div className="d-flex ">
          <img src={user.imageUrl} width="40px" className="m-1"/>
            <p className='text-white m-4 fs-5'>{user.firstName}</p>
          
          </div>
          <button type="button" className='btn btn-warning 'onClick={signedOut} style={{position:"relative",left:"50%"}}>Signout</button>
        </>
       }
      </div>
    </div>
    
  </div>    
)
}

export default Header
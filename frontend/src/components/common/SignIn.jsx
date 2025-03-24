import React from 'react'
import { SignIn } from '@clerk/clerk-react'
function Signin() {
  return (
  <div className="signin">
  <div style={{position:"absolute",left:"35%",top:"25%"}}>
<SignIn  />
    </div>
  </div>
  )
}

export default Signin
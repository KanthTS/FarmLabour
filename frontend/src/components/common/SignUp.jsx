import React from 'react'
import {SignUp} from '@clerk/clerk-react'
function signUp() {
  return (
    <div>
      <div style={{position:"absolute",left:"35%",top:"25%"}}>
      <SignUp/>
      </div>
    </div>
  )
}

export default signUp
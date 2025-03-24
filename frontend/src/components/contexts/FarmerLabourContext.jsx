import React, { createContext, useState } from 'react'
export const createObj=createContext()
function FarmerLabourContext({children}) {
  let [currentUser,setCurrentUser]=useState(
    {
      email:'',
      firstName:'',
      lastName:'',
      profileImageUrl:'',
      role:''

    }
  )
  
  return (
    <div>
    <createObj.Provider value={{currentUser,setCurrentUser}}>
       {children}
    </createObj.Provider>
    </div>
  )
}

export default FarmerLabourContext
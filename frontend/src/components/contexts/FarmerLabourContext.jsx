import React, { createContext, useEffect, useState } from 'react'
import client from '../../api/client'
export const createObj=createContext()

function FarmerLabourContext({children}) {
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('fl_user') || 'null')
    } catch {
      return null
    }
  })()
  const storedToken = localStorage.getItem('fl_token') || ''

  const [currentUser,setCurrentUser]=useState(storedUser)
  const [token,setToken]=useState(storedToken)
  const [loading,setLoading]=useState(false)

  useEffect(()=>{
    if(token){
      localStorage.setItem('fl_token',token)
    }else{
      localStorage.removeItem('fl_token')
    }
  },[token])

  useEffect(()=>{
    if(currentUser){
      localStorage.setItem('fl_user',JSON.stringify(currentUser))
    }else{
      localStorage.removeItem('fl_user')
    }
  },[currentUser])

  useEffect(()=>{
    const hydrate = async ()=>{
      if(!token || currentUser) return
      try{
        setLoading(true)
        const res = await client.get('/auth/me')
        setCurrentUser(res.data.user)
      }catch(_e){
        setCurrentUser(null)
        setToken('')
      }finally{
        setLoading(false)
      }
    }
    hydrate()
  },[token])

  function login(user, jwt){
    setCurrentUser(user)
    setToken(jwt)
  }

  function logout(){
    setCurrentUser(null)
    setToken('')
  }

  return (
    <createObj.Provider value={{currentUser,setCurrentUser,token,setToken,login,logout,loading}}>
       {children}
    </createObj.Provider>
  )
}

export default FarmerLabourContext

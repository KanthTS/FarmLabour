import React, { createContext, useCallback, useEffect, useState } from 'react'
import client from '../../api/client'
import {
  calcLabourProfileCompletion,
  getProfileCompletionBreakdown,
} from '../../utils/labourProfileCompletion'

export const createObj = createContext()

function FarmerLabourContext({ children }) {
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('fl_user') || 'null')
    } catch {
      return null
    }
  })()
  const storedToken = localStorage.getItem('fl_token') || ''

  const [currentUser, setCurrentUser] = useState(storedUser)
  const [token, setToken] = useState(storedToken)
  const [loading, setLoading] = useState(false)
  const [profileCompletion, setProfileCompletion] = useState(null)
  const [profileBreakdown, setProfileBreakdown] = useState([])

  const applyProfileStats = useCallback((user, serverPct, serverBreakdown) => {
    const pct =
      typeof serverPct === 'number'
        ? serverPct
        : calcLabourProfileCompletion(user)
    const breakdown =
      Array.isArray(serverBreakdown) && serverBreakdown.length > 0
        ? serverBreakdown
        : getProfileCompletionBreakdown(user)
    setProfileCompletion(pct)
    setProfileBreakdown(breakdown)
    return pct
  }, [])

  const refreshLabourProfile = useCallback(async () => {
    if (!token) return null
    try {
      const res = await client.get('/labour-api/me')
      const user = res.data.user
      if (user) setCurrentUser(user)
      return applyProfileStats(user, res.data.profileCompletion, res.data.profileBreakdown)
    } catch {
      try {
        const cached = JSON.parse(localStorage.getItem('fl_user') || 'null')
        if (cached?.role === 'labour') {
          return applyProfileStats(cached, null, null)
        }
      } catch {
        /* ignore */
      }
      return null
    }
  }, [token, applyProfileStats])

  useEffect(() => {
    if (token) {
      localStorage.setItem('fl_token', token)
    } else {
      localStorage.removeItem('fl_token')
    }
  }, [token])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('fl_user', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('fl_user')
    }
  }, [currentUser])

  useEffect(() => {
    const hydrate = async () => {
      if (!token || currentUser) return
      try {
        setLoading(true)
        const res = await client.get('/auth/me')
        setCurrentUser(res.data.user)
      } catch {
        setCurrentUser(null)
        setToken('')
      } finally {
        setLoading(false)
      }
    }
    hydrate()
  }, [token, currentUser])

  useEffect(() => {
    if (currentUser?.role === 'labour' && token) {
      refreshLabourProfile()
    } else if (currentUser?.role !== 'labour') {
      setProfileCompletion(null)
      setProfileBreakdown([])
    }
  }, [currentUser?.role, currentUser?.email, token, refreshLabourProfile])

  function login(user, jwt) {
    setCurrentUser(user)
    setToken(jwt)
    if (user?.role === 'labour') {
      applyProfileStats(user, null, null)
    }
  }

  function logout() {
    setCurrentUser(null)
    setToken('')
    setProfileCompletion(null)
    setProfileBreakdown([])
  }

  return (
    <createObj.Provider
      value={{
        currentUser,
        setCurrentUser,
        token,
        setToken,
        login,
        logout,
        loading,
        profileCompletion,
        profileBreakdown,
        refreshLabourProfile,
        applyProfileStats,
      }}
    >
      {children}
    </createObj.Provider>
  )
}

export default FarmerLabourContext

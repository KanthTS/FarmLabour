import React from 'react'
import Header from './components/common/Header'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './components/common/Footer'

function RootLayout() {
  const location = useLocation()
  const showFooter = location.pathname === '/'
  const isAppShell =
    location.pathname.startsWith('/farmerprofile/') ||
    location.pathname.startsWith('/labourprofile/')

  return (
    <div>
      {!isAppShell && <Header/>}
      <div style={{minHeight:'90vh'}}>
        <Outlet/>
      </div>
      {showFooter && <Footer/>}
    </div>
  )
}

export default RootLayout

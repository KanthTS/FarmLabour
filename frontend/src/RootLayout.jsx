import React from 'react'
import Header from './components/common/Header'
import { Outlet } from 'react-router-dom'
import Footer from './components/common/Footer'

function RootLayout() {
  return (
    <div>
      <Header/>
      <div style={{minHeight:'90vh'}}>
        <Outlet/>
      </div>
      <Footer/>
    </div>
  )
}

export default RootLayout

import React from 'react'
import Header from './components/common/Header'
import { Outlet } from 'react-router-dom'
import Footer from './components/common/Footer'
import {ClerkProvider } from '@clerk/clerk-react'
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

function RootLayout() {

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <div>
      
       <Header/>
     <div style={{minHeight:'90vh'}}>
      
     <Outlet/>
     </div>
     <Footer/>

    </div>
    </ClerkProvider>
  )
}

export default RootLayout


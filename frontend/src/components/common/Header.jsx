import React, { useContext } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { createObj } from '../contexts/FarmerLabourContext'
import { useTranslation } from 'react-i18next'
import { MdLanguage } from 'react-icons/md'

function Header() {
   const {currentUser,logout}=useContext(createObj)
   const nav=useNavigate()
   const { t, i18n } = useTranslation()

   function signedOut(){
        logout()
        nav('/')
   }
  return (
 
  <div className="bg-black">
    <div className="d-flex justify-content-between m-3  header">
      <div className="d-flex align-items-center">
        <Link to="/" className="nav-link m-2 text-white text-decoration-none" style={{fontSize:"22px"}}>{t('app.name')}</Link>
      </div>
      <div className="d-flex align-items-center">
       {
        !currentUser?<>
         <div className="d-flex align-items-center gap-2">
            <div className="input-group input-group-sm" style={{ width: '170px' }}>
              <span className="input-group-text bg-dark text-white border-secondary">
                <MdLanguage />
              </span>
              <select
                className="form-select bg-dark text-white border-secondary"
                value={i18n.language}
                onChange={(e)=>i18n.changeLanguage(e.target.value)}
                aria-label={t('nav.language')}
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="te">తెలుగు</option>
              </select>
            </div>
            <Link to="signin" className="btn btn-outline-light btn-sm">{t('nav.signIn')}</Link>
            <Link to="signup" className="btn btn-warning btn-sm">{t('nav.signUp')}</Link>
         </div>
        </>:<>
          <div className="d-flex align-items-center text-white gap-3">
            {currentUser?.role==='admin' && (
              <Link to="/admin" className="text-white">{t('nav.admin')}</Link>
            )}
            <div className="input-group input-group-sm" style={{ width: '170px' }}>
              <span className="input-group-text bg-dark text-white border-secondary">
                <MdLanguage />
              </span>
              <select
                className="form-select bg-dark text-white border-secondary"
                value={i18n.language}
                onChange={(e)=>i18n.changeLanguage(e.target.value)}
                aria-label={t('nav.language')}
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="te">తెలుగు</option>
              </select>
            </div>
            {(() => {
              const email = currentUser?.email || 'U'
              const nameFromEmail = email.split('@')[0] || 'U'
              const avatarText = encodeURIComponent(nameFromEmail)
              const src = currentUser?.profileImageUrl
                ? currentUser.profileImageUrl
                : `https://ui-avatars.com/api/?name=${avatarText}`
              return (
                <img
                  src={src}
                  alt="Profile"
                  width="40"
                  height="40"
                  className="m-1 rounded-circle"
                />
              )
            })()}
            <p className='m-0 fs-6'>{currentUser?.firstName}</p>
            <button type="button" className='btn btn-warning btn-sm' onClick={signedOut}>{t('nav.signOut')}</button>
          </div>
        </>
       }
      </div>
    </div>
    
  </div>    
)
}

export default Header

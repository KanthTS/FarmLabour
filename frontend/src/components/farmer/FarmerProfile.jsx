import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  HiOutlineHome,
  HiOutlineDocumentText,
  HiOutlineClipboardList,
  HiOutlineUsers,
  HiOutlineChatAlt2,
  HiOutlineCreditCard,
  HiOutlineViewGrid,
  HiOutlineCog,
  HiOutlineBell,
  HiOutlineSearch,
} from 'react-icons/hi'
import { createObj } from '../contexts/FarmerLabourContext'
import client from '../../api/client'

function FarmerProfile() {
  const { currentUser } = useContext(createObj)
  const location = useLocation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(0)

  const displayName = useMemo(() => {
    if (!currentUser) return 'Farmer'
    return `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim()
  }, [currentUser])

  const email = currentUser?.email || ''
  const basePath = `/farmerprofile/${email}/`
  const activeSegment = location.pathname.replace(basePath, '').split('/')[0] || ''

  useEffect(() => {
    if (!currentUser) return
    const loadCounts = async () => {
      try {
        const res = await client.get('/notifications')
        const list = res.data?.payload || []
        setUnreadNotifications(list.filter((n) => !n.read).length)
      } catch {
        setUnreadNotifications(0)
      }
    }
    loadCounts()
  }, [currentUser])

  if (!currentUser) return null

  const navLinks = [
    { label: 'Dashboard', to: '', icon: HiOutlineHome },
    { label: 'All Jobs', to: 'alljobs', icon: HiOutlineViewGrid },
    { label: 'Post a Job', to: 'createpost', icon: HiOutlineDocumentText },
    { label: 'My Jobs', to: 'myjobs', icon: HiOutlineClipboardList },
    { label: 'Applications', to: 'app', icon: HiOutlineUsers },
    { label: 'Labourers', to: 'hired', icon: HiOutlineUsers },
    {
      label: 'Messages',
      to: 'messages',
      icon: HiOutlineChatAlt2,
      comingSoon: true,
    },
    {
      label: 'Payments',
      to: 'payments',
      icon: HiOutlineCreditCard,
      comingSoon: true,
    },
    { label: 'Settings', to: 'settings', icon: HiOutlineCog },
  ]

  const greeting = (() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  })()

  const avatarUrl =
    currentUser.profileImageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=15803d&color=ffffff&size=128`

  return (
    <div className={`farmer-shell ${darkMode ? 'farmer-shell--dark' : ''}`}>
      <div className="farmer-shell__inner">
        <aside className="farmer-sidebar">
          <div className="farmer-sidebar__brand">
            <span className="farmer-sidebar__logo" aria-hidden>🚜</span>
            <div>
              <p className="farmer-sidebar__eyebrow">Farm Labour</p>
              <h2 className="farmer-sidebar__title">Farmer Dashboard</h2>
            </div>
          </div>

          <nav className="farmer-sidebar__nav">
            {navLinks.map((item) => {
              const Icon = item.icon
              const isActive = item.to === activeSegment || (item.to === '' && activeSegment === '')

              if (item.comingSoon) {
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`farmer-sidebar__link farmer-sidebar__link--soon ${isActive ? 'is-active' : ''}`}
                  >
                    <span className="farmer-sidebar__link-icon">
                      <Icon />
                    </span>
                    <span>{item.label}</span>
                    <span className="farmer-sidebar__soon-badge">Soon</span>
                  </Link>
                )
              }

              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`farmer-sidebar__link ${isActive ? 'is-active' : ''}`}
                >
                  <span className="farmer-sidebar__link-icon">
                    <Icon />
                  </span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="farmer-sidebar__profile">
            <img src={avatarUrl} alt="" className="farmer-sidebar__avatar" />
            <div>
              <p className="farmer-sidebar__name">{displayName}</p>
              <p className="farmer-sidebar__tier">Premium Farmer</p>
            </div>
            <button
              type="button"
              className="farmer-sidebar__view-btn"
              onClick={() => navigate('settings')}
            >
              View Profile
            </button>
          </div>

          <div className="farmer-sidebar__theme">
            <span>Dark mode</span>
            <button
              type="button"
              className={`farmer-sidebar__toggle ${darkMode ? 'is-on' : ''}`}
              onClick={() => setDarkMode((prev) => !prev)}
              aria-pressed={darkMode}
            >
              <span />
            </button>
          </div>
        </aside>

        <main className="farmer-main">
          <header className="farmer-topbar">
            <div>
              <p className="farmer-topbar__greet">
                {greeting}, 👋 Welcome back, <strong>{displayName}</strong>
              </p>
              <p className="farmer-topbar__sub">
                Manage your farm jobs, labourers and grow your productivity.
              </p>
            </div>
            <div className="farmer-topbar__tools">
              <div className="farmer-topbar__search">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search anything..."
                  aria-label="Search"
                />
                <HiOutlineSearch />
              </div>
              <button type="button" className="farmer-topbar__icon-btn" aria-label="Notifications">
                <HiOutlineBell />
                {unreadNotifications > 0 && (
                  <span className="farmer-topbar__dot">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </button>
              <button
                type="button"
                className="farmer-topbar__icon-btn"
                aria-label="Messages — coming soon"
                onClick={() => navigate('messages')}
              >
                <HiOutlineChatAlt2 />
              </button>
              <button
                type="button"
                className="farmer-topbar__user"
                onClick={() => navigate('settings')}
              >
                <img src={avatarUrl} alt="" />
                <span>{displayName}</span>
              </button>
            </div>
          </header>

          <Outlet context={{ searchQuery: query }} />
        </main>
      </div>
    </div>
  )
}

export default FarmerProfile

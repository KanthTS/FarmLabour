import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  HiOutlineHome,
  HiOutlineSearch,
  HiOutlineBriefcase,
  HiOutlineClipboardList,
  HiOutlineCollection,
  HiOutlineChatAlt2,
  HiOutlineCreditCard,
  HiOutlineCog,
  HiOutlineBell,
  HiOutlineChevronDown,
  HiOutlineLogout,
} from 'react-icons/hi'
import { createObj } from '../contexts/FarmerLabourContext'
import client from '../../api/client'

function LabourProfile() {
  const { currentUser, profileCompletion, refreshLabourProfile, logout } = useContext(createObj)
  const location = useLocation()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }
  const [query, setQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(0)

  const displayName = useMemo(() => {
    if (!currentUser) return 'Labour'
    return `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim()
  }, [currentUser])

  const email = currentUser?.email || ''
  const basePath = `/labourprofile/${email}/`
  const activeSegment = location.pathname.replace(basePath, '').split('/')[0] || ''

  useEffect(() => {
    if (!currentUser) return
    const load = async () => {
      try {
        const notifRes = await client.get('/notifications')
        const list = notifRes.data?.payload || []
        setUnreadNotifications(list.filter((n) => !n.read).length)
      } catch {
        setUnreadNotifications(0)
      }
      refreshLabourProfile()
    }
    load()
  }, [currentUser, refreshLabourProfile])

  if (!currentUser) return null

  const navLinks = [
    { label: 'Dashboard', to: '', icon: HiOutlineHome },
    { label: 'Find Jobs', to: 'jobs', icon: HiOutlineSearch },
    { label: 'My Applications', to: 'myapplications', icon: HiOutlineClipboardList },
    { label: 'My Jobs', to: 'history', icon: HiOutlineCollection },
    { label: 'Messages', to: 'messages', icon: HiOutlineChatAlt2, comingSoon: true, badge: 2 },
    { label: 'Payments', to: 'payments', icon: HiOutlineCreditCard, comingSoon: true },
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
    <div className={`labour-shell ${darkMode ? 'labour-shell--dark' : ''}`}>
      <div className="labour-shell__inner">
        <aside className="labour-sidebar">
          <div className="labour-sidebar__brand">
            <img src={avatarUrl} alt="" className="labour-sidebar__brand-img" />
            <div>
              <p className="labour-sidebar__eyebrow">Farm Labour</p>
              <h2 className="labour-sidebar__title">Labour Dashboard</h2>
            </div>
          </div>

          <nav className="labour-sidebar__nav">
            {navLinks.map((item) => {
              const Icon = item.icon
              const isActive =
                item.to === activeSegment || (item.to === '' && activeSegment === '')
              const showChevron = item.label === 'Find Jobs'

              if (item.comingSoon) {
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`labour-sidebar__link labour-sidebar__link--soon ${isActive ? 'is-active' : ''}`}
                  >
                    <span className="labour-sidebar__link-icon">
                      <Icon />
                    </span>
                    <span>{item.label}</span>
                    {item.badge > 0 && (
                      <span className="labour-sidebar__badge">{item.badge}</span>
                    )}
                    <span className="labour-sidebar__soon-badge">Soon</span>
                  </Link>
                )
              }

              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`labour-sidebar__link ${isActive ? 'is-active' : ''}`}
                >
                  <span className="labour-sidebar__link-icon">
                    <Icon />
                  </span>
                  <span>{item.label}</span>
                  {showChevron && <HiOutlineChevronDown className="labour-sidebar__chevron" />}
                </Link>
              )
            })}
          </nav>

          <div className="labour-sidebar__complete">
              <p className="labour-sidebar__complete-title">Complete Your Profile</p>
              <p className="labour-sidebar__complete-text">
                Increase your chances to get more jobs.
              </p>
              <div className="labour-sidebar__ring-wrap">
                <div
                  className="labour-sidebar__ring"
                  style={{ '--pct': `${profileCompletion ?? 0}%` }}
                >
                  <span>{profileCompletion ?? 0}%</span>
                </div>
                <span className="labour-sidebar__complete-label">Completed</span>
              </div>
              <button
                type="button"
                className="labour-sidebar__complete-btn"
                onClick={() => navigate('settings')}
              >
                {(profileCompletion ?? 0) >= 100 ? 'View Settings' : 'Complete Now →'}
              </button>
            </div>

          <div className="labour-sidebar__theme">
            <span>Dark mode</span>
            <button
              type="button"
              className={`labour-sidebar__toggle ${darkMode ? 'is-on' : ''}`}
              onClick={() => setDarkMode((p) => !p)}
              aria-pressed={darkMode}
            >
              <span />
            </button>
          </div>

          <button type="button" className="labour-sidebar__logout" onClick={handleLogout}>
            <HiOutlineLogout />
            <span>Log out</span>
          </button>
        </aside>

        <main className="labour-main">
          <header className="labour-topbar">
            <div>
              <p className="labour-topbar__greet">
                {greeting}, 👋 Welcome back, <strong>{displayName.split(' ')[0]}!</strong>
              </p>
              <p className="labour-topbar__sub">Find suitable jobs and start earning.</p>
            </div>
            <div className="labour-topbar__tools">
              <div className="labour-topbar__search">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for jobs, location, work type..."
                  aria-label="Search"
                />
                <HiOutlineSearch />
              </div>
              <button type="button" className="labour-topbar__icon-btn" aria-label="Notifications">
                <HiOutlineBell />
                {unreadNotifications > 0 && (
                  <span className="labour-topbar__dot">{unreadNotifications}</span>
                )}
              </button>
              <button
                type="button"
                className="labour-topbar__icon-btn"
                aria-label="Messages"
                onClick={() => navigate('messages')}
              >
                <HiOutlineChatAlt2 />
              </button>
              <button
                type="button"
                className="labour-topbar__user"
                onClick={() => navigate('settings')}
              >
                <img src={avatarUrl} alt="" />
                <span>
                  {displayName}
                  <small>Labour</small>
                </span>
                <HiOutlineChevronDown />
              </button>
            </div>
          </header>

          <Outlet context={{ searchQuery: query }} />
        </main>
      </div>
    </div>
  )
}

export default LabourProfile

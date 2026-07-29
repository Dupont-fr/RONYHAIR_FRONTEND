import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import * as authService from '../services/authService'
import ConfirmModal from './ConfirmModal'
import pkg from '../../package.json'
import './styles/AdminLayout.css'

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const admin = authService.getAdminFromStorage()
  const isSuperAdmin = admin?.role === 'super_admin'

  const handleLogout = async () => {
    await authService.logoutAdmin()
    navigate('/admin/login')
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => { setSidebarOpen(false); setDropdownOpen(false) }
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen)

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', color: '#d81a88' },
    { path: '/admin/categories', label: 'Services', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', color: '#8b5a2b' },
    { path: '/admin/categories/new', label: 'Nouveau Service', icon: 'M12 4v16m8-8H4', color: '#10b981' },
    { path: '/admin/promotions', label: 'Promotions', icon: 'M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6', icon2: 'M4 10a2 2 0 012-2h12a2 2 0 012 2H4z', icon3: 'M12 4v14M8 8l4-4 4 4', color: '#f59e0b' },
    { path: '/admin/reviews', label: 'Avis Clients', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', color: '#fbbf24' },
    ...(isSuperAdmin ? [{ path: '/admin/admins', label: 'Administrateurs', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', icon2: 'M17 8h4M19 6v4', color: '#7c3aed' }] : []),
  ]

  return (
    <div className='admin-layout'>
      <header className='admin-header'>
        <div className='header-content'>
          <div className='header-left'>
            <button className='hamburger-btn' onClick={toggleSidebar}>
              <span></span><span></span><span></span>
            </button>
            <div className='header-title'>
              <h1>RONY HAIR 237</h1>
              <p className='header-subtitle'>Espace d'administration</p>
            </div>
          </div>

          <div className='header-right'>
            <div className='desktop-user-info'>
              <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2' /><circle cx='12' cy='7' r='4' />
              </svg>
              <span className='admin-name'>{admin?.nom || 'Admin'}</span>
              <span className='menu-admin-label'>Menu Admin</span>
              <button className='btn-logout' onClick={() => setConfirmLogout(true)}>Déconnexion</button>
            </div>

            <div className='mobile-user-dropdown'>
              <button className='user-dropdown-btn' onClick={toggleDropdown}>
                {admin?.nom || 'Admin'} ▼
              </button>
              {dropdownOpen && (
                <div className='dropdown-menu'>
                  <div className='dropdown-header'>{admin?.nom || 'Admin'}</div>
                  <button className='dropdown-item logout-item' onClick={() => setConfirmLogout(true)}>Déconnexion</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {sidebarOpen && <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={closeSidebar}></div>}

      <div className='admin-body'>
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className='sidebar-header'>
            <button className='close-sidebar-btn' onClick={closeSidebar}>✕</button>
          </div>
          <nav className='sidebar-menu'>
            {menuItems.map((item) => (
              <Link key={item.path} to={item.path}
                className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={closeSidebar}>
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke={item.color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <path d={item.icon} />
                  {item.icon2 && <path d={item.icon2} />}
                  {item.icon3 && <path d={item.icon3} />}
                </svg>
                {item.label}
              </Link>
            ))}
            <div className='menu-divider'></div>
            <Link to='/accueil' className='menu-item' onClick={closeSidebar}>
              <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#3b82f6' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' /><path d='M9 22V12h6v10' />
              </svg>
              Voir le site
            </Link>
            <div className='menu-divider'></div>
            <button className='menu-item logout-menu-item' onClick={handleLogout}>
              <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#ef4444' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4' /><polyline points='16 17 21 12 16 7' /><line x1='21' y1='12' x2='9' y2='12' />
              </svg>
              Déconnexion
            </button>
          </nav>
          <div className='sidebar-footer'>
            <p>© 2026 RONY HAIR 237</p>
            <p className='version'>v{pkg.version}</p>
          </div>
        </aside>

        <main className='admin-main'>
          <div className='admin-content'>{children}</div>
        </main>
      </div>
      <ConfirmModal
        isOpen={confirmLogout}
        message='Voulez-vous vraiment vous déconnecter ?'
        confirmText='Déconnexion'
        onConfirm={handleLogout}
        onCancel={() => setConfirmLogout(false)}
      />
    </div>
  )
}

export default AdminLayout

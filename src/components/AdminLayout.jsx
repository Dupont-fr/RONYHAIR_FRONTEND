import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import * as authService from '../services/authService'
import './styles/AdminLayout.css'

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const admin = authService.getAdminFromStorage()

  const handleLogout = async () => {
    if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
      await authService.logoutAdmin()
      navigate('/admin/login')
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
    setDropdownOpen(false)
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  // Icône Dashboard (graphique)
  const DashboardIcon = () => (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='#4F46E5'
      style={{ verticalAlign: 'middle', marginRight: '10px' }}
    >
      <path d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z' />
    </svg>
  )

  // Icône Catégories (dossier)
  const CategoriesIcon = () => (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='#10B981'
      style={{ verticalAlign: 'middle', marginRight: '10px' }}
    >
      <path d='M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z' />
    </svg>
  )

  // Icône Nouvelle Catégorie (plus)
  const NewCategoryIcon = () => (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='#F59E0B'
      style={{ verticalAlign: 'middle', marginRight: '10px' }}
    >
      <path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' />
    </svg>
  )

  // Icône Promotions (cadeau)
  const PromotionsIcon = () => (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='#EC4899'
      style={{ verticalAlign: 'middle', marginRight: '10px' }}
    >
      <path d='M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35L12 4l-.5-.65C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z' />
    </svg>
  )

  // Icône Voir le site (maison)
  const HomeIcon = () => (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='#3B82F6'
      style={{ verticalAlign: 'middle', marginRight: '10px' }}
    >
      <path d='M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' />
    </svg>
  )

  // Icône Utilisateur
  const UserIcon = () => (
    <svg
      width='18'
      height='18'
      viewBox='0 0 24 24'
      fill='#0F1B3D'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z' />
    </svg>
  )

  // Icône Bûche de bois
  const WoodIcon = () => (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='#8B5A2B'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M4 22h16v2H4z' />
      <path d='M18 2h-2v2H8V2H6v2H4v2h2v14h12V4h2V2h-2zM8 18H6V4h2v14zm10 0H8v2h10v-2zm0-14h-2v2h2V4zm0 4h-2v2h2V8zm-4-4h-2v2h2V4zm0 4h-2v2h2V8z' />
    </svg>
  )

  // Icône Fermeture (croix)
  const CloseIcon = () => (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='#4B5563'
      style={{ display: 'block', margin: '0 auto' }}
    >
      <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
    </svg>
  )

  // Icône Déconnexion
  const LogoutIcon = () => (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='#DC2626'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z' />
    </svg>
  )

  // Icône Flèche Bas
  const ArrowDownIcon = () => (
    <svg
      width='12'
      height='12'
      viewBox='0 0 24 24'
      fill='currentColor'
      style={{
        marginLeft: '4px',
        transition: 'transform 0.3s',
        transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      }}
    >
      <path d='M7 10l5 5 5-5z' />
    </svg>
  )

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: <DashboardIcon />,
      label: 'Dashboard',
    },
    {
      path: '/admin/categories',
      icon: <CategoriesIcon />,
      label: 'Services',
    },
    {
      path: '/admin/categories/new',
      icon: <NewCategoryIcon />,
      label: 'Nouveau Service',
    },
    {
      path: '/admin/promotions',
      icon: <PromotionsIcon />,
      label: 'Promotions',
    },
  ]

  return (
    <div className='admin-layout'>
      {/* NAVBAR en premier */}
      <nav className='admin-navbar'>
        <div className='navbar-content'>
          <div className='navbar-left'>
            <button className='hamburger-btn' onClick={toggleSidebar}>
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div className='mobile-brand'>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                {/* <WoodIcon /> */}
                <span className='brand-text'>RONY HAIR 237 Admin</span>
              </span>
            </div>
          </div>

          <div className='navbar-right'>
            <div className='desktop-user-info'>
              <span
                className='admin-name'
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <UserIcon />
                {admin?.nom || 'Admin'}
              </span>
              <button className='btn-logout' onClick={handleLogout}>
                Déconnexion
              </button>
            </div>

            <div className='mobile-user-dropdown'>
              <button
                className='user-dropdown-btn'
                onClick={toggleDropdown}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <UserIcon />
                <span className='admin-name-mobile'>
                  {admin?.nom || 'Admin'}
                </span>
                <ArrowDownIcon />
              </button>

              {dropdownOpen && (
                <div className='dropdown-menu'>
                  <div className='dropdown-header'>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <UserIcon />
                      {admin?.nom || 'Admin'}
                    </span>
                  </div>
                  <button
                    className='dropdown-item logout-item'
                    onClick={handleLogout}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <LogoutIcon />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* HEADER après la navbar */}
      <header className='admin-header'>
        <div className='header-content'>
          <div className='header-title'>
            <h1 style={{ display: 'flex', alignItems: 'center' }}>
              {/* <WoodIcon /> */}
              RONY HAIR 237
            </h1>
            <p className='header-subtitle'>Espace d'administration</p>
          </div>

          <div className='header-user-info'>
            <div className='user-info-desktop'>
              <span className='user-greeting'>Bienvenue,</span>
              <span
                className='user-name'
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <UserIcon />
                {admin?.nom || 'Admin'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay (mobile) - CLIQUEZ N'IMPORTE OÙ POUR FERMER */}
      {sidebarOpen && (
        <div
          className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className='sidebar-header'>
          <h2>Menu Admin</h2>
          <button className='close-sidebar-btn' onClick={closeSidebar}>
            <CloseIcon />
          </button>
        </div>

        <nav className='sidebar-menu'>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`menu-item ${
                location.pathname === item.path ? 'active' : ''
              }`}
              onClick={closeSidebar}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>
                {item.icon}
                {item.label}
              </span>
            </Link>
          ))}

          <div className='menu-divider'></div>

          <Link to='/' className='menu-item' onClick={closeSidebar}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon />
              Voir le site
            </span>
          </Link>

          <div className='menu-divider'></div>

          <button
            className='menu-item logout-menu-item'
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', width: '100%' }}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <LogoutIcon />
              Déconnexion
            </span>
          </button>
        </nav>

        <div className='sidebar-footer'>
          <p>© 2026 RONY HAIR 237</p>
          <p className='version'>v1.0.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className='admin-main'>
        <div className='admin-content'>{children}</div>
      </main>
    </div>
  )
}

export default AdminLayout

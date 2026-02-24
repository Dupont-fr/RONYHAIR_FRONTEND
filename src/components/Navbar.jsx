import React, { useState } from 'react'
import { Link } from 'react-router'
import './styles/Navbar.css'

const Navbar = ({ categories }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const closeMenu = () => {
    setMenuOpen(false)
    setCategoriesOpen(false)
  }
  const toggleCategories = () => setCategoriesOpen(!categoriesOpen)

  const FolderIcon = () => (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='#667eea'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z' />
    </svg>
  )

  const EmailIcon = () => (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='#e53e3e'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' />
    </svg>
  )

  const DocumentIcon = () => (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='#dd6b20'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z' />
    </svg>
  )

  const LockIcon = () => (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='#805ad5'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z' />
    </svg>
  )

  const QuestionMarkIcon = () => (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='#4299e1'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z' />
    </svg>
  )

  const CloseIcon = () => (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='#4a5568'
      style={{ display: 'block', margin: '0 auto' }}
    >
      <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
    </svg>
  )

  const HomeIcon = () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      style={{ marginRight: '8px', verticalAlign: 'middle', color: '#2964ca' }}
    >
      <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'></path>
      <polyline points='9 22 9 12 15 12 15 22'></polyline>
    </svg>
  )

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMenu}>
            <div className='logo-container'>
              {/* ── LOGO : image originale depuis /public ── */}
              <img src='/logo.jpeg' alt='Rony Hair logo' className='logo-img' />
              {/* ─────────────────────────────────────────── */}

              <span className='logo-text'>
                RONY HAIR 237 <br />
                {/* INSTITUT DE BEAUTÉ MIXTE */}
              </span>
            </div>
          </Link>

          <div className='navbar-links'>
            <Link to='/' className='nav-link'>
              Accueil
            </Link>
            <Link to='/categories' className='nav-link'>
              Nos Services
            </Link>
            <Link to='/contact' className='nav-link'>
              Contact
            </Link>
            <Link to='/conditions' className='nav-link'>
              Conditions d'utilisations
            </Link>
            <Link to='/confidentialite' className='nav-link'>
              Politiques de confidentialités
            </Link>
            <Link to='/faq' className='nav-link'>
              FAQ
            </Link>
          </div>

          <button className='hamburger' onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className='mobile-menu-header'>
          <h2>Menu</h2>
          <button className='close-btn' onClick={closeMenu}>
            <CloseIcon />
          </button>
        </div>

        <div className='mobile-menu-content'>

          <Link to='/' className='menu-link' onClick={closeMenu}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon />
              Accueil
            </span>
          </Link>
          <div className='menu-item'>
            <button className='menu-link' onClick={toggleCategories}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <FolderIcon />
                Nos Services
              </span>
              <span className='arrow'>{categoriesOpen ? '▼' : '▶'}</span>
            </button>

            {categoriesOpen && (
              <div className='submenu'>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className='submenu-link'
                    onClick={closeMenu}
                  >
                    {category.nom}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to='/contact' className='menu-link' onClick={closeMenu}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <EmailIcon />
              Contact
            </span>
          </Link>
          <Link to='/conditions' className='menu-link' onClick={closeMenu}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <DocumentIcon />
              Conditions d'utilisation
            </span>
          </Link>
          <Link to='/confidentialite' className='menu-link' onClick={closeMenu}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <LockIcon />
              Politiques de confidentialités
            </span>
          </Link>
          <Link to='/faq' className='menu-link' onClick={closeMenu}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <QuestionMarkIcon />
              FAQ
            </span>
          </Link>
          
        </div>
      </div>

      {menuOpen && <div className='overlay' onClick={closeMenu}></div>}
    </>
  )
}

export default Navbar

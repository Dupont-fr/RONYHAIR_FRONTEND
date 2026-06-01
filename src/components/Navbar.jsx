import React, { useState } from 'react'
import { Link } from 'react-router'
import './styles/Navbar.css'

const NavIcon = ({ name, size = 18, color }) => {
  const icons = {
    home: <path d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />,
    services: <path d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />,
    contact: <path d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />,
    conditions: <path d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />,
    privacy: <path d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />,
    faq: <path d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />,
    promotions: <><path d='M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m4-6a4 4 0 118 0' /><circle cx='12' cy='8' r='1.5' fill={color || 'currentColor'} stroke='none' /></>,
  }

  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color || 'currentColor'} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='nav-icon'>
      {icons[name]}
    </svg>
  )
}

const Navbar = ({ categories }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const closeMenu = () => { setMenuOpen(false); setCategoriesOpen(false) }
  const toggleCategories = () => setCategoriesOpen(!categoriesOpen)

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMenu}>
            <div className='logo-container'>
              <img src='/logo.jpeg' alt='Rony Hair logo' className='logo-img' />
              <span className='logo-text'>RONY HAIR 237</span>
            </div>
          </Link>

          <div className='navbar-links'>
            <Link to='/' className='nav-link'><NavIcon name='home' color='#d81a88' /><span>Accueil</span></Link>
            <Link to='/categories' className='nav-link'><NavIcon name='services' color='#8b5a2b' /><span>Services</span></Link>
            <Link to='/promotions' className='nav-link'><NavIcon name='promotions' color='#d81a88' /><span>Promotions</span></Link>
            <Link to='/contact' className='nav-link'><NavIcon name='contact' color='#3b82f6' /><span>Contact</span></Link>
            <Link to='/conditions' className='nav-link'><NavIcon name='conditions' color='#f59e0b' /><span>Conditions</span></Link>
            <Link to='/confidentialite' className='nav-link'><NavIcon name='privacy' color='#10b981' /><span>Confidentialité</span></Link>
            <Link to='/faq' className='nav-link'><NavIcon name='faq' color='#8b5cf6' /><span>FAQ</span></Link>
          </div>

          <button className='hamburger' onClick={toggleMenu}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className='mobile-menu-header'>
          <h2>Menu</h2>
          <button className='close-btn' onClick={closeMenu}>✕</button>
        </div>
        <div className='mobile-menu-content'>
          <Link to='/' className='menu-link' onClick={closeMenu}><span><NavIcon name='home' color='#d81a88' />Accueil</span></Link>
          <div className='menu-item'>
            <button className='menu-link' onClick={toggleCategories}>
              <span><NavIcon name='services' color='#8b5a2b' />Nos Services</span>
              <span className='arrow'>{categoriesOpen ? '▼' : '▶'}</span>
            </button>
            {categoriesOpen && (
              <div className='submenu'>
                {categories.map((category) => (
                  <Link key={category.id} to={`/category/${category.slug}`} className='submenu-link' onClick={closeMenu}>
                    {category.nom}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to='/promotions' className='menu-link' onClick={closeMenu}><span><NavIcon name='promotions' color='#d81a88' />Promotions</span></Link>
          <Link to='/contact' className='menu-link' onClick={closeMenu}><span><NavIcon name='contact' color='#3b82f6' />Contact</span></Link>
          <Link to='/conditions' className='menu-link' onClick={closeMenu}><span><NavIcon name='conditions' color='#f59e0b' />Conditions</span></Link>
          <Link to='/confidentialite' className='menu-link' onClick={closeMenu}><span><NavIcon name='privacy' color='#10b981' />Confidentialité</span></Link>
          <Link to='/faq' className='menu-link' onClick={closeMenu}><span><NavIcon name='faq' color='#8b5cf6' />FAQ</span></Link>
        </div>
      </div>

      {menuOpen && <div className='overlay' onClick={closeMenu}></div>}
    </>
  )
}

export default Navbar

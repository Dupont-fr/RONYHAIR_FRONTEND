import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import './styles/LandingPage.css'

const services = [
  {
    nom: 'Coiffure',
    desc: 'Coupes, brushings, coiffures',
    row: 1,
    icon: (
      <svg viewBox='0 0 64 64' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path d='M16 56L28 36' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' />
        <path d='M22 12C22 12 28 16 30 22C32 28 30 34 26 38' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' />
        <path d='M42 12C42 12 36 16 34 22C32 28 34 34 38 38' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' />
        <path d='M48 56L36 36' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' />
        <circle cx='32' cy='10' r='4' stroke='currentColor' strokeWidth='2.5' />
      </svg>
    ),
  },
  {
    nom: 'Soins Visage',
    desc: 'Soins hydratants & nettoyants',
    row: 1,
    icon: (
      <svg viewBox='0 0 64 64' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <circle cx='32' cy='28' r='16' stroke='currentColor' strokeWidth='2.5' />
        <circle cx='26' cy='24' r='2' fill='currentColor' />
        <circle cx='38' cy='24' r='2' fill='currentColor' />
        <path d='M26 34C28 36 32 37 36 34' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' />
        <path d='M12 48C12 44 18 42 24 44' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' />
        <path d='M52 48C52 44 46 42 40 44' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' />
      </svg>
    ),
  },
  {
    nom: 'Massage',
    desc: 'Massages relaxants & bien-être',
    row: 1,
    icon: (
      <svg viewBox='0 0 64 64' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path d='M20 52L20 28' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' />
        <path d='M44 52L44 28' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' />
        <path d='M12 32C12 28 24 18 32 18C40 18 52 28 52 32' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' />
        <circle cx='20' cy='20' r='6' stroke='currentColor' strokeWidth='2.5' />
        <circle cx='44' cy='20' r='6' stroke='currentColor' strokeWidth='2.5' />
      </svg>
    ),
  },
  {
    nom: 'Onglerie',
    desc: 'Manucure & pédicure',
    row: 2,
    icon: (
      <svg viewBox='0 0 64 64' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path d='M20 12C20 12 18 20 18 28C18 36 20 52 20 52' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' />
        <path d='M44 12C44 12 46 20 46 28C46 36 44 52 44 52' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' />
        <path d='M20 12C20 8 24 6 28 8L32 12L36 8C40 6 44 8 44 12' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' />
        <path d='M20 20H44' stroke='currentColor' strokeWidth='2.5' />
      </svg>
    ),
  },
  {
    nom: 'Makeup',
    desc: 'Maquillage professionnel',
    row: 2,
    icon: (
      <svg viewBox='0 0 64 64' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <rect x='12' y='26' width='40' height='14' rx='4' stroke='currentColor' strokeWidth='2.5' />
        <rect x='24' y='40' width='16' height='14' rx='2' stroke='currentColor' strokeWidth='2.5' />
        <circle cx='28' cy='33' r='3' fill='currentColor' />
        <circle cx='36' cy='33' r='3' fill='currentColor' />
        <circle cx='32' cy='33' r='3' fill='currentColor' />
      </svg>
    ),
  },
  {
    nom: 'Hammam',
    desc: 'Gommage corporel & hammam',
    row: 2,
    icon: (
      <svg viewBox='0 0 64 64' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path d='M18 52C18 52 22 40 22 32C22 24 28 18 32 18' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' />
        <path d='M46 52C46 52 42 40 42 32C42 24 36 18 32 18' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' />
        <path d='M32 18L32 12' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' />
        <path d='M24 8C24 8 28 12 32 12C36 12 40 8 40 8' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' />
        <path d='M12 56H52' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' />
        <path d='M26 38C28 40 36 40 38 38' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeDasharray='2 3' />
        <path d='M24 44C28 46 36 46 40 44' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeDasharray='2 3' />
      </svg>
    ),
  },
]

const LandingPage = () => {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [appReady, setAppReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const preload = async () => {
      try {
        await import('./HomePage')
      } catch { }
      setAppReady(true)
    }
    preload()
  }, [])

  const handleEnter = () => {
    navigate('/accueil')
  }

  return (
    <div className='landing-page'>
      <div className='landing-hero'>
        <div className='landing-overlay' />
        <div className='landing-content'>
          <div className={`landing-title ${visible ? 'visible' : ''}`}>
            <h1>RONY HAIR 237</h1>
            <p className='subtitle'>Institut de Beauté & Bien-être</p>
            <p className='landing-tagline'>
              Votre salon de beauté vous ouvre ses portes pour une expérience unique
            </p>
          </div>

          <hr className={`landing-divider ${visible ? 'visible' : ''}`} />

          <p className='services-heading'>Découvrez nos services</p>

          <div className='services-showcase'>
            {services.map((service, index) => (
              <div
                key={index}
                className={`service-card row-${service.row} ${visible ? 'visible' : ''}`}
                style={{ '--card-delay': `${0.5 + index * 0.12}s` }}
              >
                <span className='service-icon'>{service.icon}</span>
                <span className='service-name'>{service.nom}</span>
                <span className='service-desc'>{service.desc}</span>
              </div>
            ))}
          </div>

          <p className='landing-footer-text'>
            Prenez rendez-vous et laissez-nous prendre soin de vous
          </p>

          <div className={`landing-cta ${visible ? 'visible' : ''}`}>
            <button
              className='btn-enter-app'
              onClick={handleEnter}
              disabled={!appReady}
            >
              {appReady ? (
                <>Accéder à l'application <span className='btn-arrow'>→</span></>
              ) : (
                'Chargement...'
              )}
            </button>
            {!appReady && <div className='landing-loading-bar' />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage

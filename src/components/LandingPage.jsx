import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import './styles/LandingPage.css'

const services = [
  { nom: 'Coiffure', icon: '💇‍♀️', desc: 'Coupes, brushings, coiffures' },
  { nom: 'Soins Visage', icon: '🧖‍♀️', desc: 'Soins hydratants & nettoyants' },
  { nom: 'Massage', icon: '💆‍♀️', desc: 'Massages relaxants & bien-être' },
  { nom: 'Onglerie', icon: '💅', desc: 'Manucure & pédicure' },
  { nom: 'Makeup', icon: '💄', desc: 'Maquillage professionnel' },
  { nom: 'Hammam', icon: '🛁', desc: 'Gommage corporel & hammam' },
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
          </div>

          <hr className={`landing-divider ${visible ? 'visible' : ''}`} />

          <div className='services-showcase'>
            {services.map((service, index) => (
              <div
                key={index}
                className={`service-card ${visible ? 'visible' : ''}`}
                style={{ transitionDelay: `${0.5 + index * 0.12}s` }}
              >
                <span className='service-icon'>{service.icon}</span>
                <span className='service-name'>{service.nom}</span>
                <span className='service-desc'>{service.desc}</span>
              </div>
            ))}
          </div>

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

import React, { useEffect } from 'react'
import './styles/LoadingPage.css'

const Loading = ({ onLoadingComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onLoadingComplete) onLoadingComplete()
    }, 3500)
    return () => clearTimeout(timer)
  }, [onLoadingComplete])

  return (
    <div className='loading-container'>
      <div className='loading-content'>
        {/* Logo original depuis le dossier public */}
        <div className='logo-container'>
          <img
            src='/logo.jpeg'
            alt='Rony Hair - Salon Mixte & Barbier'
            className='main-logo'
          />
        </div>

        {/* Barre de chargement */}
        <div className='loading-animation'>
          <div className='loading-bar-container'>
            <div className='loading-bar'></div>
          </div>
          <p className='loading-text'>Chargement de votre espace...</p>
        </div>
      </div>
    </div>
  )
}

export default Loading

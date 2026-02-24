// src/components/WhatsAppButton.jsx
import React, { useState, useEffect } from 'react'
import './styles/WhatsAppButton.css'

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [messageSent, setMessageSent] = useState(false)

  // Messages pré-écrits selon le contexte
  const defaultMessage =
    'Bonjour ! Je souhaiterais avoir des informations sur vos prestations de beauté et coiffure.'

  const quickQuestions = [
    {
      text: 'Tarifs coiffure',
      message:
        "Bonjour, pourriez-vous m'envoyer vos tarifs pour les prestations de coiffure ? Merci !",
    },
    {
      text: 'Soins visage',
      message:
        'Bonjour, je suis intéressé(e) par vos soins du visage. Quels sont les différents forfaits proposés ?',
    },
    {
      text: 'Massages',
      message:
        "Bonjour, j'aimerais connaître vos différentes options de massage et leurs tarifs.",
    },
    {
      text: 'Onglerie',
      message:
        "Bonjour, que proposez-vous comme prestations d'onglerie (pose d'ongles, vernis semi-permanent, etc.) ?",
    },
    {
      text: 'Formations',
      message:
        "Bonjour, je suis intéressé(e) par vos formations. Pouvez-vous m'envoyer le programme et les tarifs ?",
    },
    {
      text: 'Prendre RDV',
      message:
        'Bonjour, je souhaiterais prendre rendez-vous pour une prestation. Quels créneaux sont disponibles cette semaine ?',
    },
  ]

  useEffect(() => {
    let showTimer, hideTimer, loopTimer

    const startCycle = () => {
      // Apparition après 30 secondes
      showTimer = setTimeout(() => {
        setIsVisible(true)
        setIsAnimating(true)

        // Disparition après 10 secondes d'affichage
        hideTimer = setTimeout(() => {
          setIsAnimating(false)
          setTimeout(() => {
            setIsVisible(false)
            // Relancer le cycle après disparition complète
            loopTimer = setTimeout(startCycle, 30000) // 30 secondes avant réapparition
          }, 500) // Durée de l'animation de disparition
        }, 10000) // 10 secondes d'affichage
      }, 30000) // 30 secondes avant première apparition
    }

    // Démarrer le premier cycle
    startCycle()

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
      clearTimeout(loopTimer)
    }
  }, [])

  const handleQuickQuestion = (message) => {
    const phoneNumber = '237696409306'
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank')
    setMessageSent(true)

    // Réinitialiser le messageSent après 3 secondes
    setTimeout(() => setMessageSent(false), 3000)
  }

  const handleClick = () => {
    const phoneNumber = '237656173692'
    const encodedMessage = encodeURIComponent(defaultMessage)
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank')
    setMessageSent(true)
    setTimeout(() => setMessageSent(false), 3000)
  }

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      setIsVisible(false)
    }, 500)
  }

  if (!isVisible) return null

  return (
    <div
      className={`whatsapp-button-container ${isAnimating ? 'animate-in' : 'animate-out'}`}
    >
      {/* Menu des questions rapides */}
      <div className='quick-questions-menu'>
        <div className='menu-header'>
          <span>Questions fréquentes</span>
          <button className='close-menu' onClick={handleClose}>
            ×
          </button>
        </div>
        <div className='questions-list'>
          {quickQuestions.map((q, index) => (
            <button
              key={index}
              className='question-item'
              onClick={() => handleQuickQuestion(q.message)}
            >
              {q.text}
            </button>
          ))}
        </div>
        <div className='menu-footer'>
          <small>Ou envoyez votre propre message 👇</small>
        </div>
      </div>

      {/* Bouton principal */}
      <button
        onClick={handleClick}
        className='whatsapp-main-btn'
        aria-label='Contacter sur WhatsApp'
      >
        {/* Notification de message envoyé */}
        {messageSent && (
          <div className='message-sent-notification'>
            ✓ Message prêt à être envoyé !
          </div>
        )}

        {/* Timer visuel (optionnel) */}
        <div className='timer-indicator'>
          <svg className='timer-svg' viewBox='0 0 36 36'>
            <circle
              className='timer-bg'
              cx='18'
              cy='18'
              r='16'
              fill='none'
              stroke='#ffffff50'
              strokeWidth='2'
            />
            <circle
              className='timer-fill'
              cx='18'
              cy='18'
              r='16'
              fill='none'
              stroke='white'
              strokeWidth='2'
              strokeDasharray='100'
              strokeDashoffset='0'
              style={{
                animation: 'timer 10s linear forwards',
              }}
            />
          </svg>
        </div>

        {/* Icône WhatsApp */}
        <div className='whatsapp-icon'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 448 512'
            className='whatsapp-svg'
          >
            <path
              fill='currentColor'
              d='M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z'
            />
          </svg>
        </div>

        {/* Animation de notification */}
        <div className='notification-pulse'></div>

        {/* Texte flottant */}
        <div className='whatsapp-text'>
          <span>Une question ? 📱</span>
          <div className='text-arrow'></div>
        </div>
      </button>
    </div>
  )
}

export default WhatsAppButton

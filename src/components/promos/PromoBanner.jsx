import React from 'react'
import CountdownTimer from './CountdownTimer'
import './styles/PromoBanner.css'
import { useNavigate } from 'react-router'

const PromoBanner = ({ promotion, onExpire }) => {
  const navigate = useNavigate()
  if (!promotion) return null

  const handleClick = () => {
    navigate('/categories')
  }

  const hasImage = promotion.image && promotion.image.trim() !== ''

  return (
    <div className={`promo-banner stock-limite ${hasImage ? 'has-image' : ''}`}
      style={hasImage ? { backgroundImage: `url(${promotion.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
      {hasImage && <div className='promo-overlay' />}
      <div className='promo-content'>
        <span className='promo-text'>
          <strong>{promotion.nom}</strong>
          {promotion.description && (
            <>
              {' | '}{promotion.description}
            </>
          )}
        </span>
        <span className='promo-timer'>
          Expire dans: <br />
          <CountdownTimer dateFin={promotion.dateFin} onExpire={onExpire} />
        </span>
      </div>
      <button className='promo-btn' onClick={handleClick}>
        Voir Plus
      </button>
    </div>
  )
}

export default PromoBanner

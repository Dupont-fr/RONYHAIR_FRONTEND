import React from 'react'
import CountdownTimer from './CountdownTimer'
import './styles/PromoBanner.css'
import { useNavigate } from 'react-router'

const PromoBanner = ({ promotion, onExpire }) => {
  const navigate = useNavigate()
  if (!promotion) return null

  const handleClick = () => {
    navigate('/categories') // Utiliser navigate pour rediriger
  }
  return (
    <div className='promo-banner stock-limite'>
      <div className='promo-content'>
        <span className='promo-text'>
          <strong>Promo Spéciale!!</strong> | Chez RONY HAIR 237, profitez de
          nos offres et repartez avec des cadeaux exclusifs ! |{' '}
          {promotion.description}
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

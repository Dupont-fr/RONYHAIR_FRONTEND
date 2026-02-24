import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router' // Importer useNavigate
import AnimatedText from './AnimatedText'
import CountdownTimer from './CountdownTimer'
import './styles/TombolaBanner.css'

const TombolaBanner = ({ promotion }) => {
  const navigate = useNavigate() // Initialiser useNavigate
  const [currentGainIndex, setCurrentGainIndex] = useState(0)
  const [showText, setShowText] = useState(true)

  useEffect(() => {
    if (!promotion || !promotion.gains || promotion.gains.length === 0) return

    const textAnimationDuration =
      promotion.gains[currentGainIndex].length * 100 + 1000

    const timer = setTimeout(() => {
      setShowText(false)
      setTimeout(() => {
        setCurrentGainIndex((prev) => (prev + 1) % promotion.gains.length)
        setShowText(true)
      }, 500)
    }, textAnimationDuration)

    return () => clearTimeout(timer)
  }, [currentGainIndex, promotion])

  if (!promotion || !promotion.gains || promotion.gains.length === 0)
    return null

  const handleClick = () => {
    navigate('/categories') // Utiliser navigate pour rediriger
  }

  return (
    <div className='tombola-banner'>
      <div className='tombola-icon'>🎁</div>

      <div className='tombola-content'>
        <div className='tombola-title'>
          <span className='tombola-logo'>Tombola chez RONY HAIR 237</span>
          <span className='tombola-subtitle'>
            Offrez-vous un soin et tentez votre chance
          </span>
          <span className='tombola-subtitle'>Vous pouvez gagner une:</span>
        </div>

        <div className='tombola-prize'>
          {showText && (
            <AnimatedText
              text={promotion.gains[currentGainIndex]}
              speed={100}
            />
          )}
        </div>

        <div className='tombola-timer'>
          Expire dans :<br />
          <CountdownTimer dateFin={promotion.dateFin} />
        </div>
      </div>

      <button className='tombola-btn' onClick={handleClick}>
        Voir plus
      </button>
    </div>
  )
}

export default TombolaBanner

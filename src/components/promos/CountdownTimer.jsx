import React, { useEffect, useState } from 'react'

const CountdownTimer = ({ dateFin, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(null)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const end = new Date(dateFin).getTime()
      const diff = end - now

      if (diff <= 0) {
        if (onExpire) onExpire()
        return null
      }

      const jours = Math.floor(diff / (1000 * 60 * 60 * 24))
      const heures = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const secondes = Math.floor((diff % (1000 * 60)) / 1000)

      return { jours, heures, minutes, secondes }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [dateFin, onExpire])

  if (!timeLeft) {
    return <span>Expiré</span>
  }

  return (
    <span className='countdown-timer'>
      {timeLeft.jours > 0 && `${timeLeft.jours}j : `}
      {String(timeLeft.heures).padStart(2, '0')}h :{' '}
      {String(timeLeft.minutes).padStart(2, '0')}m :{' '}
      {String(timeLeft.secondes).padStart(2, '0')}s
    </span>
  )
}

export default CountdownTimer

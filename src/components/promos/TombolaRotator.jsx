import React, { useEffect, useState } from 'react'
import TombolaBanner from './TombolaBanner'

const TombolaRotator = ({ categories, tombolaPromotion }) => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)
  const [showBanner, setShowBanner] = useState(true)

  useEffect(() => {
    if (!tombolaPromotion || !categories || categories.length === 0) return

    const displayDuration = (tombolaPromotion.dureeAffichage || 10) * 2000

    const timer = setInterval(() => {
      setShowBanner(false)

      setTimeout(() => {
        setCurrentCategoryIndex((prev) => (prev + 1) % categories.length)
        setShowBanner(true)
      }, 300)
    }, displayDuration)

    return () => clearInterval(timer)
  }, [tombolaPromotion, categories])

  if (!tombolaPromotion || !categories || categories.length === 0) return null

  return (
    <div className={`tombola-rotator ${showBanner ? 'show' : 'hide'}`}>
      <TombolaBanner promotion={tombolaPromotion} />
    </div>
  )
}

export default TombolaRotator

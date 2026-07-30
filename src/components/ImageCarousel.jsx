import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
// import ProductModal from './ProductModal'
import PromoBanner from './promos/PromoBanner'
import TombolaRotator from './promos/TombolaRotator'
import { getOptimizedImageUrl } from '../services/apiConfig'
import './styles/ImageCarousel.css'

const ImageCarousel = ({
  images,
  categoryName,
  categoryId,
  categorySlug,
  showTombola,
  tombolaPromotion,
  allCategories,
  categoryPromotion,
}) => {
  const navigate = useNavigate()
  const scrollContainerRef = useRef(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!images || images.length <= 1 || isPaused) return

    const interval = setInterval(() => {
      const container = scrollContainerRef.current
      if (!container) return

      const cardWidth = window.innerWidth < 600 ? 272 : 294
      const maxScroll = container.scrollWidth - container.clientWidth

      if (container.scrollLeft >= maxScroll - 20) {
        container.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        container.scrollTo({
          left: container.scrollLeft + cardWidth,
          behavior: 'smooth',
        })
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [images, isPaused])

  const scroll = (direction) => {
    const container = scrollContainerRef.current
    if (!container) return

    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 5000)

    const scrollAmount = 320
    const targetScroll =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    })
  }

  const handleProductClick = (image) => {
    setSelectedProduct(image)
  }

  const handleCloseModal = () => {
    setSelectedProduct(null)
  }

  const handleOrderClick = (e, product) => {
    e.stopPropagation()
    navigate('/order', { state: { product } })
  }

  if (!images || images.length === 0) {
    return null
  }

  return (
    <>
      <div className='image-carousel'>
        {showTombola && tombolaPromotion && allCategories && (
          <TombolaRotator
            categories={allCategories}
            tombolaPromotion={tombolaPromotion}
          />
        )}

        {categoryPromotion && (
          <PromoBanner
            promotion={categoryPromotion}
            categorySlug={categorySlug}
          />
        )}

        <div className='carousel-header'>
          <ul>
            <li style={{ fontSize: '180px', fontWeight: 'bold' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  style={{ color: '#0F1B3D' }}
                >
                  <circle cx='8' cy='21' r='2'></circle>
                  <circle cx='20' cy='21' r='2'></circle>
                  <path d='M5.67 6H23l-1.68 8.39a2 2 0 0 1-2 1.61H8.75a2 2 0 0 1-2-1.74L5.23 2.74A2 2 0 0 0 3.25 1H1'></path>
                </svg>
                <h3>{categoryName}</h3>
              </div>
            </li>
          </ul>
          <div className='carousel-controls'>
            <button
              className='carousel-btn carousel-btn-left'
              onClick={() => scroll('left')}
              aria-label='Précédent'
            >‹</button>
            <button
              className='carousel-btn carousel-btn-right'
              onClick={() => scroll('right')}
              aria-label='Suivant'
            >›</button>
          </div>
        </div>

        <div
          className='carousel-container'
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
        >
          <div className='carousel-track'>
            {images.map((image, index) => (
              <div
                key={image._id || index}
                className='product-card'
                onClick={() => handleProductClick(image)}
              >
                <div className='product-image'>
                  <img
                    src={getOptimizedImageUrl(image.url, { width: 294, quality: 80 })}
                    alt={image.nom || `${categoryName} ${index + 1}`}
                    loading='lazy'
                    decoding='async'
                  />
                </div>

                <div className='product-info'>
                  <h4 className='product-name'>{image.nom || 'Sans nom'}</h4>

                  <div className='product-price'>
                    <span className='price-amount'>
                      prix:{' '}
                      {image.prix > 0
                        ? `${image.prix.toLocaleString()} ${image.devise || 'FCFA'}`
                        : 'Prix sur demande'}
                    </span>
                  </div>

                  <button
                    className='btn-order'
                    onClick={(e) => handleOrderClick(e, image)}
                    style={{ background: '#0F1B3D' }}
                  >
                    En savoir plus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )} */}
    </>
  )
}

export default ImageCarousel

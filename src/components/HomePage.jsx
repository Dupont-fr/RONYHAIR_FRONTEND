import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import * as publicService from '../services/publicService'
import * as promotionService from '../services/promotionService'
import * as analyticsService from '../services/analyticsService'

import Navbar from '../components/Navbar'
import ImageCarousel from '../components/ImageCarousel'
import ReviewSection from '../components/ReviewSection'
import Footer from './footer/Footer'
import './styles/HomePage.css'
import WhatsAppButton from './WhatsAppButton'

const HomePage = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [tombolaPromotions, setTombolaPromotions] = useState([])
  const [currentTombolaIndex, setCurrentTombolaIndex] = useState(0)
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Tracker la visite une seule fois par session logo
    const hasTracked = sessionStorage.getItem('visit_tracked')
    if (!hasTracked) {
      analyticsService.trackVisite()
      sessionStorage.setItem('visit_tracked', 'true')
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (tombolaPromotions.length > 0 && categories.length > 0) {
      const interval = setInterval(
        () => {
          setCurrentCategoryIndex((prev) => (prev + 1) % categories.length)
        },
        (tombolaPromotions[currentTombolaIndex]?.dureeAffichage || 10) * 1000,
      )
      return () => clearInterval(interval)
    }
  }, [tombolaPromotions, categories, currentTombolaIndex])

  const loadData = async () => {
    try {
      setLoading(true)
      const [categoriesData, tombolaData] = await Promise.all([
        publicService.getPublicCategories(),
        promotionService.getTombolaPromotions(),
      ])
      setCategories(categoriesData.categories || [])
      setTombolaPromotions(tombolaData.promotions || [])
      setError(null)
    } catch (err) {
      console.error('Erreur chargement:', err)
      setError('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const WarningIcon = () => (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='#DC2626'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z' />
    </svg>
  )

  const ToolsIcon = () => (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='#6B7280'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z' />
    </svg>
  )

  if (loading) {
    return (
      <div className='loading-container'>
        <div className='spinner'></div>
        <p>Chargement...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='error-container'>
        <p style={{ display: 'flex', alignItems: 'center' }}>
          <WarningIcon />
          {error}
        </p>
        <button onClick={loadData}>
          Verifier votre connexionn internet et Réessayer
        </button>
      </div>
    )
  }

  const activeTombola = tombolaPromotions[currentTombolaIndex]

  return (
    <div className='homepage'>
      <Navbar categories={categories} />

      <header className='hero-header'>
        <div className='hero-overlay'></div>
        <div className='hero-content'>
          <h1 className='brand-name'>RONY HAIR 237</h1>
          <p className='brand-tagline'>Institut de Beauté et de Bien-être.</p>
          <hr></hr>
          <p className='brand-tagline'>
            Chaque service est réalisé avec passion pour révéler votre éclat
            naturel.
          </p>
        </div>
      </header>

      <section className='categories-section'>
        <div className='section-header'>
          <h2>TOUT CE QUE NOUS FAISONS POUR VOUS.</h2>
          {/* <h2>DÉCOUVREZ NOS CRÉATIONS EN BOIS</h2> */}
          {/* <h2>NOTRE BOIS FAIT SUR MESURE POUR VOUS</h2> */}
          <p className='section-description'>
            Découvrez notre savoir-faire professionnel : coiffure femmes, hommes
            et enfants, soins du visage et du corps, gommage corporel et hammam,
            massages relaxants, onglerie, makeup et bien plus encore.{' '}
            {/*Chaque pièce est fabriquée avec passion pour
            embellir votre intérieur. */}
          </p>
        </div>

        {categories.length === 0 ? (
          <div className='empty-state'>
            <p style={{ display: 'flex', alignItems: 'center' }}>
              <ToolsIcon />
              Nos services seront bientôt disponibles...
            </p>
          </div>
        ) : (
          <div className='categories-list'>
            {categories.map((category, index) => (
              <ImageCarousel
                key={category.id}
                images={category.images}
                categoryName={category.nom}
                categoryId={category.id}
                categorySlug={category.slug}
                showTombola={index === currentCategoryIndex && activeTombola}
                tombolaPromotion={activeTombola}
                allCategories={categories}
              />
            ))}
          </div>
        )}
      </section>

      <ReviewSection />
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default HomePage

import React, { useEffect, useState, useRef } from 'react'
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

const CACHE_KEY = 'homepage_data'
const CACHE_TTL = 5 * 60 * 1000

const getCache = () => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp > CACHE_TTL) { sessionStorage.removeItem(CACHE_KEY); return null }
    return data
  } catch { return null }
}

const setCache = (data) => {
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() })) } catch { }
}

const HomePage = () => {
  const navigate = useNavigate()
  const cached = getCache()
  const [categories, setCategories] = useState(cached?.categories || [])
  const [tombolaPromotions, setTombolaPromotions] = useState(cached?.promotions || [])
  const [currentTombolaIndex, setCurrentTombolaIndex] = useState(0)
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)
  const [loading, setLoading] = useState(!cached)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const loadedRef = useRef(false)

  useEffect(() => {
    const hasTracked = sessionStorage.getItem('visit_tracked')
    if (!hasTracked) {
      analyticsService.trackVisite()
      sessionStorage.setItem('visit_tracked', 'true')
    }
  }, [])

  useEffect(() => {
    if (!cached) loadData()
    else loadedRef.current = true
  }, [])

  useEffect(() => {
    if (tombolaPromotions.length > 0 && categories.length > 0) {
      const interval = setInterval(() => {
        setCurrentCategoryIndex((prev) => (prev + 1) % categories.length)
      }, (tombolaPromotions[currentTombolaIndex]?.dureeAffichage || 10) * 1000)
      return () => clearInterval(interval)
    }
  }, [tombolaPromotions, categories, currentTombolaIndex])

  const loadData = async () => {
    try {
      const [categoriesData, tombolaData] = await Promise.all([
        publicService.getPublicCategories(),
        promotionService.getTombolaPromotions(),
      ])
      const data = { categories: categoriesData.categories || [], promotions: tombolaData.promotions || [] }
      setCache(data)
      setCategories(data.categories)
      setTombolaPromotions(data.promotions)
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement')
    } finally { setLoading(false); loadedRef.current = true }
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
          <p className='brand-tagline'>Chaque service est réalisé avec passion pour révéler votre éclat naturel.</p>
        </div>
      </header>

      {error && !cached ? (
        <div className='error-container'>
          <p>{error}</p>
          <button onClick={loadData}>Vérifier votre connexion internet et Réessayer</button>
        </div>
      ) : (
        <section className='categories-section'>
          <div className='section-header'>
            <h2>TOUT CE QUE NOUS FAISONS POUR VOUS.</h2>
            <p className='section-description'>
              Découvrez notre savoir-faire professionnel : coiffure femmes, hommes et enfants, soins du visage et du corps, gommage corporel et hammam, massages relaxants, onglerie, makeup et bien plus encore.
            </p>
          </div>

          {loading ? (
            <div className='categories-skeleton'>
              {[1, 2, 3].map((i) => (
                <div key={i} className='skeleton-card'>
                  <div className='skeleton-img' />
                  <div className='skeleton-title' />
                  <div className='skeleton-text' />
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className='empty-state'>
              <p>Nos services seront bientôt disponibles...</p>
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
                  categoryPromotion={category.promotion}
                />
              ))}
            </div>
          )}
        </section>
      )}

      <ReviewSection />
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default HomePage

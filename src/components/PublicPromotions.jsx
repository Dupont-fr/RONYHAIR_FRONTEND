import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getActivePromotions } from '../services/promotionService'
import Navbar from './Navbar'
import Footer from './footer/Footer'
import CountdownTimer from './promos/CountdownTimer'
import './styles/PublicPromotions.css'

const PublicPromotions = () => {
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { loadPromotions() }, [])

  const loadPromotions = async () => {
    const start = Date.now()
    setLoading(true)
    try {
      const data = await getActivePromotions()
      setPromotions(data.promotions || [])
      setError(null)
    } catch (err) { setError('Erreur lors du chargement') }
    finally {
      const elapsed = Date.now() - start
      setTimeout(() => setLoading(false), Math.max(0, 300 - elapsed))
    }
  }

  if (loading) {
    return (
      <>
        <Navbar categories={[]} />
        <div className='loading-container'><div className='spinner'></div><p>Chargement des promotions...</p></div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar categories={[]} />
        <div className='error-container'>
          <p>{error}</p>
          <button onClick={loadPromotions}>Réessayer</button>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className='promotions-page'>
        <div className='promotions-hero'>
          <h1>Nos Promotions</h1>
          <p>Profitez de nos offres exceptionnelles</p>
        </div>

        <div className='promotions-container'>
          {promotions.length === 0 ? (
            <div className='empty-state'>
              <svg width='80' height='80' viewBox='0 0 24 24' fill='#ccc'>
                <path d='M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m4-6a4 4 0 118 0' stroke='#ccc' strokeWidth='1' />
              </svg>
              <h3>Aucune promotion en cours</h3>
              <p>Revenez bientôt pour découvrir nos offres spéciales !</p>
              <Link to='/' className='btn-home'>Retour à l'accueil</Link>
            </div>
          ) : (
            <div className='promotions-grid'>
              {promotions.map((promo) => (
                <div key={promo._id} className={`promo-card ${promo.type}`}
                  style={promo.image ? { backgroundImage: `url(${promo.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                  {promo.image && <div className='promo-card-overlay' />}
                  <div className='promo-card-content'>
                    <span className={`promo-badge ${promo.type}`}>
                      {promo.type === 'stock-limite' ? 'Stock Limité' : 'Tombola'}
                    </span>
                    <h3 className='promo-card-title'>{promo.nom}</h3>
                    {promo.description && <p className='promo-card-desc'>{promo.description}</p>}
                    <div className='promo-card-timer'>
                      <CountdownTimer dateFin={promo.dateFin} />
                    </div>
                    {promo.type === 'stock-limite' && promo.categorie && (
                      <Link to={`/category/${promo.categorie.slug || ''}`} className='promo-card-link'>
                        Voir le service →
                      </Link>
                    )}
                    {promo.type === 'tombola' && promo.gains && promo.gains.length > 0 && (
                      <div className='promo-gains'>
                        <strong>À gagner :</strong>
                        <ul>
                          {promo.gains.map((gain, i) => <li key={i}>{gain}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default PublicPromotions

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import * as publicService from '../services/publicService'
import Navbar from './Navbar'
import Footer from './footer/Footer'
import './styles/PublicCategoriesList.css'

const PublicCategoriesList = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { loadCategories() }, [])

  const loadCategories = async () => {
    const start = Date.now()
    setLoading(true)
    try {
      const data = await publicService.getPublicCategories()
      setCategories(data.categories || [])
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
        <div className='loading-container'><div className='spinner'></div><p>Chargement de nos services...</p></div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar categories={[]} />
        <div className='error-container'>
          <p>{error}</p>
          <button onClick={loadCategories}>Réessayer</button>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar categories={categories} />
      <div className='public-categories-page'>
        <div className='categories-hero'>
          <h1>Nos Services</h1>
          <p>Découvrez toutes nos prestations par Services</p>
        </div>

        <div className='categories-container'>
          {categories.length === 0 ? (
            <div className='empty-state'>
              <h3>Aucune prestation disponible</h3>
              <p>Nos services seront bientôt disponibles...</p>
              <Link to='/' className='btn-home'>Retour à l'accueil</Link>
            </div>
          ) : (
            <div className='categories-grid'>
              {categories.map((category) => (
                <Link key={category.id} to={`/category/${category.slug}`} className='category-card'>
                  {category.images && category.images.length > 0 && (
                    <div className='category-image'>
                      <img src={category.images[0].url} alt={category.nom} loading='lazy' />
                      <div className='overlay'><span className='view-text'>Voir les prestations →</span></div>
                    </div>
                  )}
                  <div className='category-info'>
                    <h3>{category.nom}</h3>
                    {category.description && <p className='category-description'>{category.description}</p>}
                    <div className='category-meta'>
                      <span className='product-count'>{category.nombreImages} {category.nombreImages > 1 ? 'prestations' : 'prestation'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default PublicCategoriesList
